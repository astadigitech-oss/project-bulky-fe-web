"use client";

import React, { useState } from "react";
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

const brands = [
  {
    id: "acf2476c-29b4-4d49-818a-d1c2254f9ec0",
    nama_en: "Acer",
    nama_id: "Acer",
  },
  {
    id: "001764d0-5ed4-4b04-87b6-2074c1482d61",
    nama_en: "Apple",
    nama_id: "Apple",
  },
  {
    id: "6d1094b8-eedb-4eee-ab61-4a6595d022e6",
    nama_en: "Asus",
    nama_id: "Asus",
  },
  {
    id: "aee94486-39e2-428b-b9ba-b10a12e7ba61",
    nama_en: "Shirt",
    nama_id: "Baju",
  },
  {
    id: "2ed37325-061f-4475-9fe7-e2af3627442f",
    nama_en: "Brother",
    nama_id: "Brother",
  },
  {
    id: "1b07861d-73d3-44fc-937c-e6e51eb5679b",
    nama_en: "Canon",
    nama_id: "Canon",
  },
  {
    id: "24de480e-c092-4dde-aa59-d2224575691a",
    nama_en: "Dell",
    nama_id: "Dell",
  },
  {
    id: "c95b97a0-db64-4a72-9a8f-061423f1401e",
    nama_en: "Epson",
    nama_id: "Epson",
  },
  {
    id: "2164414c-bb7e-49e4-8186-5658424ca264",
    nama_en: "HP",
    nama_id: "HP",
  },
  {
    id: "8ca7d9f9-2310-4303-9025-8ee255a20f71",
    nama_en: "Hyundai",
    nama_id: "Hyundai",
  },
  {
    id: "4fcbe13b-bca0-488e-8fef-eb854a6a2f99",
    nama_en: "Mystery Box 2",
    nama_id: "Kotak Misteri 2",
  },
  {
    id: "8e0c7886-ed65-40da-b573-f05ab73a0f81",
    nama_en: "Others",
    nama_id: "Lainnya",
  },
  {
    id: "e3ac6ed3-5313-46d3-aa02-37354296ee6c",
    nama_en: "Lenovo",
    nama_id: "Lenovo",
  },
  {
    id: "3fa1b857-f908-44d1-83b4-149ca014c651",
    nama_en: "LG",
    nama_id: "LG",
  },
  {
    id: "78fc81e2-b523-4620-bde6-c27474e28d2d",
    nama_en: "Shirt",
    nama_id: "Pakaian",
  },
  {
    id: "348e96b0-274e-4bd5-9475-9bbd6910b036",
    nama_en: "Panasonic",
    nama_id: "Panasonic",
  },
  {
    id: "579b0ae6-0edd-49dc-8414-33a7b6e29897",
    nama_en: "Philips",
    nama_id: "Philips",
  },
  {
    id: "2111b13f-dacc-4740-b4b6-30e07ba7d099",
    nama_en: "Samsung",
    nama_id: "Samsung",
  },
  {
    id: "2fb93a2f-969a-4ae5-92f4-48b6c075eb2a",
    nama_en: "Sony",
    nama_id: "Sony",
  },
  {
    id: "9a506c6e-6d7c-4f61-903f-78d962efecee",
    nama_en: "Bag",
    nama_id: "Tas",
  },
  {
    id: "a3b37703-8427-49ef-8d97-b86110272d10",
    nama_en: "Xiaomi",
    nama_id: "Xiaomi",
  },
];

