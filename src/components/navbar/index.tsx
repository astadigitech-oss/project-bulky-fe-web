"use client";

import React, { useState, useSyncExternalStore } from "react";
import { Button } from "@ui/button";
import { Phone, LogOut, User, CreditCard, Package, Users, Gavel } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@i18n/navigation";
import { CartMyIcon } from "@svg/cart-icon";
import { UserAvatar } from "@ui/avatar";
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
import { useApiQuery } from "@/lib/query/use-query";
import type { GetCartResponse } from "@/services/cart/types";
import { AuctionBidsDialog } from "./auction-bids-dialog";
import type { WebSeasonalCampaignResponse } from "@/services/seasonal-campaign/types";

export const Navbar = () => {
  const t = useTranslations("Header.auth");
  const topBarT = useTranslations("Header.topBar");
  const headerT = useTranslations("Header");
  const auctionT = useTranslations("Auction");
  const { user, isAuthenticated, isLoading, logout } = useSession();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const cartQuery = useApiQuery<GetCartResponse>({
    key: ["cart"],
    endpoint: "/carts",
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  const cartCount = cartQuery.data?.data?.data?.length ?? 0;
  const [bidsOpen, setBidsOpen] = useState(false);
  const [failedSeasonalLogoUrl, setFailedSeasonalLogoUrl] = useState<string | null>(null);
  const [failedSeasonalDecorationUrl, setFailedSeasonalDecorationUrl] = useState<string | null>(null);

  const seasonalCampaignQuery = useApiQuery<WebSeasonalCampaignResponse>({
    key: ["seasonal-campaign", "web"],
    endpoint: "/web/seasonal-campaign",
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
  const seasonalCampaign = seasonalCampaignQuery.data?.data ?? null;
  const seasonalLogoUrl = seasonalCampaign?.web_logo_url ?? null;
  const seasonalDecorationUrl = seasonalCampaign?.web_navbar_decoration_url ?? null;
  const showSeasonalLogo = !!seasonalLogoUrl && failedSeasonalLogoUrl !== seasonalLogoUrl;
  const showSeasonalDecoration =
    !!seasonalDecorationUrl && failedSeasonalDecorationUrl !== seasonalDecorationUrl;
  const activeSeasonalLogoUrl = showSeasonalLogo ? seasonalLogoUrl : null;
  const logoHeightClass = "h-7";

  return (
    <header className="sticky -top-10 w-full z-50">
      <div className="flex items-center gap-2 h-10 bg-yellow-400 text-xs px-8 font-medium">
        <Phone className="fill-black size-3" />
        <p>{topBarT("phone")}</p>
        <p>|</p>
        <p>{topBarT("shippingInfo")}</p>
      </div>
      <nav className="relative z-30 px-8 h-16 flex items-center bg-white w-full shadow-lg">
        <div className="xl:max-w-7xl max-w-5xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={"/"}>
              <Button className="p-1 h-auto" variant="ghost">
                <div className={`relative aspect-19/4 ${logoHeightClass}`}>
                  <Image
                    src={activeSeasonalLogoUrl ?? "/assets/images/logo-bulky.webp"}
                    alt={
                      activeSeasonalLogoUrl
                        ? `Bulky ${seasonalCampaign?.name ?? ""}`
                        : "Bulky"
                    }
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 1280px"
                    onError={() => {
                      if (activeSeasonalLogoUrl) {
                        setFailedSeasonalLogoUrl(activeSeasonalLogoUrl);
                      }
                    }}
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
              <Button size={"icon"} variant={"outline"} className="relative">
                <CartMyIcon />
                <span className="sr-only">{headerT("cart")}</span>
                {isAuthenticated && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {!mounted || isLoading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcf02]">
                  <UserAvatar
                    src={user.photo_url}
                    name={user.name}
                    className="size-8"
                    fallbackClassName="bg-[#ffcf02] text-black text-xs font-bold"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
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
                    <DropdownMenuItem render={<Link href="/profile/edit" />}>
                      <User className="mr-2 h-4 w-4" />
                      {t("profile")}
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<Link href="/profile/payments" />}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      {t("payment")}
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<Link href="/profile/orders" />}>
                      <Package className="mr-2 h-4 w-4" />
                      {t("orders")}
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<Link href="/profile/group-buy" />}>
                      <Users className="mr-2 h-4 w-4" />
                      {t("patungan")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setBidsOpen(true)}>
                      <Gavel className="mr-2 h-4 w-4" />
                      {auctionT("myBids")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
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
      {showSeasonalDecoration && seasonalDecorationUrl && (
        <div className="pointer-events-none absolute -mt-1 left-0 top-full z-20 aspect-[12/1] w-full overflow-hidden">
          <Image
            src={seasonalDecorationUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            onError={() => setFailedSeasonalDecorationUrl(seasonalDecorationUrl)}
          />
        </div>
      )}
      <AuctionBidsDialog open={bidsOpen} onOpenChange={setBidsOpen} />
    </header>
  );
};
