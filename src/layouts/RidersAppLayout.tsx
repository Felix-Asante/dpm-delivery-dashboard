import HStack from "@/components/shared/layout/HStack";
import { buttonVariants } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import { Avatar } from "@heroui/avatar";
import Link from "next/link";
import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { ChangeDefaultPassword } from "@/components/shared/ChangeDefaultPassword";

interface RidersAppLayoutProps {
  children: React.ReactNode;
}

export async function RidersAppLayout({
  children,
}: Readonly<RidersAppLayoutProps>) {
  const user = await getCurrentUser();
  if (user?.isDefaultPassword) {
    return <ChangeDefaultPassword />;
  }
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 h-16 border-b bg-white">
        <nav className="mx-auto flex h-full max-w-6xl items-center px-4 sm:px-6">
          <HStack className="w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-xl font-bold uppercase tracking-tight text-secondary"
              >
                Dpm <span className="text-primary">delivery</span>
              </Link>
              <span className="hidden border-l pl-3 text-xs font-medium text-gray-500 sm:block">
                Rider workspace
              </span>
            </div>

            <Link
              href="/account/settings"
              className={buttonVariants({
                variant: "ghost",
                className: "gap-2",
              })}
            >
              <Avatar
                size="sm"
                src={user?.profilePicture ?? undefined}
                fallback={<UserIcon size={17} />}
                className="bg-gray-100 text-secondary"
              />
              <span className="hidden max-w-40 truncate text-sm font-semibold sm:inline">
                {user?.fullName || "My profile"}
              </span>
            </Link>
          </HStack>
        </nav>
      </header>
      <section className="mx-auto max-w-6xl px-4 sm:px-6">{children}</section>
    </main>
  );
}
