import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

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
		<html lang='en' className='light'>
			<body className={inter.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
