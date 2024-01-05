"use client";

import { theme } from "@/config/constants/theme";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Next13ProgressBar } from "next13-progressbar";

export function Providers({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	return (
		<SessionProvider>
			<NextUIProvider navigate={router.push}>{children}</NextUIProvider>
			<Next13ProgressBar
				height='4px'
				color={theme.colors.primary.DEFAULT}
				options={{ showSpinner: false }}
				showOnShallow
			/>
		</SessionProvider>
	);
}
