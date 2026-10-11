import { createIconImage } from "@/lib/icon-image";

export const size = { height: 180, width: 180 };
export const contentType = "image/png";

const AppleIcon = () => createIconImage(size.width, 144);

export default AppleIcon;
