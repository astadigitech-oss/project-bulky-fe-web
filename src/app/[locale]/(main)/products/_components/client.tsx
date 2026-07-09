"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BannerSection } from "./_section/banner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowDownWideNarrow,
  Banknote,
  Blend,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FilterX,
  Gem,
  Hexagon,
  LayoutGrid,
  MoreHorizontal,
  Package,
  SwatchBook,
  TicketPercent,
} from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useApiQuery } from "@/lib/query/use-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

type Locale = "id" | "en";

type FilterOption = { label: string; value: string };

type FilterResponse = {
  success: boolean;
  message: string;
  data: {
    categories: FilterOption[];
    sources: FilterOption[];
    brands: FilterOption[];
    product_conditions: FilterOption[];
    package_conditions: FilterOption[];
    price: { low: number; high: number };
    banner: string[];
  };
};

type ProductCard = {
  name: string;
  slug: string;
  price: { old_price: string; current_price: string };
  image: string;
  stock: number;
  warehouse: string;
  is_sold: boolean;
};

type ProductListResponse = {
  success: boolean;
  message: string;
  data: ProductCard[];
  meta: {
    first_page: number;
    last_page: number;
    current_page: number;
    total_items: number;
    per_page: number;
  };
};

const clampLocale = (value?: string): Locale => (value === "en" ? "en" : "id");

const parseRupiahToNumber = (value: string) =>
  Number(value.replace(/[^\d]/g, "")) || 0;

const getDiscountPercent = (oldPrice: string, currentPrice: string) => {
  const oldNum = parseRupiahToNumber(oldPrice);
  const currentNum = parseRupiahToNumber(currentPrice);

  if (oldNum <= 0 || currentNum <= 0 || currentNum >= oldNum) return 0;

  return Math.round(((oldNum - currentNum) / oldNum) * 100);
};

