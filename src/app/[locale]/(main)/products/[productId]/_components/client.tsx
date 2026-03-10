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
import { formatRupiah } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CircleQuestionMark,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import React from "react";

export const ProductIdClient = () => {
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = () => {
    setAdded(true);
  };
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
                alt={"lala"}
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
              alt={"lala"}
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
      <div className="w-full grid grid-cols-5 gap-8  bg-gray-100 rounded-xl p-8">
        <div className="col-span-3 w-ful">
          <div className="w-full h-[70svh] flex items-center justify-center flex-col gap-2">
            <div className="h-full aspect-square relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://github.com/shadcn.png"
                alt="vc"
                fill
                className="object-cover"
                sizes="20vw"
              />
            </div>
            <div className="grid grid-cols-10 w-full gap-2">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className="w-full aspect-square relative rounded-lg overflow-hidden"
                >
                  <Image
                    src="https://github.com/vercel.png"
                    alt="vc"
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
                      Kosmetik Palet 79 lorem ipsum dolor sit amet, consectetur
                      adipiscing elit.
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-xl font-semibold line-clamp-2">
                Kosmetik Palet 79
              </h1>
              <Separator className={"bg-gray-300"} />
              <div className="flex items-center flex-col w-full gap-2">
                <div className="flex items-center w-full text-sm">
                  <p className="w-28">ID Palet</p>
                  <p>: LAX123456789</p>
                </div>
                <div className="flex items-center w-full text-sm">
                  <p className="w-28">Kategori</p>
                  <p>: Kosmetik</p>
                </div>
                <div className="flex items-center w-full text-sm">
                  <p className="w-28">Merek</p>
                  <p>: Philips</p>
                </div>
                <div className="flex items-center w-full text-sm">
                  <p className="w-28">Kondisi Paket</p>
                  <p>: Rusak Sedang</p>
                </div>
                <div className="flex items-center w-full text-sm">
                  <p className="w-28">Kondisi Produk</p>
                  <p>: Bekas Grade B</p>
                </div>
                <div className="flex items-center w-full text-sm">
                  <p className="w-28">Sumber</p>
                  <p>: Overstock</p>
                </div>
                <div className="flex items-center w-full text-sm">
                  <p className="w-28">Discrepancy</p>
                  <p>: 2%</p>
                  <CircleQuestionMark className="size-3.5 ml-2" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <p className="line-through text-sm font-light text-gray-400">
                  {formatRupiah(8000000)}
                </p>
                <p className="font-bold text-2xl text-yellow-600">
                  {formatRupiah(5000000)}
                </p>
              </div>
              <Button
                onClick={handleAddToCart}
                className={"bg-yellow-400 hover:bg-yellow-500 text-black h-10"}
              >
                <ShoppingCart />
                Masukan Keranjang
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
        {Array.from({ length: 6 }, (_, index) => (
          <Link key={index} href={`/products/${index + 1}`}>
            <div className="w-full border flex flex-col rounded-xl overflow-hidden border-gray-300 h-fit">
              <div className="aspect-square flex-none bg-gray-200 w-full relative overflow-hidden">
                <Image
                  src={"https://github.com/shadcn.png"}
                  alt="sa"
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </div>
              <div className="flex-none bg-white w-full px-2.5 py-1.5 flex flex-col gap-4">
                <p className="font-medium line-clamp-2 text-sm">
                  Palet Sepatu Olahraga lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Quisquam, voluptatum.
                </p>
                <div className="flex flex-col">
                  <p className="text-[11px] line-through font-light leading-tight text-gray-600">
                    {formatRupiah(5000000)}
                  </p>
                  <p className="font-semibold text-yellow-600 leading-tight">
                    {formatRupiah(5000000)}
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
