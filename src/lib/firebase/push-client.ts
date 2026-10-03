import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getMessaging,
  isSupported,
  onMessage,
  onRegistered,
  onUnregistered,
  register,
  unregister,
  type MessagePayload,
  type Messaging,
} from "firebase/messaging";

const fidStorageKey = "bulky.push.fid.v1";
let currentLocale: "id" | "en" = "id";

function firebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };
}

export function isWebPushConfigured() {
  const config = firebaseConfig();
  return !!(
    config.apiKey &&
    config.projectId &&
    config.messagingSenderId &&
    config.appId &&
    process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
  );
}

async function messagingClient(): Promise<Messaging | null> {
  if (!(await isSupported()) || !isWebPushConfigured()) return null;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig());
  return getMessaging(app);
}

async function saveFID(fid: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(fidStorageKey, fid);
  try {
    const response = await fetch("/api/proxy/notifications/devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fid, platform: "web", locale: currentLocale }),
    });
    if (!response.ok) console.warn("Could not register this push device with Bulky.");
  } catch {
    console.warn("Could not reach Bulky while registering this push device.");
  }
}

async function removeFID(fid: string) {
  if (!fid || typeof window === "undefined") return;
  if (window.localStorage.getItem(fidStorageKey) === fid) {
    window.localStorage.removeItem(fidStorageKey);
  }
  try {
    await fetch("/api/proxy/notifications/devices", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fid }),
    });
  } catch {
    // The server also removes FIDs rejected by FCM on a later send.
  }
}

let listenersReady = false;
function attachMessagingListeners(messaging: Messaging) {
  if (listenersReady) return;
  listenersReady = true;
  onRegistered(messaging, (fid) => void saveFID(fid));
  onUnregistered(messaging, (fid) => void removeFID(fid));
  onMessage(messaging, (payload: MessagePayload) => {
    window.dispatchEvent(new CustomEvent("bulky:push-message", { detail: payload }));
  });
}

export async function registerCurrentWebPush(locale: string = "id") {
  currentLocale = locale === "en" ? "en" : "id";
  const messaging = await messagingClient();
  if (!messaging || !("serviceWorker" in navigator)) return false;
  const serviceWorkerRegistration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
    { scope: "/", updateViaCache: "none" },
  );
  attachMessagingListeners(messaging);
  await register(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration,
  });
  const existingFID = window.localStorage.getItem(fidStorageKey);
  if (existingFID) await saveFID(existingFID);
  return true;
}

export async function unregisterCurrentWebPush() {
  if (typeof window === "undefined") return;
  const fid = window.localStorage.getItem(fidStorageKey);
  if (!fid) return;
  await removeFID(fid);
  try {
    const messaging = await messagingClient();
    if (messaging) await unregister(messaging);
  } catch {
    // Logout must proceed even if the browser cannot contact FCM.
  }
}