export const ProductClient = () => {
  const t = useTranslations("Products");
  const params = useParams<{ locale: string }>();
  const router = useRouter();
  const pathname = `/` + (params?.locale ?? "id") + `/products`;
  const query = useSearchParams();

  const locale = clampLocale(params?.locale);

  const [page, setPage] = useState(Number(query.get("p") ?? "1") || 1);
  const [searchInput, setSearchInput] = useState(query.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);

  // Sync searchInput saat URL ?q= berubah dari luar (misal navigasi dari navbar)
  const qFromUrl = query.get("q") ?? "";
  const skipUrlSyncRef = React.useRef(false);
  useEffect(() => {
    skipUrlSyncRef.current = true;
    setSearchInput(qFromUrl);
    setDebouncedSearch(qFromUrl);
  }, [qFromUrl]);

  const initialHasPriceFilter = Boolean(
    query.get("min-price") || query.get("max-price"),
  );
  const initialMinPrice = Number(query.get("min-price") ?? 0);
  const initialMaxPrice = Number(query.get("max-price") ?? 0);

  const [hasPriceFilter, setHasPriceFilter] = useState(initialHasPriceFilter);

  const [showMore, setShowMore] = useState({
    category: false,
    brand: false,
    packageCondition: false,
    productCondition: false,
    source: false,
  });

  const [selected, setSelected] = useState({
    category: (query.get("category") ?? "") as string,
    source: (query.get("source") ?? "") as string,
    packageCondition: (query.get("package-condition") ?? "") as string,
    productCondition: (query.get("product-condition") ?? "") as string,
    brands: query.getAll("brand"),
  });

  const [sortOrder, setSortOrder] = useState<"new" | "cheap" | "expensive">(
    (query.get("order") as "new" | "cheap" | "expensive") || "new",
  );

  const filterQuery = useApiQuery<FilterResponse>({
    key: ["product-filters", locale],
    endpoint: "/web/products/filters",
    searchParams: { locale },
  });

  const defaultPriceRange = useMemo(() => {
    const low = filterQuery.data?.data.price.low ?? 1_000_000;
    const high = filterQuery.data?.data.price.high ?? 20_000_000;
    return [low, high] as [number, number];
  }, [filterQuery.data?.data.price.low, filterQuery.data?.data.price.high]);

  const initialPriceRange: [number, number] = initialHasPriceFilter
    ? [
        initialMinPrice || defaultPriceRange[0],
        initialMaxPrice || defaultPriceRange[1],
      ]
    : defaultPriceRange;

  const [priceRange, setPriceRange] =
    useState<[number, number]>(initialPriceRange);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (skipUrlSyncRef.current) {
      skipUrlSyncRef.current = false;
      return;
    }
    const sp = new URLSearchParams();

    if (page > 1) sp.set("p", String(page));
    if (debouncedSearch.trim()) sp.set("q", debouncedSearch.trim());
    if (selected.category) sp.set("category", selected.category);
    if (selected.source) sp.set("source", selected.source);
    if (selected.packageCondition) {
      sp.set("package-condition", selected.packageCondition);
    }
    if (selected.productCondition) {
      sp.set("product-condition", selected.productCondition);
    }
    if (sortOrder !== "new") sp.set("order", sortOrder);
    selected.brands.forEach((brand) => sp.append("brand", brand));

    if (hasPriceFilter) {
      sp.set("min-price", String(priceRange[0]));
      sp.set("max-price", String(priceRange[1]));
    }

    const nextQuery = sp.toString();
    const currentQuery = query.toString();

    if (nextQuery !== currentQuery) {
      router.replace(`${pathname}${nextQuery ? `?${nextQuery}` : ""}`);
    }
  }, [
    defaultPriceRange,
    debouncedSearch,
    page,
    pathname,
    priceRange,
    query,
    router,
    selected,
    sortOrder,
    hasPriceFilter,
  ]);

  const productQuery = useApiQuery<ProductListResponse>({
    key: [
      "product-list",
      locale,
      page,
      selected,
      sortOrder,
      priceRange,
      debouncedSearch,
    ],
    endpoint: "/web/products",
    searchParams: {
      local: locale,
      p: page,
      category: selected.category || undefined,
      source: selected.source || undefined,
      "package-condition": selected.packageCondition || undefined,
      "product-condition": selected.productCondition || undefined,
      "min-price": hasPriceFilter ? String(priceRange[0]) : undefined,
      "max-price": hasPriceFilter ? String(priceRange[1]) : undefined,
      q: debouncedSearch.trim() || undefined,
      order: sortOrder,
      sort: sortOrder === "new" ? "desc" : "asc",
      brand: selected.brands.length ? selected.brands : undefined,
    },
  });

  const updatePage = (next: number) => {
    setPage(next);
  };

  const totalApplied =
    Number(Boolean(selected.category)) +
    Number(Boolean(selected.source)) +
    Number(Boolean(selected.packageCondition)) +
    Number(Boolean(selected.productCondition)) +
    Number(hasPriceFilter) +
    Number(Boolean(debouncedSearch.trim())) +
    selected.brands.length;

  const resetFilter = () => {
    setSelected({
      category: "",
      source: "",
      packageCondition: "",
      productCondition: "",
      brands: [],
    });
    setSearchInput("");
    setDebouncedSearch("");
    setSortOrder("new");
    setPriceRange(defaultPriceRange);
    setHasPriceFilter(false);
    setPage(1);
  };

  const meta = productQuery.data?.meta;

  return (
    <div className="flex flex-col w-full">
      {/* <BannerSection images={filterQuery.data?.data.banner ?? []} /> */}
      <div className="grid grid-cols-4 w-full px-17.5 mx-auto xl:max-w-7xl max-w-5xl gap-6">
        <div className="col-span-1">
          <div className="sticky top-16 pt-5">
            <div className="h-10 w-full bg-white flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="font-medium">{t("filterTitle")}</h2>
                <p className="text-xs text-gray-500">
                  {t("filterApplied", { count: String(totalApplied) })}
                </p>
              </div>
              <Button
                size={"icon-sm"}
                className={"bg-yellow-400 hover:bg-yellow-500 text-black"}
                onClick={resetFilter}
              >
                <FilterX className="size-3.5" />
              </Button>
            </div>
            <div className="overflow-y-scroll max-h-[calc(100svh-64px-32px-40px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden]">
              <div className="h-5 bg-linear-to-b from-white via-white/80 to-white/50 absolute top-15 left-0 w-full z-10 " />
              <div className="h-5 w-full" />
              <Accordion multiple defaultValue={["category"]}>
                <AccordionItem value={"category"}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="size-3.5!" />
                      <span>{t("category")}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {(filterQuery.data?.data.categories ?? [])
                      .slice(0, showMore.category ? 999 : 3)
                      .map((item) => (
                        <Label
                          key={item.value}
                          className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                        >
                          <Checkbox
                            checked={selected.category === item.value}
                            onCheckedChange={(v) => {
                              setSelected((prev) => ({
                                ...prev,
                                category: v ? item.value : "",
                              }));
                              setPage(1);
                            }}
                          />
                          <span>{item.label}</span>
                        </Label>
                      ))}
                    {(filterQuery.data?.data.categories?.length ?? 0) > 3 && (
                      <Collapsible>
                        <CollapsibleContent />
                        <CollapsibleTrigger
                          className="text-xs text-center w-full flex items-center gap-2 pl-3 h-7 hover:underline hover:underline-offset-2 font-semibold text-yellow-600"
                          onClick={() =>
                            setShowMore((prev) => ({
                              ...prev,
                              category: !prev.category,
                            }))
                          }
                        >
                          <span className="whitespace-nowrap">
                            {showMore.category ? t("showLess") : t("showMore")}
                          </span>
                          <ChevronDown
                            className={cn(
                              "flex-none size-3",
                              showMore.category && "rotate-180",
                            )}
                          />
                        </CollapsibleTrigger>
                      </Collapsible>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value={"brand"}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Hexagon className="size-3.5!" />
                      <span>{t("brand")}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {(filterQuery.data?.data.brands ?? [])
                      .slice(0, showMore.brand ? 999 : 3)
                      .map((item) => (
                        <Label
                          key={item.value}
                          className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                        >
                          <Checkbox
                            checked={selected.brands.includes(item.value)}
                            onCheckedChange={(v) => {
                              setSelected((prev) => ({
                                ...prev,
                                brands: v
                                  ? [...prev.brands, item.value]
                                  : prev.brands.filter((b) => b !== item.value),
                              }));
                              setPage(1);
                            }}
                          />
                          <span>{item.label}</span>
                        </Label>
                      ))}
                    {(filterQuery.data?.data.brands?.length ?? 0) > 3 && (
                      <Collapsible>
                        <CollapsibleContent />
                        <CollapsibleTrigger
                          className="text-xs text-center w-full flex items-center gap-2 pl-3 h-7 hover:underline hover:underline-offset-2 font-semibold text-yellow-600"
                          onClick={() =>
                            setShowMore((prev) => ({
                              ...prev,
                              brand: !prev.brand,
                            }))
                          }
                        >
                          <span className="whitespace-nowrap">
                            {showMore.brand ? t("showLess") : t("showMore")}
                          </span>
                          <ChevronDown
                            className={cn(
                              "flex-none size-3",
                              showMore.brand && "rotate-180",
                            )}
                          />
                        </CollapsibleTrigger>
                      </Collapsible>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value={"price"}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Banknote className="size-3.5!" />
                      <span>{t("price")}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-6 my-2 pt-6 border p-2 rounded-xl border-yellow-500">
                      <Slider
                        value={priceRange}
                        onValueChange={(v) => {
                          setPriceRange(v as [number, number]);
                          setHasPriceFilter(true);
                          setPage(1);
                        }}
                        min={defaultPriceRange[0]}
                        max={defaultPriceRange[1]}
                      />
                      <div className="flex flex-col gap-2">
                        <InputGroup>
                          <InputGroupInput
                            className="text-xs!"
                            value={formatRupiah(priceRange[0])}
                            readOnly
                          />
                          <InputGroupAddon>
                            <InputGroupText className="text-xs">
                              Min.
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        <InputGroup>
                          <InputGroupInput
                            className="text-xs!"
                            value={formatRupiah(priceRange[1])}
                            readOnly
                          />
                          <InputGroupAddon>
                            <InputGroupText className="text-xs">
                              Max.
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value={"package-condition"}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Package className="size-3.5!" />
                      <span>{t("packageCondition")}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {(filterQuery.data?.data.package_conditions ?? [])
                      .slice(0, showMore.packageCondition ? 999 : 3)
                      .map((item) => (
                        <Label
                          key={item.value}
                          className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                        >
                          <Checkbox
                            checked={selected.packageCondition === item.value}
                            onCheckedChange={(v) => {
                              setSelected((prev) => ({
                                ...prev,
                                packageCondition: v ? item.value : "",
                              }));
                              setPage(1);
                            }}
                          />
                          <span>{item.label}</span>
                        </Label>
                      ))}
                    {(filterQuery.data?.data.package_conditions?.length ?? 0) >
                      3 && (
                      <Collapsible>
                        <CollapsibleContent />
                        <CollapsibleTrigger
                          className="text-xs text-center w-full flex items-center gap-2 pl-3 h-7 hover:underline hover:underline-offset-2 font-semibold text-yellow-600"
                          onClick={() =>
                            setShowMore((prev) => ({
                              ...prev,
                              packageCondition: !prev.packageCondition,
                            }))
                          }
                        >
                          <span className="whitespace-nowrap">
                            {showMore.packageCondition
                              ? t("showLess")
                              : t("showMore")}
                          </span>
                          <ChevronDown
                            className={cn(
                              "flex-none size-3",
                              showMore.packageCondition && "rotate-180",
                            )}
                          />
                        </CollapsibleTrigger>
                      </Collapsible>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value={"product-condition"}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <SwatchBook className="size-3.5!" />
                      <span>{t("productCondition")}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {(filterQuery.data?.data.product_conditions ?? [])
                      .slice(0, showMore.productCondition ? 999 : 3)
                      .map((item) => (
                        <Label
                          key={item.value}
                          className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                        >
                          <Checkbox
                            checked={selected.productCondition === item.value}
                            onCheckedChange={(v) => {
                              setSelected((prev) => ({
                                ...prev,
                                productCondition: v ? item.value : "",
                              }));
                              setPage(1);
                            }}
                          />
                          <span>{item.label}</span>
                        </Label>
                      ))}
                    {(filterQuery.data?.data.product_conditions?.length ?? 0) >
                      3 && (
                      <Collapsible>
                        <CollapsibleContent />
                        <CollapsibleTrigger
                          className="text-xs text-center w-full flex items-center gap-2 pl-3 h-7 hover:underline hover:underline-offset-2 font-semibold text-yellow-600"
                          onClick={() =>
                            setShowMore((prev) => ({
                              ...prev,
                              productCondition: !prev.productCondition,
                            }))
                          }
                        >
                          <span className="whitespace-nowrap">
                            {showMore.productCondition
                              ? t("showLess")
                              : t("showMore")}
                          </span>
                          <ChevronDown
                            className={cn(
                              "flex-none size-3",
                              showMore.productCondition && "rotate-180",
                            )}
                          />
                        </CollapsibleTrigger>
                      </Collapsible>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value={"source"}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Blend className="size-3.5!" />
                      <span>{t("source")}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {(filterQuery.data?.data.sources ?? [])
                      .slice(0, showMore.source ? 999 : 3)
                      .map((item) => (
                        <Label
                          key={item.value}
                          className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                        >
                          <Checkbox
                            checked={selected.source === item.value}
                            onCheckedChange={(v) => {
                              setSelected((prev) => ({
                                ...prev,
                                source: v ? item.value : "",
                              }));
                              setPage(1);
                            }}
                          />
                          <span>{item.label}</span>
                        </Label>
                      ))}
                    {(filterQuery.data?.data.sources?.length ?? 0) > 3 && (
                      <Collapsible>
                        <CollapsibleContent />
                        <CollapsibleTrigger
                          className="text-xs text-center w-full flex items-center gap-2 pl-3 h-7 hover:underline hover:underline-offset-2 font-semibold text-yellow-600"
                          onClick={() =>
                            setShowMore((prev) => ({
                              ...prev,
                              source: !prev.source,
                            }))
                          }
                        >
                          <span className="whitespace-nowrap">
                            {showMore.source ? t("showLess") : t("showMore")}
                          </span>
                          <ChevronDown
                            className={cn(
                              "flex-none size-3",
                              showMore.source && "rotate-180",
                            )}
                          />
                        </CollapsibleTrigger>
                      </Collapsible>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <div className="min-h-[calc(100svh-64px-32px-20px)] pt-5 flex flex-col gap-4">
            <Input
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              placeholder={t("searchPlaceholder")}
              className="h-10"
            />

            <div className="h-10 bg-yellow-400 rounded-xl flex items-center pl-4 pr-2 justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold">{t("availablePallet")}</p>
                <p className="text-xs font-light">
                  ({meta?.total_items ?? 0} {t("palletUnit")})
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      size={"sm"}
                      className="rounded-lg bg-white hover:bg-gray-100 text-black"
                    >
                      <ArrowDownWideNarrow className="size-3.5" />
                      {sortOrder === "new"
                        ? t("sortNewest")
                        : sortOrder === "cheap"
                          ? t("sortCheapest")
                          : t("sortExpensive")}
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" sideOffset={8}>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortOrder("new");
                        setPage(1);
                      }}
                    >
                      <CalendarDays className="size-3.5 stroke-[1.5]" />
                      {t("sortNewest")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortOrder("cheap");
                        setPage(1);
                      }}
                    >
                      <TicketPercent className="size-3.5 stroke-[1.5]" />
                      {t("sortCheapest")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortOrder("expensive");
                        setPage(1);
                      }}
                    >
                      <Gem className="size-3.5 stroke-[1.5]" />
                      {t("sortExpensive")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {productQuery.isLoading ? (
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className="w-full aspect-3/4 rounded-xl bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : productQuery.isError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {t("listError")}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {(productQuery.data?.data ?? []).map((item) => {
                  const discountPercent = getDiscountPercent(
                    item.price.old_price,
                    item.price.current_price,
                  );

                  return (
                    <Link
                      key={item.slug}
                      href={item.is_sold ? "#" : `/products/${item.slug}`}
                      onClick={(e) => item.is_sold && e.preventDefault()}
                      aria-disabled={item.is_sold}
                      className={item.is_sold ? "cursor-not-allowed" : ""}
                    >
                      <div className="w-full border border-gray-300 rounded-3xl overflow-hidden bg-white">
                        <div className="aspect-square w-full relative bg-[#e9e9e9]">
                          {discountPercent > 0 && (
                            <div className="absolute top-2 left-0 z-10 bg-black text-white text-[10px] font-semibold px-2 py-1 rounded-r-sm">
                              {discountPercent}%
                            </div>
                          )}
                          {item.is_sold && (
                            <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center rounded-t-3xl">
                              <span className="text-white text-xs font-semibold">{t("sold")}</span>
                            </div>
                          )}
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="20vw"
                            className="object-cover"
                          />
                        </div>
                        <div className="w-full px-3 py-2.5 flex flex-col gap-2">
                          <p className="font-medium line-clamp-1 text-sm leading-tight text-gray-900">
                            {item.name}
                          </p>
                          <div className="flex flex-col gap-0.5">
                            <p className="font-bold text-orange-500 text-xl leading-tight whitespace-nowrap">
                              {item.price.current_price}
                            </p>
                            <p className="text-[11px] line-through text-gray-400 leading-none whitespace-nowrap">
                              {item.price.old_price}
                            </p>
                          </div>
                          <p className="text-[11px] text-gray-400 leading-none line-clamp-1">
                            {item.stock} pcs <span className="mx-1">/</span>
                            {item.warehouse}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="w-full justify-center flex items-center mt-6 gap-2">
              <Button
                size={"icon"}
                variant={"ghost"}
                disabled={!meta || meta.current_page <= 1}
                onClick={() => updatePage((meta?.current_page ?? 1) - 1)}
              >
                <ChevronLeft />
              </Button>

              {meta && (
                <>
                  <Button
                    size={"icon"}
                    variant={meta.current_page === 1 ? "default" : "ghost"}
                    onClick={() => updatePage(1)}
                  >
                    1
                  </Button>
                  {meta.last_page > 5 && (
                    <Button size={"icon"} variant={"ghost"} disabled>
                      <MoreHorizontal />
                    </Button>
                  )}
                  {Array.from(
                    { length: Math.min(3, Math.max(0, meta.last_page - 2)) },
                    (_, i) => i + 2,
                  ).map((page) => (
                    <Button
                      key={page}
                      size={"icon"}
                      variant={meta.current_page === page ? "default" : "ghost"}
                      className={cn(
                        meta.current_page === page &&
                          "bg-yellow-400 text-black",
                      )}
                      onClick={() => updatePage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  {meta.last_page > 4 && (
                    <Button
                      size={"icon"}
                      variant={
                        meta.current_page === meta.last_page
                          ? "default"
                          : "ghost"
                      }
                      onClick={() => updatePage(meta.last_page)}
                    >
                      {meta.last_page}
                    </Button>
                  )}
                </>
              )}

              <Button
                size={"icon"}
                variant={"ghost"}
                disabled={!meta || meta.current_page >= meta.last_page}
                onClick={() => updatePage((meta?.current_page ?? 1) + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
