import type { BaseAuthResponse } from "@/services/auth/types";

// ─── Profile ──────────────────────────────────────────────────────────────────

export type ProfileData = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  image: string | null;
};

export type GetProfileResponse = BaseAuthResponse<ProfileData>;
export type BaseProfileResponse = BaseAuthResponse<null>;

// ─── Change Phone ─────────────────────────────────────────────────────────────

export type PhoneRequestOtpBody = { phone: string };
export type PhoneVerifyOtpBody = { otp: string };
export type PhoneVerifyOtpData = { phone: string; token: string };
export type PhoneVerifyOtpResponse = BaseAuthResponse<PhoneVerifyOtpData | null>;
export type UpdatePhoneBody = { token: string };

// ─── Change Email ─────────────────────────────────────────────────────────────

export type EmailRequestOtpBody = { email: string };
export type EmailVerifyOtpBody = { otp: string };
export type EmailVerifyOtpData = { email: string; token: string };
export type EmailVerifyOtpResponse = BaseAuthResponse<EmailVerifyOtpData | null>;
export type UpdateEmailBody = { token: string };

// ─── Change Password ──────────────────────────────────────────────────────────

export type ChangePasswordBody = {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
};

// ─── Addresses ────────────────────────────────────────────────────────────────

export type Address = {
  id: string;
  name: string;
  phone: string;
  is_default: boolean;
  formatted_address: string;
};

export type GetAddressesResponse = BaseAuthResponse<Address[]>;

export type AddressFormBody = {
  name: string;
  phone: string;
  address_reference?: string;
  address_detail: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  latitude: string;
  longitude: string;
};
