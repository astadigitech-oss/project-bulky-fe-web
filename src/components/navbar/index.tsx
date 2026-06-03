"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@ui/button";
import { Phone, LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@i18n/navigation";
import { CartMyIcon } from "@svg/cart-icon";
import { Avatar, AvatarFallback } from "@ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { LocaleSwitcher } from "@components/navbar/locale-switcher";
import { Navigation } from "./navigation";
import { Search } from "./search";
import { useSession } from "@/providers/session-provider";

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export const Navbar = () => {
  const t = useTranslations("Header.auth");
  const topBarT = useTranslations("Header.topBar");
  const { user, isAuthenticated, isLoading, logout } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky -top-10 w-full z-50">
      <div className="flex items-center gap-2 h-10 bg-yellow-400 text-xs px-8 font-medium">
        <Phone className="fill-black size-3" />
        <p>{topBarT("phone")}</p>
        <p>|</p>
        <p>{topBarT("shippingInfo")}</p>
      </div>
      <nav className="px-8 h-16 flex items-center bg-white w-full shadow-lg">
        <div className="xl:max-w-7xl max-w-5xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={"/"}>
              <Button className="p-1 h-auto" variant="ghost">
                <div className="relative h-7 aspect-19/4">
                  <Image
                    src={"/assets/images/logo-bulky.webp"}
                    alt="logo_bulky"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 1280px"
                  />
                </div>
              </Button>
            </Link>
            <Navigation />
          </div>
          <div className="flex items-center gap-3 w-full justify-end">
            <Search />
            <LocaleSwitcher />
            <Link href={"/cart"}>
              <Button size={"icon"} variant={"outline"}>
                <CartMyIcon />
              </Button>
            </Link>

            {!mounted || isLoading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcf02]">
                  <Avatar className={"size-8"}>
                    <AvatarFallback className="bg-[#ffcf02] text-black text-xs font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold">{user.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        {user.phone}
                      </span>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem render={<Link href="/profile" />}>
                      <User className="mr-2 h-4 w-4" />
                      {t("profile")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 cursor-pointer focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href={"/login"}>
                <Button className="h-10 rounded-lg bg-[#ffcf02] px-8 text-base font-bold text-black hover:bg-[#f5c800]">
                  {t("login")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
