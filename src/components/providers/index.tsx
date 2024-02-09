"use client";

import { theme } from "@/config/constants/theme";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Next13ProgressBar } from "next13-progressbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<NextUIProvider navigate={router.push}>{children}</NextUIProvider>
				<Next13ProgressBar
					height='4px'
					color={theme.colors.primary.DEFAULT}
					options={{ showSpinner: false }}
					showOnShallow
				/>
			</SessionProvider>
		</QueryClientProvider>
	);
}
