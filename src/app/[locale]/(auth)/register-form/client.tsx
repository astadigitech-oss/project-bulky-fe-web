"use client";

import RegisterFormPage from "./register-form-page";

type RegisterFormClientProps = {
  verifiedPhone?: string;
};

export default function RegisterFormClient({ verifiedPhone }: RegisterFormClientProps) {
  return <RegisterFormPage verifiedPhone={verifiedPhone} />;
}
