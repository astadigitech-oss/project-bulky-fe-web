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
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CircleQuestionMark,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { useApiQuery } from "@/lib/query/use-query";
import { useMutate } from "@/lib/query/use-mutate";
import { useParams } from "next/navigation";

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
    };
  };
};

type RecommendationResponse = {
  success: boolean;
  message: string;
  data: Array<{
    name: string;
    slug: string;
    image: string;
    price: { old_price: string; current_price: string };
  }>;
};

export const ProductIdClient = () => {
  const params = useParams<{ locale: string; productId: string }>();
  const locale = clampLocale(params?.locale);
  const productId = params?.productId;

  const [added, setAdded] = React.useState(false);

  const detailQuery = useApiQuery<ProductDetailResponse>({
    key: ["product-detail", locale, productId],
    endpoint: `/web/products/${productId}`,
    searchParams: { locale },
    enabled: Boolean(productId),
  });

  const recommendationQuery = useApiQuery<RecommendationResponse>({
    key: ["product-recommendation", locale],
    endpoint: "/web/products/recommendations",
    searchParams: { local: locale },
  });

  const addToCart = useMutate<
    { message: string; status: boolean; data: null },
    { product_id: string },
    undefined,
    { locale: Locale }
  >({
    endpoint: "/product/add-to-cart",
    method: "post",
    isPublic: true,
  });

  const product = detailQuery.data?.data;

  const handleAddToCart = async () => {
    if (!product?.id) return;
    await addToCart.mutateAsync({
      body: { product_id: product.id },
      searchParams: { locale },
    });
    setAdded(true);
  };

  if (detailQuery.isLoading) {
    return (
      <div className="h-[60vh] w-full rounded-xl animate-pulse bg-gray-100" />
    );
  }

  if (detailQuery.isError || !product) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Gagal mengambil detail produk.
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
                alt={"logo"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 1280px"
              />
            </div>
            <p className="text-xl font-medium">
              Berhasil Masukkan Produk ke Keranjang
            </p>
          </div>
          <div className="relative size-52">
            <Image
              src={"/assets/images/added-to-cart.webp"}
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
                  Lanjut Belanja
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
                Buka Keranjang
                <ArrowRight />
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full grid grid-cols-5 gap-8 bg-gray-100 rounded-xl p-8">
        <div className="col-span-3 w-ful">
          <div className="w-full h-[70svh] flex items-center justify-center flex-col gap-2">
            <div className="h-full aspect-square relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={product.images[0] || "https://github.com/shadcn.png"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="20vw"
              />
            </div>
            <div className="grid grid-cols-10 w-full gap-2">
              {product.images.slice(0, 10).map((image, i) => (
                <div
                  key={i}
                  className="w-full aspect-square relative rounded-lg overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`${product.name}-${i}`}
                    fill
                    className="object-cover"
                    sizes="20vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-2 w-full">
          <div className="w-full flex flex-col gap-10 sticky top-24 bg-white rounded-lg p-4 shadow-lg">
            <div className="flex flex-col w-full gap-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="text-xs">
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="text-xs">
                    <BreadcrumbLink href="/products">Products</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="text-xs">
                    <BreadcrumbPage className="w-42 line-clamp-1">
                      {product.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <h1 className="text-xl font-semibold line-clamp-2">
                {product.name}
              </h1>
              <Separator className={"bg-gray-300"} />
              <div className="flex items-center flex-col w-full gap-2">
                <div className="flex items-center w-full text-sm">
                  <p className="w-28">ID Palet</p>
                  <p>: {product.detail.id_cargo}</p>
                </div>
                <div className="flex items-center w-full text-sm">
                  <p className="w-28">Kategori</p>
                  <p>: {product.detail.category}</p>
                </div>
                <div className="flex items-center w-full text-sm">
                  <p className="w-28">Merek</p>
                  <p>: {product.detail.brand.join(", ")}</p>
                </div>
                <div className="flex items-center w-full text-sm">
                  <p className="w-28">Kondisi Paket</p>
                  <p>: {product.detail.package_condition}</p>
                </div>
                <div className="flex items-center w-full text-sm">
                  <p className="w-28">Kondisi Produk</p>
                  <p>: {product.detail.product_condition}</p>
                </div>
                <div className="flex items-center w-full text-sm">
                  <p className="w-28">Sumber</p>
                  <p>: {product.detail.source}</p>
                </div>
                <div className="flex items-center w-full text-sm">
                  <p className="w-28">Discrepancy</p>
                  <p>: {product.detail.discrepancy}%</p>
                  <CircleQuestionMark className="size-3.5 ml-2" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <p className="line-through text-sm font-light text-gray-400">
                  {product.price.old_price}
                </p>
                <p className="font-bold text-2xl text-yellow-600">
                  {product.price.current_price}
                </p>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className={"bg-yellow-400 hover:bg-yellow-500 text-black h-10"}
              >
                <ShoppingCart />
                {addToCart.isPending ? "Menambahkan..." : "Masukan Keranjang"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-8 flex items-center px-3 bg-yellow-400 font-semibold text-sm rounded-md">
          <p>Rekomendasi</p>
        </div>
        <Separator className={"flex-auto"} />
        <Link href={"/products"}>
          <Button variant={"link"} className={"text-xs"}>
            Lihat Semua Produk
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {(recommendationQuery.data?.data ?? []).slice(0, 6).map((item) => (
          <Link key={item.slug} href={`/products/${item.slug}`}>
            <div className="w-full border flex flex-col rounded-xl overflow-hidden border-gray-300 h-fit">
              <div className="aspect-square flex-none bg-gray-200 w-full relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </div>
              <div className="flex-none bg-white w-full px-2.5 py-1.5 flex flex-col gap-4">
                <p className="font-medium line-clamp-2 text-sm">{item.name}</p>
                <div className="flex flex-col">
                  <p className="text-[11px] line-through font-light leading-tight text-gray-600">
                    {item.price.old_price}
                  </p>
                  <p className="font-semibold text-yellow-600 leading-tight">
                    {item.price.current_price}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
