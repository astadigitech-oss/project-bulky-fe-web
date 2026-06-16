"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Link, useRouter } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CircleQuestionMark,
  Eye,
  ShoppingCart,
  X,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { useApiQuery } from "@/lib/query/use-query";
import { useMutate } from "@/lib/query/use-mutate";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { cookiesKey } from "@/config";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type Locale = "id" | "en";

const clampLocale = (value?: string): Locale => (value === "en" ? "en" : "id");

type ProductDetailResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    price: {
      old_price: string;
      current_price: string;
    };
    detail: {
      id_cargo: string;
      category: string;
      brand: string[];
      package_condition: string;
      product_condition: string;
      source: string;
      discrepancy: string;
      warehouse: string;
      stock: number;
      panjang: number;
      lebar: number;
      tinggi: number;
      berat: number;
      volume: number;
      berat_volumetrik: number;
    };
    document?: string;
  };
};

type RecommendationResponse = {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    slug: string;
    slug_trans: { id: string; en: string };
    nama: string;
    nama_trans: { id: string; en: string };
    harga_sebelum_diskon: number;
    harga_sesudah_diskon: number;
    harga_formatted: string;
    persentase_diskon: number;
    gambar_utama: string;
    is_sold: boolean;
    source: string;
  }>;
};

