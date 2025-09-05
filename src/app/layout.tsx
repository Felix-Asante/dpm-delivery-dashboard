import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";

const strawFord = localFont({
  src: [
    {
      path: "../../public/fonts/Strawford Black.ttf",
      weight: "900",
      style: "black",
    },
    {
      path: "../../public/fonts/Strawford Bold.ttf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../../public/fonts/Strawford Medium.ttf",
      weight: "500",
      style: "medium",
    },
    // {
    // 	path: "../../public/fonts/strawford-regular.ttf",
    // 	weight: "400",
    // 	style: "normal",
    // },
  ],
});
export const metadata: Metadata = {
  title: "DPM DELIVERY",
  description: "DPM Delivery service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${strawFord.className} bg-gray-50`}>
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
