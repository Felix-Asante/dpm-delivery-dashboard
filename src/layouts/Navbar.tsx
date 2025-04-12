"use client";
import Container from "@/components/shared/layout/Container";
import HStack from "@/components/shared/layout/HStack";
import { DASHBOARD_PATHS } from "@/config/routes";
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { BellDotIcon, PlusIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next13-progressbar";

export default function MainNavbar() {
  return (
    <div className="bg-secondary py-3 px-8 md:px-16 w-full sticky top-0 z-[100]">
      <Container>
        <HStack className="items-center justify-between">
          <Link
            href={"/"}
            className="text-white uppercase text-2xl font-bold hidden sm:block"
          >
            Dpm <span className="text-primary">delivery</span>{" "}
          </Link>
          <HStack className="items-center justify-between">
            <OperationsShortCuts />
            <div className="mr-6 ml-1">
              <Badge content="9+" shape="circle" color="primary">
                <Button
                  radius="full"
                  isIconOnly
                  aria-label="more than 99 notifications"
                  variant="light"
                  size="sm"
                  className="hover:!bg-transparent"
                >
                  <BellDotIcon className="text-warning" size={24} />
                </Button>
              </Badge>
            </div>
            <ProfileNavigation />
          </HStack>
        </HStack>
      </Container>
    </div>
  );
}

function ProfileNavigation() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            size: "sm",
          }}
          className="transition-transform text-white gap-4"
          description={"@tonyreichert"}
          name="Super Admin"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="settings" href={DASHBOARD_PATHS.account.settings}>
          Account Details
        </DropdownItem>
        <DropdownItem
          key="team_settings"
          href={DASHBOARD_PATHS.account.settings}
        >
          Settings
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onClick={handleLogout}>
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
          isIconOnly
          color="primary"
          size="sm"
          aria-label="dashboard shortcuts"
        >
          <PlusIcon className="text-white" size={24} />
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
