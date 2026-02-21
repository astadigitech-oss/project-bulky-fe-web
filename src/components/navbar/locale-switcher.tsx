import React, { useRef, useState, useTransition } from "react";
import { Button } from "@ui/button";
import { MyFlag } from "@components/flag";
import { Command, CommandItem, CommandList } from "@ui/command";
import { Locale, useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useOnClickOutside } from "usehooks-ts";

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const t = useTranslations("Header.localeSwitcher");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const handleSelect = async (locale: Locale) => {
    startTransition(() => {
      router.replace({ pathname }, { locale: locale });
    });
  };

  useOnClickOutside(contentRef, () => setIsOpen(false));

  return (
    <div className="relative">
      <Button
        size={"icon"}
        variant={"outline"}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MyFlag en={locale === "en"} isSquare className="size-6 rounded-md" />
        <span className="sr-only">{t("toggle")}</span>
      </Button>
      <div
        ref={contentRef}
        data-state={isOpen ? "open" : "close"}
        className="absolute top-14 right-0 p-1 bg-white shadow data-[state=open]:flex data-[state=close]:hidden whitespace-nowrap rounded-xl"
      >
        <Command className="p-0">
          <CommandList>
            <CommandItem
              className="text-xs"
              value="id"
              data-checked={locale === "id"}
              onSelect={(e) => handleSelect(e as Locale)}
              disabled={isPending}
            >
              <MyFlag isSquare />
              <p>{t("id")}</p>
            </CommandItem>
            <CommandItem
              className="text-xs"
              value="en"
              data-checked={locale === "en"}
              onSelect={(e) => handleSelect(e as Locale)}
              disabled={isPending}
            >
              <MyFlag en isSquare />
              <p>{t("en")}</p>
            </CommandItem>
          </CommandList>
        </Command>
      </div>
    </div>
  );
};
