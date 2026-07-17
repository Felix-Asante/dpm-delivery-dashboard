"use client";
import { UserRoles } from "@/config/constants";
import { SIDEBAR_NAVIGATION } from "@/config/constants/navigations";
import { cn, parsePathname } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

interface SidebarNavigationProps {
  onNavigate?: () => void;
}

export function SidebarNavigation({
  onNavigate,
}: Readonly<SidebarNavigationProps>) {
  const pathname = parsePathname(usePathname());
  const { data: session } = useSession();
  const role = session?.user?.role?.name as UserRoles | undefined;

  const items = useMemo(
    () =>
      SIDEBAR_NAVIGATION.filter(
        (nav) =>
          !nav.allowedRoles ||
          (role != null && nav.allowedRoles.includes(role))
      ),
    [role]
  );

  return (
    <nav aria-label="Dashboard navigation" className="space-y-1">
      {items.map((nav) => {
        const isActive = pathname[0].href === nav.href;
        return (
          <Link
            key={nav.label}
            href={nav.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-secondary",
              isActive && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
            )}
          >
            <nav.icon size={19} strokeWidth={1.8} />
            <span>{nav.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardSideBar() {
  return (
    <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-60 border-r bg-white lg:block">
      <div className="h-full overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </p>
        <SidebarNavigation />
      </div>
    </aside>
  );
}