const categories = [
  {
    id: "ef3568ec-5782-411c-b30c-8b912ea077c5",
    nama: {
      id: "Elektronik",
      en: "Electronics",
    },
  },
  {
    id: "df74f002-31f5-4567-bc58-d156d6c3b994",
    nama: {
      id: "Ibu \u0026 Anak",
      en: "Mother \u0026 Baby",
    },
  },
  {
    id: "288b8def-ab77-4c94-ad02-a5c40870b21d",
    nama: {
      id: "Kosmetik",
      en: "Cosmetics",
    },
  },
  {
    id: "da797a7c-7bbc-4eca-9fa1-46a1efda4dad",
    nama: {
      id: "Otomotif",
      en: "Automotive",
    },
  },
  {
    id: "61438ff6-5265-4170-91e0-2c09a199f9e4",
    nama: {
      id: "Alat Rumah Tangga",
      en: "Household Appliances",
    },
  },
  {
    id: "28836541-ae31-41d5-b574-4a9803b77f83",
    nama: {
      id: "FMCG",
      en: "FMCG",
    },
  },
  {
    id: "22cf4008-99ba-4403-b56c-823e8840f6fa",
    nama: {
      id: "Tools",
      en: "Tools",
    },
  },
  {
    id: "5fe1a602-9b8b-4475-b802-29df76892f07",
    nama: {
      id: "Redknot",
      en: "Redknot",
    },
  },
  {
    id: "19b08607-e001-49f8-8e33-83bb35f852bf",
    nama: {
      id: "Sepatu",
      en: "Shoes",
    },
  },
  {
    id: "c741604b-bcee-4906-b101-138072da4db4",
    nama: {
      id: "Aksesoris",
      en: "Accessories",
    },
  },
  {
    id: "4297b1b7-071f-4340-a4b5-a5c80269903c",
    nama: {
      id: "Tas",
      en: "Bags",
    },
  },
  {
    id: "be40e4d7-b157-4310-982c-3427304400f9",
    nama: {
      id: "Fashion",
      en: "Fashion",
    },
  },
  {
    id: "42f80b15-133c-4a07-8707-597ae44f1589",
    nama: {
      id: "Fashion \u0026 Tas",
      en: "Fashion \u0026 Bags",
    },
  },
  {
    id: "104f5f76-33f4-4d1d-aea8-b3d2f811966f",
    nama: {
      id: "Fashion \u0026 Aksesoris",
      en: "Fashion \u0026 Accessories",
    },
  },
  {
    id: "be0b9069-1f43-4bcc-bf8a-a61de4eb1ff2",
    nama: {
      id: "Kulkas",
      en: "Refrigerator",
    },
  },
  {
    id: "22364d27-a5be-434e-9ec3-d3222e8a5f04",
    nama: {
      id: "Mesin Cuci",
      en: "Washing Machine",
    },
  },
  {
    id: "91c8111c-9709-49bb-a142-5d327b39b616",
    nama: {
      id: "TV",
      en: "TV",
    },
  },
  {
    id: "fadec949-cf73-40a9-8ab9-33f1d99487d0",
    nama: {
      id: "Lainnya",
      en: "Others",
    },
  },
  {
    id: "1d1f7804-2e59-44e1-b0a2-d9a406507ea7",
    nama: {
      id: "Unggulan",
      en: "Featured",
    },
  },
  {
    id: "197d2002-689e-46b7-a564-5cbc10f96b5a",
    nama: {
      id: "Toys",
      en: "Toys",
    },
  },
  {
    id: "8d2998fa-ecea-46b4-b47c-6431ee1881e1",
    nama: {
      id: "Buku",
      en: "Books",
    },
  },
];

const kondisiPaket = [
  {
    id: "f18c5907-864a-472a-baca-d4c531369c0f",
    nama_en: "Slightly Damaged",
    nama_id: "Rusak Ringan",
  },
  {
    id: "1f3afd7f-99f8-4e26-a366-43e25d319f87",
    nama_en: "Good",
    nama_id: "Baik",
  },
  {
    id: "1463e328-e9d3-4d21-9809-e2cba17d6cfe",
    nama_en: "Moderately Damaged",
    nama_id: "Rusak Sedang",
  },
  {
    id: "b9f3b03a-bb34-4fca-84be-67d6acd17369",
    nama_en: "Heavily Damaged",
    nama_id: "Rusak Berat",
  },
];

const kondisiProduk = [
  {
    id: "fe394659-ce00-4c18-a90f-2a0a93c7dce4",
    nama_en: "Like New",
    nama_id: "Bekas Seperti Baru",
  },
  {
    id: "af1df525-00e6-4813-822d-2dae9759724e",
    nama_en: "Good Condition",
    nama_id: "Bekas Baik",
  },
  {
    id: "5aac65a7-39a1-48ef-bc66-cf74c13caa1f",
    nama_en: "Fair Condition",
    nama_id: "Bekas Cukup Baik",
  },
  {
    id: "5c87438a-1e64-4a95-9e0c-bcca90ff14f5",
    nama_en: "Second Grade B",
    nama_id: "Bekas Grade B",
  },
  {
    id: "44919624-ab6c-42ca-806f-3451eebb259e",
    nama_en: "Damaged",
    nama_id: "Rusak",
  },
];

