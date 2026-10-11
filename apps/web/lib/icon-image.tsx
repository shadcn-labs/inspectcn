import { LogoMark } from "@inspectcn/brand/logo";
import { ImageResponse } from "next/og";

export const createIconImage = (size: number, logoSize: number) =>
  new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#fafafa",
        color: "#0a0a0a",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <LogoMark height={logoSize} width={logoSize} />
    </div>,
    { height: size, width: size }
  );
