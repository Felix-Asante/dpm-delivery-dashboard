"use client";

import { theme } from "@/config/constants/theme";
import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Next13ProgressBar } from "next13-progressbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <HeroUIProvider navigate={router.push}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </HeroUIProvider>
        <Next13ProgressBar
          height="4px"
          color={theme.colors.primary.DEFAULT}
          options={{ showSpinner: false }}
          showOnShallow
        />
      </SessionProvider>
    </QueryClientProvider>
  );
}
