import React, { useEffect } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { SearchIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useSearchQuery } from "@/hooks/use-serach";

export const Search = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header.search");
  const { search, searchValue, setSearch } = useSearchQuery();

  useEffect(() => {
    if (searchValue.length > 0 && pathname !== "/products") {
      router.push(`/products?q=${searchValue}`);
    }
  }, [pathname, searchValue]);

  return (
    <InputGroup className="w-fit has-[[data-slot=input-group-control]:focus-visible]:w-full max-w-120">
      <InputGroupInput
        placeholder={t("placeholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="off"
        name="search_product"
      />
      <InputGroupAddon>
        <SearchIcon className="size-3.5" />
      </InputGroupAddon>
      <InputGroupAddon
        align={"inline-end"}
        className={cn("hidden", search.length > 0 && "flex")}
      >
        <InputGroupButton
          className={"rounded-full size-5"}
          onClick={() => setSearch("")}
          type="button"
        >
          <XIcon className="size-3" />
          <span className="sr-only">{t("toggle")}</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};
