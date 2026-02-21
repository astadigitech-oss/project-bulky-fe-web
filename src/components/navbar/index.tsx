"use client";

import React from "react";
import { Button } from "@ui/button";
import { Phone } from "lucide-react";
import Image from "next/image";
import { Link } from "@i18n/navigation";
import { CartMyIcon } from "@svg/cart-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { LocaleSwitcher } from "@components/navbar/locale-switcher";
import { Navigation } from "./navigation";
import { Search } from "./search";

export const Navbar = () => {
  return (
    <header className="sticky -top-10 w-full z-50">
      <div className="flex items-center gap-2 h-10 bg-yellow-400 text-xs px-8 font-medium">
        <Phone className="fill-black size-3" />
        <p>0811-833-164</p>
        <p>|</p>
        <p>Hubungi kami untuk pengiriman luar Jabodetabek / Luar pulau</p>
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
            <Button size={"icon"} variant={"outline"}>
              <CartMyIcon />
            </Button>
            <Button size={"icon"} variant={"ghost"} className={"rounded-full"}>
              <Avatar className={"size-8"}>
                <AvatarFallback>AF</AvatarFallback>
                <AvatarImage
                  src={"/assets/images/logo-bulky.webp"}
                  alt="user_profile"
                />
              </Avatar>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};
