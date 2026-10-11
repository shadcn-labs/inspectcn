import { LogoMark as SharedLogoMark } from "@inspectcn/brand/logo";

import { cn } from "@/lib/utils";

export { getLogoMarkSVG } from "@inspectcn/brand/logo";

export const LogoMark = ({
  className,
  ...props
}: React.ComponentProps<"svg">) => (
  <SharedLogoMark className={cn("size-4", className)} {...props} />
);
