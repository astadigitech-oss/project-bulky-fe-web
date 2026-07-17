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

// ─── Upload Photo ─────────────────────────────────────────────────────────────

export type UploadPhotoData = {
  path: string;
  url: string;
};

export type UploadPhotoResponse = BaseAuthResponse<UploadPhotoData>;

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
  label: string;
  name: string;
  phone: string;
  is_default: boolean;
  formatted_address: string;
};

export type AddressDetail = {
  id: string;
  label: string;
  name: string;
  phone: string;
  is_default: boolean;
  address_detail: string;
  address_reference: string | null;
  village: string | null;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  latitude: string | null;
  longitude: string | null;
};

export type GetAddressesResponse = BaseAuthResponse<Address[]>;
export type GetAddressDetailResponse = BaseAuthResponse<AddressDetail>;

export type AddressFormBody = {
  label?: string;
  name: string;
  phone: string;
  address_reference?: string;
  address_detail: string;
  village?: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  latitude: string;
  longitude: string;
};
