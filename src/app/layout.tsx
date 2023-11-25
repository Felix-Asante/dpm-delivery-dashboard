import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
		{
			path: "../../public/fonts/strawford-regular.ttf",
			weight: "400",
			style: "normal",
		},
	],
});
export const metadata: Metadata = {
	title: "DPM DELIVERY DASHBOARD",
	description: "DPM Delivery service",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={`${strawFord.className} bg-white`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
