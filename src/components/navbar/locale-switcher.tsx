import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Button } from "@ui/button";
import { MyFlag } from "@components/flag";
import { Command, CommandItem, CommandList } from "@ui/command";
import { Locale, useLocale, useTranslations } from "next-intl";

export type LocaleSwitcherProps = {
  changeLocaleAction: (locale: Locale) => Promise<void>;
};

export const LocaleSwitcher = ({ changeLocaleAction }: LocaleSwitcherProps) => {
  const locale = useLocale();
  const t = useTranslations("Header.localeSwitcher");

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button size={"icon"} variant={"outline"}>
            <MyFlag
              en={locale === "en"}
              isSquare
              className="size-6 rounded-md"
            />
            <span className="sr-only">{t("toggle")}</span>
          </Button>
        }
      />
      <PopoverContent className={"p-0 w-auto"} align="end" sideOffset={13}>
        <Command>
          <CommandList>
            <CommandItem
              className="text-xs"
              value="id"
              data-checked={locale === "id"}
              onSelect={(e) => changeLocaleAction(e as Locale)}
            >
              <MyFlag isSquare />
              <p>{t("id")}</p>
            </CommandItem>
            <CommandItem
              className="text-xs"
              value="en"
              data-checked={locale === "en"}
              onSelect={(e) => changeLocaleAction(e as Locale)}
            >
              <MyFlag en isSquare />
              <p>{t("en")}</p>
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
