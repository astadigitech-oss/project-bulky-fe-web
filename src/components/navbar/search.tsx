import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { SearchIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearch } from "@/hooks/use-serach";

export const Search = () => {
  const router = useRouter();
  const t = useTranslations("Header.search");
  const { search, setSearch } = useSearch();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim().length > 0) {
      router.push(`/products?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <InputGroup className="w-fit has-[[data-slot=input-group-control]:focus-visible]:w-full max-w-120">
      <InputGroupInput
        placeholder={t("placeholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
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
