import { createIconImage } from "@/lib/icon-image";

export const size = { height: 128, width: 128 };
export const contentType = "image/png";

const Icon = () => createIconImage(size.width, 96);

export default Icon;