const sumber = [
  {
    id: "3fc862b3-76e7-4740-a13f-236fe3b9f3ee",
    nama: {
      id: "Overstock",
      en: "Overstock",
    },
  },
  {
    id: "3ff7b524-9120-40bc-b6a0-9a5ca3f1ad94",
    nama: {
      id: "Closeout",
      en: "Closeout",
    },
  },
  {
    id: "507be3fc-552f-4bb2-831a-67504f576fae",
    nama: {
      id: "Liquidasi",
      en: "Liquidation",
    },
  },
  {
    id: "1bd762f8-d0f1-4d52-a59c-7ca0e7da7cdf",
    nama: {
      id: "Excess",
      en: "Excess",
    },
  },
  {
    id: "125c85f4-1188-4d5e-a503-eff20017a92b",
    nama: {
      id: "Reject",
      en: "Reject",
    },
  },
];

export const ProductClient = () => {
  const [showMore, setShowMore] = useState({
    category: false,
    brand: false,
    warehouse: false,
    price: false,
    packageCondition: false,
    productCondition: false,
    source: false,
  });
  const [accordion, setAccordion] = useState({
    category: true,
    brand: true,
    warehouse: true,
    price: true,
    packageCondition: true,
    productCondition: true,
    source: true,
  });
  const [priceRange, setPriceRange] = useState([1000000, 20000000]);

  return (
    <div className="flex flex-col w-full">
      <BannerSection />
      <div className="grid grid-cols-4 w-full px-17.5 mx-auto xl:max-w-7xl max-w-5xl gap-6">
        <div className="col-span-1">
          <div className="sticky top-16 pt-5">
            <div className="h-10 w-full bg-white flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="font-medium">Filter</h2>
                <p className="text-xs text-gray-500">3 Filter diterapkan</p>
              </div>
              <Button
                size={"icon-sm"}
                className={"bg-yellow-400 hover:bg-yellow-500 text-black"}
              >
                <FilterX className="size-3.5" />
              </Button>
            </div>
            <div className="overflow-y-scroll max-h-[calc(100svh-64px-32px-40px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden]">
              <div className="h-5 bg-linear-to-b from-white via-white/80 to-white/50 absolute top-15 left-0 w-full z-10 " />
              <div className="h-5 w-full" />
              <Accordion multiple defaultValue={["category"]}>
                <AccordionItem value={"category"}>
                  <AccordionTrigger
                    onClick={() => {
                      if (accordion.category && showMore.category) {
                        setShowMore((prev) => ({
                          ...prev,
                          category: !prev.category,
                        }));
                      }
                      setAccordion((prev) => ({
                        ...prev,
                        category: !prev.category,
                      }));
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="size-3.5!" />
                      <span>Kategori</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {categories.slice(0, 3).map((category) => (
                      <Label
                        key={category.id}
                        className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                      >
                        <Checkbox />
                        <span>{category.nama.id}</span>
                      </Label>
                    ))}
                    {categories.length > 4 && (
                      <Collapsible>
                        <CollapsibleContent>
                          {categories.slice(3).map((category) => (
                            <Label
                              key={category.id}
                              className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                            >
                              <Checkbox />
                              <span>{category.nama.id}</span>
                            </Label>
                          ))}
                        </CollapsibleContent>
                        <CollapsibleTrigger
                          className={
                            "text-xs text-center w-full flex items-center gap-2 pl-3 h-7 hover:underline hover:underline-offset-2 font-semibold text-yellow-600"
                          }
                          onClick={() =>
                            setShowMore((prev) => ({
                              ...prev,
                              category: !prev.category,
                            }))
                          }
                        >
                          <span className="whitespace-nowrap">
                            {showMore.category ? "Less More" : "Show More"}
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
                  <AccordionTrigger
                    onClick={() => {
                      if (accordion.brand && showMore.brand) {
                        setShowMore((prev) => ({
                          ...prev,
                          brand: !prev.brand,
                        }));
                      }
                      setAccordion((prev) => ({
                        ...prev,
                        brand: !prev.brand,
                      }));
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Hexagon className="size-3.5!" />
                      <span>Brand</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {brands.slice(0, 3).map((brand) => (
                      <Label
                        key={brand.id}
                        className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                      >
                        <Checkbox />
                        <span>{brand.nama_id}</span>
                      </Label>
                    ))}
                    {brands.length > 3 && (
                      <Collapsible>
                        <CollapsibleContent>
                          {brands.slice(3).map((brand) => (
                            <Label
                              key={brand.id}
                              className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                            >
                              <Checkbox />
                              <span>{brand.nama_id}</span>
                            </Label>
                          ))}
                        </CollapsibleContent>
                        <CollapsibleTrigger
                          className={
                            "text-xs text-center w-full flex items-center gap-2 pl-3 h-7 hover:underline hover:underline-offset-2 font-semibold text-yellow-600"
                          }
                          onClick={() =>
                            setShowMore((prev) => ({
                              ...prev,
                              brand: !prev.brand,
                            }))
                          }
                        >
                          <span className="whitespace-nowrap">
                            {showMore.brand ? "Less More" : "Show More"}
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
                      <span>Harga</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-6 my-2 pt-6 border p-2 rounded-xl border-yellow-500">
                      <Slider
                        value={priceRange}
                        onValueChange={(v) => setPriceRange(v as number[])}
                        min={1000000}
                        max={20000000}
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
                        <Button
                          className={
                            "text-xs bg-yellow-400 text-black hover:bg-yellow-500"
                          }
                        >
                          Terapkan Filter Harga
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value={"package-condition"}>
                  <AccordionTrigger
                    onClick={() => {
                      if (
                        accordion.packageCondition &&
                        showMore.packageCondition
                      ) {
                        setShowMore((prev) => ({
                          ...prev,
                          packageCondition: !prev.packageCondition,
                        }));
                      }
                      setAccordion((prev) => ({
                        ...prev,
                        packageCondition: !prev.packageCondition,
                      }));
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Package className="size-3.5!" />
                      <span>Kondisi Paket</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {kondisiPaket.slice(0, 3).map((packageCondition) => (
                      <Label
                        key={packageCondition.id}
                        className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                      >
                        <Checkbox />
                        <span>{packageCondition.nama_id}</span>
                      </Label>
                    ))}
                    {kondisiPaket.length > 3 && (
                      <Collapsible>
                        <CollapsibleContent>
                          {kondisiPaket.slice(3).map((packageCondition) => (
                            <Label
                              key={packageCondition.id}
                              className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                            >
                              <Checkbox />
                              <span>{packageCondition.nama_id}</span>
                            </Label>
                          ))}
                        </CollapsibleContent>
                        <CollapsibleTrigger
                          className={
                            "text-xs text-center w-full flex items-center gap-2 pl-3 h-7 hover:underline hover:underline-offset-2 font-semibold text-yellow-600"
                          }
                          onClick={() =>
                            setShowMore((prev) => ({
                              ...prev,
                              packageCondition: !prev.packageCondition,
                            }))
                          }
                        >
                          <span className="whitespace-nowrap">
                            {showMore.packageCondition
                              ? "Less More"
                              : "Show More"}
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
                  <AccordionTrigger
                    onClick={() => {
                      if (
                        accordion.productCondition &&
                        showMore.productCondition
                      ) {
                        setShowMore((prev) => ({
                          ...prev,
                          productCondition: !prev.productCondition,
                        }));
                      }
                      setAccordion((prev) => ({
                        ...prev,
                        productCondition: !prev.productCondition,
                      }));
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <SwatchBook className="size-3.5!" />
                      <span>Kondisi Produk</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {kondisiProduk.slice(0, 3).map((productCondition) => (
                      <Label
                        key={productCondition.id}
                        className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                      >
                        <Checkbox />
                        <span>{productCondition.nama_id}</span>
                      </Label>
                    ))}
                    {kondisiProduk.length > 3 && (
                      <Collapsible>
                        <CollapsibleContent>
                          {kondisiProduk.slice(3).map((productCondition) => (
                            <Label
                              key={productCondition.id}
                              className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                            >
                              <Checkbox />
                              <span>{productCondition.nama_id}</span>
                            </Label>
                          ))}
                        </CollapsibleContent>
                        <CollapsibleTrigger
                          className={
                            "text-xs text-center w-full flex items-center gap-2 pl-3 h-7 hover:underline hover:underline-offset-2 font-semibold text-yellow-600"
                          }
                          onClick={() =>
                            setShowMore((prev) => ({
                              ...prev,
                              productCondition: !prev.productCondition,
                            }))
                          }
                        >
                          <span className="whitespace-nowrap">
                            {showMore.productCondition
                              ? "Less More"
                              : "Show More"}
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
                  <AccordionTrigger
                    onClick={() => {
                      if (accordion.source && showMore.source) {
                        setShowMore((prev) => ({
                          ...prev,
                          source: !prev.source,
                        }));
                      }
                      setAccordion((prev) => ({
                        ...prev,
                        source: !prev.source,
                      }));
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Blend className="size-3.5!" />
                      <span>Sumber</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {sumber.slice(0, 3).map((source) => (
                      <Label
                        key={source.id}
                        className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                      >
                        <Checkbox />
                        <span>{source.nama.id}</span>
                      </Label>
                    ))}
                    {sumber.length > 3 && (
                      <Collapsible>
                        <CollapsibleContent>
                          {sumber.slice(3).map((source) => (
                            <Label
                              key={source.id}
                              className="h-8 hover:bg-yellow-100 pl-3 rounded-md font-normal text-sm"
                            >
                              <Checkbox />
                              <span>{source.nama.id}</span>
                            </Label>
                          ))}
                        </CollapsibleContent>
                        <CollapsibleTrigger
                          className={
                            "text-xs text-center w-full flex items-center gap-2 pl-3 h-7 hover:underline hover:underline-offset-2 font-semibold text-yellow-600"
                          }
                          onClick={() =>
                            setShowMore((prev) => ({
                              ...prev,
                              source: !prev.source,
                            }))
                          }
                        >
                          <span className="whitespace-nowrap">
                            {showMore.source ? "Less More" : "Show More"}
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
              <div className="h-10 w-full" />
              <div className="h-10 bg-linear-to-t from-white via-white/80 to-white/50 absolute bottom-0 left-0 w-full z-10 " />
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="min-h-[calc(100svh-64px-32px-20px)] pt-5 flex flex-col gap-4">
            <div className="h-10 bg-yellow-400 rounded-xl flex items-center pl-4 pr-2 justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold">Palet Tersedia</p>
                <p className="text-xs font-light">(30 Palet)</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      size={"sm"}
                      className={
                        "rounded-lg bg-white hover:bg-gray-100 text-black"
                      }
                    >
                      <ArrowDownWideNarrow className="size-3.5" />
                      Terbaru
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" sideOffset={8}>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <CalendarDays className="size-3.5 stroke-[1.5]" />
                      Terbaru
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TicketPercent className="size-3.5 stroke-[1.5]" />
                      Termurah
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Gem className="size-3.5 stroke-[1.5]" />
                      Termahal
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 16 }, (_, index) => (
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
                        Palet Sepatu Olahraga lorem ipsum dolor sit amet
                        consectetur adipisicing elit. Quisquam, voluptatum.
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
            <div className="w-full justify-center flex items-center mt-6 gap-2">
              <Button size={"icon"} variant={"ghost"}>
                <ChevronLeft />
              </Button>
              <Button size={"icon"} variant={"ghost"}>
                1
              </Button>
              <Button size={"icon"} variant={"ghost"} disabled>
                <MoreHorizontal />
              </Button>
              {Array.from({ length: 3 }, (_, i) => (
                <Button
                  size={"icon"}
                  key={i}
                  variant={i === 1 ? "default" : "ghost"}
                  className={cn(i === 1 && "bg-yellow-400 text-black")}
                >
                  {i + 5}
                </Button>
              ))}
              <Button size={"icon"} variant={"ghost"} disabled>
                <MoreHorizontal />
              </Button>
              <Button size={"icon"} variant={"ghost"}>
                10
              </Button>
              <Button size={"icon"} variant={"ghost"}>
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
