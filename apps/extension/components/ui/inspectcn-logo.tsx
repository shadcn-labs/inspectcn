import { LogoMark } from "@inspectcn/brand/logo";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export function InspectcnLogo({ className, ...props }: ComponentPropsWithoutRef<"svg">) {
  return (
    <LogoMark
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    />
  );
}
