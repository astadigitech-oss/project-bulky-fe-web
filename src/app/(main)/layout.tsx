import React from "react";
import { Locale } from "next-intl";
import { cookies } from "next/headers";
import { Navbar } from "@/components/navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const changeLocaleAction = async (locale: Locale) => {
    "use server";
    const store = await cookies();
    store.set("locale", locale);
  };

  return (
    <div className="flex flex-col">
      <Navbar changeLocaleAction={changeLocaleAction} />
      {children}
    </div>
  );
};

export default MainLayout;
