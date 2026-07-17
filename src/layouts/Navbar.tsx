"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { DASHBOARD_PATHS } from "@/config/routes";
import { SidebarNavigation } from "./sidebars/DashboardSideBar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import {
  ChevronDown,
  LogOut,
  Menu,
  Plus,
  Settings,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next13-progressbar";
import { useState } from "react";

export default function MainNavbar() {
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="light"
            radius="sm"
            aria-label="Open navigation"
            className="lg:hidden"
            onPress={() => setNavigationOpen(true)}
          >
            <Menu size={22} />
          </Button>
          <Link
            href="/"
            className="text-xl font-bold uppercase tracking-tight text-secondary"
          >
            Dpm <span className="text-primary">delivery</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <OperationsShortCuts />
          <div className="h-6 w-px bg-gray-200" aria-hidden />
          <ProfileNavigation />
        </div>
      </div>

      <Sheet open={navigationOpen} onOpenChange={setNavigationOpen}>
        <SheetContent
          side="left"
          className="w-[280px] p-0 shadow-none"
        >
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <div className="flex h-16 items-center justify-between border-b px-5">
            <Link
              href="/"
              className="text-xl font-bold uppercase tracking-tight text-secondary"
              onClick={() => setNavigationOpen(false)}
            >
              Dpm <span className="text-primary">delivery</span>
            </Link>
            <SheetClose asChild>
              <button
                type="button"
                aria-label="Close navigation"
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </SheetClose>
          </div>
          <div className="px-3 py-5">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Workspace
            </p>
            <SidebarNavigation onNavigate={() => setNavigationOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

function ProfileNavigation() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const initials = user?.fullName
    ?.split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg p-1.5 text-left transition-colors hover:bg-gray-100"
        >
          <Avatar
            size="sm"
            src={user?.profilePicture ?? undefined}
            fallback={initials}
            className="bg-secondary text-white"
          />
          <span className="hidden min-w-0 sm:block">
            <span className="block max-w-36 truncate text-sm font-semibold text-secondary">
              {user?.fullName || "Account"}
            </span>
            <span className="block text-xs text-gray-500">
              {user?.role?.name}
            </span>
          </span>
          <ChevronDown size={15} className="hidden text-gray-400 sm:block" />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem
          key="settings"
          href={DASHBOARD_PATHS.account.settings}
          startContent={<Settings size={17} />}
        >
          Account Details
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          onClick={handleLogout}
          startContent={<LogOut size={17} />}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

function OperationsShortCuts() {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          color="primary"
          radius="sm"
          size="md"
          aria-label="dashboard shortcuts"
          startContent={<Plus size={18} />}
          className="font-semibold"
        >
          <span className="hidden sm:inline">New</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="settings" href={DASHBOARD_PATHS.places.new}>
          Add new place
        </DropdownItem>
        <DropdownItem
          key="team_settings"
          href={DASHBOARD_PATHS.categories.root({ new: "true" })}
        >
          Add new category
        </DropdownItem>
        <DropdownItem key="logout" href={DASHBOARD_PATHS.bookings.root}>
          View bookings
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
