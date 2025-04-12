import {
  ArrowLeftRightIcon,
  BadgePercentIcon,
  BarChartBigIcon,
  BookMarkedIcon,
  BoxesIcon,
  Building2Icon,
  UsersIcon,
} from "lucide-react";
import { DASHBOARD_PATHS } from "../routes";

export const SIDEBAR_NAVIGATION = [
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
    icon: UsersIcon,
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
];
