import { UserRoles } from "@/config/constants";
import {
  ArrowLeftRightIcon,
  BadgePercentIcon,
  BarChartBigIcon,
  BookMarkedIcon,
  BoxesIcon,
  Building2Icon,
  CoinsIcon,
  MessageSquareWarningIcon,
  PackageIcon,
  ShieldUserIcon,
  UsersIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DASHBOARD_PATHS } from "../routes";

export type SidebarNavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  /** If set, the link is only shown for these roles. */
  allowedRoles?: UserRoles[];
};

export const SIDEBAR_NAVIGATION: SidebarNavItem[] = [
  {
    label: "Overview",
    icon: BarChartBigIcon,
    href: DASHBOARD_PATHS.root,
  },
  {
    label: "Places",
    icon: Building2Icon,
    href: DASHBOARD_PATHS.places.root,
  },
  {
    label: "Bookings",
    icon: BookMarkedIcon,
    href: DASHBOARD_PATHS.bookings.root,
  },
  {
    label: "Categories",
    icon: BoxesIcon,
    href: DASHBOARD_PATHS.categories.root(),
  },
  {
    label: "Users",
    icon: UsersIcon,
    href: DASHBOARD_PATHS.users.root,
  },
  {
    label: "Riders",
    icon: ShieldUserIcon,
    href: DASHBOARD_PATHS.riders.root,
  },
  {
    label: "Offers",
    icon: BadgePercentIcon,
    href: DASHBOARD_PATHS.specials.root,
  },
  {
    label: "Variables",
    icon: ArrowLeftRightIcon,
    href: DASHBOARD_PATHS.variables.root,
  },
  {
    label: "Deliveries",
    icon: PackageIcon,
    href: DASHBOARD_PATHS.deliveries.root,
  },
  {
    label: "Payouts",
    icon: CoinsIcon,
    href: DASHBOARD_PATHS.payoutRequests.root,
  },
  {
    label: "Complaints",
    icon: MessageSquareWarningIcon,
    href: DASHBOARD_PATHS.complaints.root,
    allowedRoles: [UserRoles.ADMIN],
  },
];
