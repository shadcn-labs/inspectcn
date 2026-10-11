"use client";

import { useCallback, useRef } from "react";

import { ArrowRightIcon } from "@/components/animated-icons/arrow-right";
import type { ArrowRightIconHandle } from "@/components/animated-icons/arrow-right";
import { Button } from "@/components/ui/button";
import { LINK } from "@/constants/links";
import { cn } from "@/lib/utils";

const GetExtensionButton = () => {
  const arrowRightRef = useRef<ArrowRightIconHandle>(null);

  const handleMouseEnter = useCallback(() => {
    arrowRightRef.current?.startAnimation();
  }, []);

  const handleMouseLeave = useCallback(() => {
    arrowRightRef.current?.stopAnimation();
  }, []);

  return (
    <Button
      asChild
      sound="click"
      className="px-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a href={LINK.CHROME_WEB_STORE}>
        Add to Chrome
        <ArrowRightIcon className="hidden sm:inline" ref={arrowRightRef} />
      </a>
    </Button>
  );
};

export const HomeCtas = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center", className)}>
    <GetExtensionButton />
  </div>
);
