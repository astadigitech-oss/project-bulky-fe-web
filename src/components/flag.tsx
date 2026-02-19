import { cn } from "@/lib/utils";
import { default as GB } from "country-flag-icons/react/3x2/GB";
import { default as ID } from "country-flag-icons/react/3x2/ID";
import { default as GBSquare } from "country-flag-icons/react/1x1/GB";
import { default as IDSquare } from "country-flag-icons/react/1x1/ID";

type MyFlagProps = {
  /**
   * For English Language
   */
  en?: boolean;
  isSquare?: boolean;
  className?: string;
};

export const MyFlag = ({
  en = false,
  isSquare = false,
  className,
}: MyFlagProps) => {
  const FlagComponent = en
    ? isSquare
      ? GBSquare
      : GB
    : isSquare
      ? IDSquare
      : ID;

  return (
    <FlagComponent
      className={cn(
        "shadow overflow-hidden rounded",
        isSquare ? "size-4" : "h-3! aspect-3/2",
        className,
      )}
    />
  );
};
