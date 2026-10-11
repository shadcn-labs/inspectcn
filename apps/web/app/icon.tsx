import { createIconImage } from "@/lib/icon-image";

export const generateImageMetadata = () =>
  [128, 192, 512].map((size) => ({
    contentType: "image/png",
    id: String(size),
    size: { height: size, width: size },
  }));

const Icon = async ({ id }: { id: Promise<string> }) => {
  const size = Number(await id);
  return createIconImage(size, size === 128 ? 120 : size * 0.6875);
};

export default Icon;
