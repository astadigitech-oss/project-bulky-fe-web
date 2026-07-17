export type BaseAuthResponse<T = null> = {
  status: boolean;
  message: string;
  data: T;
};

export type AuthUser = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
};

export type SessionUser = AuthUser & {
  photo_url: string | null;
};

// ─── Login ────────────────────────────────────────────────────────────────────

export type LoginBody = {
  phone: string;
  password: string;
  remember_me: boolean;
};

export type LoginData = { token: string; user: AuthUser };
export type LoginResponse = BaseAuthResponse<LoginData | null>;

// ─── Register – Request OTP ───────────────────────────────────────────────────

export type RegisterRequestOtpBody = { phone: string };
export type RegisterRequestOtpResponse = BaseAuthResponse<{ retry_after: number } | null>;

// ─── Register – Verify OTP ────────────────────────────────────────────────────

export type RegisterVerifyOtpBody = { phone: string; otp: string };
export type RegisterVerifyOtpData = { token: string; expired_in: string };
export type RegisterVerifyOtpResponse = BaseAuthResponse<RegisterVerifyOtpData | null>;

// ─── Register – Complete ──────────────────────────────────────────────────────

export type RegisterBody = {
  name: string;
  token: string;
  password: string;
  confirm_password: string;
  email?: string;
};
export type RegisterResponse = BaseAuthResponse<LoginData | null>;

// ─── Forgot Password – Request OTP ───────────────────────────────────────────

export type ForgotRequestOtpBody = { phone: string };
export type ForgotRequestOtpResponse = BaseAuthResponse<null>;

// ─── Forgot Password – Verify OTP ────────────────────────────────────────────

export type ForgotVerifyOtpBody = { phone: string; otp: string };
export type ForgotVerifyOtpData = { expire_in: string; token: string };
export type ForgotVerifyOtpResponse = BaseAuthResponse<ForgotVerifyOtpData | null>;

// ─── Forgot Password – Reset ──────────────────────────────────────────────────

export type ResetPasswordBody = {
  new_password: string;
  confirm_new_password: string;
  token: string;
};
export type ResetPasswordResponse = BaseAuthResponse<null>;

// ─── Google OAuth – Login ─────────────────────────────────────────────────────

export type GoogleLoginBody = {
  authorization_code: string;
  redirect_uri: string;
};

export type GoogleLoginNewUserData = {
  needs_phone: true;
  pending_oauth_token: string;
};

export type GoogleLoginExistingUserData = {
  needs_phone: false;
  access_token: string;
  buyer: { id: string; nama: string; telepon: string; is_verified: boolean };
};

export type GoogleLoginResponse = {
  success: boolean;
  message: string;
  data: GoogleLoginNewUserData | GoogleLoginExistingUserData;
};

// ─── Google OAuth – Request OTP (add phone) ───────────────────────────────────

export type GoogleRequestOtpBody = {
  pending_oauth_token: string;
  telepon: string;
};

export type GoogleRequestOtpResponse = {
  success: boolean;
  message: string;
  data: { expires_in: number; telepon: string } | null;
};

// ─── Google OAuth – Verify OTP (finalize register) ───────────────────────────

export type GoogleVerifyOtpBody = {
  pending_oauth_token: string;
  telepon: string;
  kode: string;
};

export type GoogleVerifyOtpData = {
  access_token: string;
  buyer: { id: string; name: string; phone: string; is_verified: boolean };
  is_new_user: boolean;
};

export type GoogleVerifyOtpResponse = {
  success: boolean;
  message: string;
  data: GoogleVerifyOtpData;
};

// ─── Check Session ────────────────────────────────────────────────────────────

export type CheckSessionData = { expires_at: string; user: SessionUser };
export type CheckSessionResponse = BaseAuthResponse<CheckSessionData | null>;