export const ProductIdClient = () => {
  const t = useTranslations("ProductDetail");
  const router = useRouter();
  const params = useParams<{ locale: string; productId: string }>();
  const locale = clampLocale(params?.locale);
  const productId = params?.productId;

  const [added, setAdded] = React.useState(false);
  const [pdfOpen, setPdfOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const queryClient = useQueryClient();

  const detailQuery = useApiQuery<ProductDetailResponse>({
    key: ["product-detail", locale, productId],
    endpoint: `/web/products/${productId}`,
    searchParams: { locale },
    enabled: Boolean(productId),
  });

  const recommendationQuery = useApiQuery<RecommendationResponse>({
    key: ["product-recommendation", locale, productId],
    endpoint: `/web/products/${productId}/recommendations`,
    searchParams: { locale, limit: 6 },
    enabled: Boolean(productId),
  });

  const addToCart = useMutate<
    { message: string; status: boolean; data: null },
    { product_id: string }
  >({
    endpoint: "/product/add-to-cart",
    method: "post",
  });

  const product = detailQuery.data?.data;
  const activeImageIndex =
    selectedImage < (product?.images?.length ?? 0) ? selectedImage : 0;

  const handleRequireLogin = (action: "cart" | "buy-now") => {
    const token = getCookie(cookiesKey);
    if (token) return true;

    toast.warning(t("loginRequiredToast"));

    const next = encodeURIComponent(`/products/${productId ?? ""}`);
    router.push(`/login?reason=auth-required&action=${action}&next=${next}`);
    return false;
  };

  const handleAddToCart = () => {
    if (!product?.id) return;
    if (!handleRequireLogin("cart")) return;

    addToCart.mutate(
      { body: { product_id: product.id } },
      {
        onSuccess: () => {
          setAdded(true);
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: () => toast.error(t("addToCartError")),
      },
    );
  };

  const handleBuyNow = () => {
    if (!product?.id) return;
    if (!handleRequireLogin("buy-now")) return;

    addToCart.mutate(
      { body: { product_id: product.id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          router.push("/checkout");
        },
        onError: () => toast.error(t("addToCartError")),
      },
    );
  };

  const handlePrevImage = () => {
    const total = product?.images?.length ?? 0;
    if (total <= 0) return;
    setSelectedImage((prev) => (prev - 1 + total) % total);
  };

  const handleNextImage = () => {
    const total = product?.images?.length ?? 0;
    if (total <= 0) return;
    setSelectedImage((prev) => (prev + 1) % total);
  };

  if (detailQuery.isLoading) {
    return (
      <div className="h-[60vh] w-full rounded-xl animate-pulse bg-gray-100" />
    );
  }

  if (detailQuery.isError || !product) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {t("detailError")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <Dialog open={added} onOpenChange={setAdded}>
        <DialogContent
          className={
            "min-w-xl items-center justify-center flex flex-col p-8! gap-6"
          }
          showCloseButton={false}
        >
          <div className="flex flex-col gap-3">
            <div className="relative h-7 aspect-19/4">
              <Image
                src={"/assets/images/logo-bulky.webp"}
                alt={t("logoAlt")}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 1280px"
              />
            </div>
            <p className="text-xl font-medium">{t("addedToCartSuccess")}</p>
          </div>
          <div className="relative size-52">
            <Image
              src="/assets/images/profile/empty-illustration.svg"
              alt={"added"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 1280px"
            />
          </div>
          <div className="flex items-center gap-4 w-full flex-auto">
            <DialogClose
              render={
                <Button
                  className={
                    "w-full flex-auto h-12 rounded-full bg-gray-200 text-black hover:bg-gray-300"
                  }
                  size={"lg"}
                >
                  <ArrowLeft />
                  {t("continueShopping")}
                </Button>
              }
            />
            <Link href={"/cart"} className="w-full">
              <Button
                className={
                  "w-full flex-auto h-12 rounded-full bg-yellow-400 text-black hover:bg-yellow-500"
                }
                size={"lg"}
              >
                {t("openCart")}
                <ArrowRight />
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogContent
          className="w-[90vw]! sm:w-[92vw]! max-w-6xl! h-[90vh]! p-3"
          showCloseButton={false}
        >
          <button
            type="button"
            onClick={() => setPdfOpen(false)}
            aria-label={t("viewDocument") + " close"}
            className="absolute -top-3 -right-3 z-30 size-9 rounded-full bg-black text-white shadow-lg border-2 border-white hover:bg-gray-800 flex items-center justify-center"
          >
            <X className="size-4.5" />
          </button>

          <div className="w-full h-full rounded-md overflow-hidden border border-gray-200 bg-white">
            {product.document ? (
              <div className="w-full h-full flex flex-col">
                {/*<div className="flex items-center justify-end gap-2 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
                  <a
                    href={product.document}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-gray-600 hover:text-black underline underline-offset-2"
                  >
                    {t("openPdfInNewTab")}
                  </a>
                </div>*/}
                <iframe
                  src={`${product.document}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                  title={t("pdfViewerTitle")}
                  className="w-full flex-1"
                />
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">
                {t("documentUnavailable")}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full grid grid-cols-12 gap-6">
        <div className="col-span-5">
          <div className="flex flex-col gap-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="text-xs">
                  <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="text-xs">
                  <BreadcrumbLink href="/products">
                    {t("products")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="text-xs">
                  <BreadcrumbPage className="w-42 line-clamp-1">
                    {product.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="aspect-square w-full relative rounded-2xl overflow-hidden border border-gray-200 bg-[#f4f4f4]">
              <Image
                src={
                  product.images[activeImageIndex] ||
                  product.images[0] ||
                  "https://github.com/shadcn.png"
                }
                alt={product.name}
                fill
                className="object-cover"
                sizes="40vw"
              />
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-white/90 hover:bg-white shadow-sm border border-gray-200 flex items-center justify-center"
                aria-label={t("prevImage")}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-white/90 hover:bg-white shadow-sm border border-gray-200 flex items-center justify-center"
                aria-label={t("nextImage")}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.images.slice(0, 10).map((image, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className="cursor-pointer"
                >
                  <div
                    className={`w-full aspect-square relative rounded-xl overflow-hidden border ${activeImageIndex === i ? "border-yellow-500" : "border-gray-200"}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name}-${i}`}
                      fill
                      className="object-cover"
                      sizes="12vw"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-3 pt-8">
          <p className="text-cyan-700 text-sm font-semibold">
            {t("detailTitle")}
          </p>
          <h1 className="text-4xl font-bold leading-tight line-clamp-2">
            {product.name}
          </h1>
          <div className="flex flex-col">
            <p className="font-bold text-4xl text-orange-500">
              {product.price.current_price}
            </p>
            <p className="line-through text-sm text-gray-400">
              {product.price.old_price}
            </p>
          </div>

          <Separator className={"bg-gray-300"} />

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <p className="text-[11px] text-gray-500">{t("palletId")}</p>
              <p className="text-sm font-medium">{product.detail.id_cargo}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <p className="text-[11px] text-gray-500">{t("stock")}</p>
              <p className="text-sm font-medium">
                {product.detail.stock} {t("pcs")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-2.5 text-sm">
            <p className="text-gray-700">{t("category")}</p>
            <p className="leading-snug">{product.detail.category}</p>
            <p className="text-gray-700">{t("brand")}</p>
            <p className="leading-snug">{product.detail.brand.join(", ")}</p>
            <p className="text-gray-700">{t("packageCondition")}</p>
            <p className="leading-snug">{product.detail.package_condition}</p>
            <p className="text-gray-700">{t("productCondition")}</p>
            <p className="leading-snug">{product.detail.product_condition}</p>
            <p className="text-gray-700">{t("source")}</p>
            <p className="leading-snug">{product.detail.source}</p>
            <p className="text-gray-700">{t("warehouse")}</p>
            <p className="leading-snug">{product.detail.warehouse}</p>
            <p className="text-gray-700">{t("discrepancy")}</p>
            <div className="inline-flex items-center gap-1.5 leading-snug">
              <span>{product.detail.discrepancy}%</span>
              <div className="relative inline-flex items-center group">
                <button
                  type="button"
                  aria-label={t("discrepancyInfoAria")}
                  className="inline-flex items-center"
                >
                  <CircleQuestionMark className="size-3.5" />
                </button>
                <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 rounded-md border border-gray-300 bg-white px-3 py-2 text-center text-sm text-black shadow-md opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                  {t("discrepancyTooltip")}
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg border border-gray-200 px-3 py-2">
              <p className="text-[11px] text-gray-500">{t("dimension")}</p>
              <p className="font-medium">
                {product.detail.panjang} × {product.detail.lebar} ×{" "}
                {product.detail.tinggi} {t("cm")}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 px-3 py-2">
              <p className="text-[11px] text-gray-500">{t("weight")}</p>
              <p className="font-medium">
                {product.detail.berat} {t("kg")}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 px-3 py-2">
              <p className="text-[11px] text-gray-500">{t("volume")}</p>
              <p className="font-medium">
                {product.detail.volume.toLocaleString(
                  locale === "en" ? "en-US" : "id-ID",
                )}{" "}
                {t("cm3")}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 px-3 py-2">
              <p className="text-[11px] text-gray-500">
                {t("volumetricWeight")}
              </p>
              <p className="font-medium">
                {product.detail.berat_volumetrik} {t("kg")}
              </p>
            </div>
          </div>

          {product.document && (
            <div className="mt-1 rounded-lg border border-gray-200 px-3 py-2.5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {t("detailPalletDocument")}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t("detailPalletDocumentHint")}
                </p>
              </div>
              <Button
                variant="outline"
                className="h-9"
                onClick={() => setPdfOpen(true)}
                aria-label={t("viewDocument")}
              >
                <Eye className="size-4" />
                {t("viewDocument")}
              </Button>
            </div>
          )}
        </div>

        <div className="col-span-3">
          <div className="sticky top-24 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm flex flex-col gap-3.5">
            <div className="flex items-center gap-3">
              <div className="relative size-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                <Image
                  src={product.images[0] || "https://github.com/shadcn.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="8vw"
                />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm leading-snug line-clamp-2">
                  {product.name}
                </p>
                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                  {product.detail.stock} {t("pcs")} / {product.detail.warehouse}
                </p>
              </div>
            </div>

            <Separator className="bg-gray-200 my-0.5" />

            <div className="flex items-start justify-between gap-3 pt-0.5 pb-1">
              <p className="text-sm text-gray-500 leading-7">{t("total")}</p>
              <div className="flex flex-col items-end">
                <p className="font-bold text-[1.55rem] leading-none text-orange-500 whitespace-nowrap">
                  {product.price.current_price}
                </p>
                <p className="line-through text-[0.72rem] text-gray-400 mt-1 whitespace-nowrap leading-none">
                  {product.price.old_price}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[48px_1fr] gap-2 pt-1">
              <Button
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className={"h-11 w-12 bg-black hover:bg-black/90 text-white"}
              >
                <ShoppingCart className="size-5" />
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={addToCart.isPending}
                className={"bg-yellow-400 hover:bg-yellow-500 text-black h-11"}
              >
                {addToCart.isPending ? t("adding") : t("buyNow")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-8 flex items-center px-3 bg-yellow-400 font-semibold text-sm rounded-md">
          <p>{t("recommendation")}</p>
        </div>
        <Separator className={"flex-auto"} />
        <Link href={"/products"}>
          <Button variant={"link"} className={"text-xs"}>
            {t("viewAllProducts")}
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {(recommendationQuery.data?.data ?? []).map((item) => {
          const slug = locale === "en" ? item.slug_trans.en : item.slug_trans.id;
          const name = locale === "en" ? item.nama_trans.en : item.nama_trans.id;
          const discountPercent = Math.round(item.persentase_diskon);

          return (
            <Link key={item.id} href={`/products/${slug}`}>
              <div className="w-full border border-gray-300 rounded-3xl overflow-hidden bg-white">
                <div className="aspect-square w-full relative bg-[#e9e9e9]">
                  {discountPercent > 0 && (
                    <div className="absolute top-2 left-0 z-10 bg-black text-white text-[10px] font-semibold px-2 py-1 rounded-r-sm">
                      {discountPercent}%
                    </div>
                  )}
                  {item.is_sold && (
                    <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">Terjual</span>
                    </div>
                  )}
                  <Image
                    src={item.gambar_utama}
                    alt={name}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
                <div className="w-full px-3 py-2.5 flex flex-col gap-2">
                  <p className="font-medium line-clamp-1 text-sm leading-tight text-gray-900">
                    {name}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-bold text-orange-500 text-xl leading-tight whitespace-nowrap">
                      {item.harga_formatted}
                    </p>
                    {item.harga_sebelum_diskon > item.harga_sesudah_diskon && (
                      <p className="text-[11px] line-through text-gray-400 leading-none whitespace-nowrap">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.harga_sebelum_diskon)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
