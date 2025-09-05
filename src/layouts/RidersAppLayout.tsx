import HStack from "@/components/shared/layout/HStack";
import { Button, buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface RidersAppLayoutProps {
  children: React.ReactNode;
}

export async function RidersAppLayout({ children }: RidersAppLayoutProps) {
  const user = await getCurrentUser();
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-boder py-4">
        <nav className="max-w-5xl mx-auto px-5 lg:px-0">
          <HStack className="items-center justify-between">
            <div>
              <Link
                href={"/"}
                className="text-secondary uppercase text-xl sm:text-2xl font-bold"
              >
                Dpm <span className="text-primary">delivery</span>{" "}
              </Link>
              <p className="text-gray-500 text-xs">Riders dashboard</p>
            </div>

            <Link
              href="/account/settings"
              className={buttonVariants({
                variant: "outline",
                className: "!border-0 !bg-muted !gap-2 !item-center",
              })}
            >
              <UserIcon size={20} />
              <span>My Profile</span>
            </Link>
          </HStack>
        </nav>
      </header>
      <section className="max-w-5xl mx-auto px-5">{children}</section>
    </main>
  );
}
