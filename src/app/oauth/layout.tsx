import { ReactNode } from "react";
import "@/app/globals.css";

export default function OAuthLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0, fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
