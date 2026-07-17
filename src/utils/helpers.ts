import {
  BookingStatus,
  ShipmentOptions,
  ShipmentStatus,
} from "@/config/constants";
import { ERRORS } from "@/config/constants/errors";
import regexPattern from "@/rules";
import { Query, paths } from "@/types/url";
import { clsx, type ClassValue } from "clsx";
import {
  BanIcon,
  BanknoteIcon,
  BoxIcon,
  CheckIcon,
  CreditCardIcon,
  LoaderIcon,
  MapIcon,
  MapPinIcon,
  PackageCheckIcon,
  PauseCircleIcon,
  StoreIcon,
  TruckIcon,
  Undo2Icon,
  UserCheckIcon,
  UserPlusIcon,
  type LucideIcon,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
export function parsePathname(pathname: string): paths[] {
  // Remove leading slash if present
  if (pathname.startsWith("/")) {
    pathname = pathname.slice(1);
  }

  // Split the pathname into parts based on slashes
  const parts = pathname.split("/");

  // Initialize an empty array to store the result
  const result: paths[] = [];

  // Iterate through the parts and build the result array
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part) {
      const href = "/" + parts.slice(0, i + 1).join("/");
      const current = i === parts.length - 1;
      result.push({
        name: part,
        href,
        current,
      });
    }
  }

  return result.length ? result : [{ name: "Home", href: "/", current: true }];
}

export function toQuery(queryObj: Query) {
  if (!queryObj || !Object.keys(queryObj).length) return "";
  const queries: string[] = [];
  Object.keys(queryObj).forEach((key) => {
    if (queryObj[key]) {
      queries.push(`${key}=${queryObj[key]}`);
    }
  });
  return queries.length ? `?${queries.join("&")}` : "";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: any) {
  if (!error?.response && !error?.message) {
    return ERRORS.MESSAGE.NETWORK;
  }
  const { statusCode, data, message = "" } = error;
  if (statusCode === 403) {
    // logout
    console.log("logout");
  }

  return data?.message || message;
}

export function isValidUrl(url: string): boolean {
  if (!regexPattern.URL.test(url)) return false;
  return true;
}
export function pluralize(text: string, total = 2): string {
  return total > 1 ? `${text}s` : text;
}

type AnyObject = { [key: string]: any };

export function removeFromObject(obj: AnyObject, keys: string[]) {
  keys.forEach((key) => {
    delete obj[key];
  });

  return obj;
}

export function removeEmptyFields(obj: AnyObject): AnyObject {
  const cleanedObj: AnyObject = {};

  for (const key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      obj[key] !== null &&
      obj[key] !== undefined &&
      obj[key] !== ""
    ) {
      cleanedObj[key] = obj[key];
    }
  }

  return cleanedObj;
}

export function getInitials(name?: string) {
  if (!name) return "";
  const nameParts = name.split("");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  } else if (nameParts.length > 1) {
    const [firstName, lastName] = nameParts;
    return `${firstName.charAt(0).toUpperCase()}${lastName
      .charAt(0)
      .toUpperCase()}`;
  }
  return "";
}

export function getStyleByStatus(status: string) {
  switch (status) {
    case BookingStatus.CANCELLED:
    case BookingStatus.REJECTED:
    case ShipmentStatus.FAILED_DELIVERY_ATTEMPT:
    case ShipmentStatus.RETURNED:
      return {
        base: "border border-red-200 bg-red-50 text-red-700",
        dot: "bg-red-500",
      };

    case BookingStatus.PENDING:
    case ShipmentStatus.ON_HOLD:
      return {
        base: "border border-amber-200 bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
      };

    case BookingStatus.CONFIRMED:
    case ShipmentStatus.PICKUP_CONFIRMED:
    case ShipmentStatus.RIDER_ASSIGNED:
    case ShipmentStatus.RIDER_REASSIGNED:
    case ShipmentStatus.READY_FOR_PICKUP:
    case ShipmentStatus.OUT_FOR_DELIVERY:
    case ShipmentStatus.IN_TRANSIT:
    case ShipmentStatus.ARRIVED:
      return {
        base: "border border-blue-200 bg-blue-50 text-blue-700",
        dot: "bg-blue-500",
      };

    case BookingStatus.DELIVERED:
    case ShipmentStatus.DELIVERED:
    case ShipmentStatus.PAYMENT_RECEIVED:
      return {
        base: "border border-emerald-200 bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
      };

    default:
      return {
        base: "border border-gray-200 bg-gray-50 text-gray-700",
        dot: "bg-gray-500",
      };
  }
}

export function generateRandomPassword(length: number) {
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";

  const allChars = lowerCaseChars + upperCaseChars + numberChars + specialChars;

  let password = "";

  // Ensure at least one of each character type
  password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
  password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
  password += numberChars[Math.floor(Math.random() * numberChars.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Generate the remaining characters
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to randomize the order
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}

export function formatCurrency(
  amount: number,
  currencyCode: string = "USD",
): string {
  const formatter = new Intl.NumberFormat("en-US");

  return formatter.format(amount);
}

export function getShipmentStatusDisplay(status: string, isAdmin?: boolean) {
  const statusDisplay: Record<string, string> = {
    [ShipmentStatus.OUT_FOR_DELIVERY]: "Out for Delivery",
    [ShipmentStatus.FAILED_DELIVERY_ATTEMPT]: "Failed Delivery Attempt",
    [ShipmentStatus.DELIVERED]: "Delivered",
    [ShipmentStatus.RIDER_REASSIGNED]: isAdmin
      ? "Rider Reassigned"
      : "Assigned",
    [ShipmentStatus.PICKUP_CONFIRMED]: "Pickup Confirmed",
    [ShipmentStatus.PENDING]: "Pending",
    [ShipmentStatus.RIDER_ASSIGNED]: isAdmin ? "Rider Assigned" : "Assigned",
    [ShipmentStatus.PAYMENT_RECEIVED]: "Payment Received",
    [ShipmentStatus.RETURNED]: "Returned",
    [ShipmentStatus.ON_HOLD]: "On Hold",
    [ShipmentStatus.REPACKAGED]: "Repackaged",
    [ShipmentStatus.IN_TRANSIT]: "In Transit",
    [ShipmentStatus.ARRIVED]: "Arrived",
    [ShipmentStatus.READY_FOR_PICKUP]: "Ready for Pickup",
    [ShipmentStatus.REFUNDED]: "Refunded",
  };

  return statusDisplay[status] ?? status;
}

export function getShipmentOptionDisplay(option: string) {
  if (option === ShipmentOptions.STANDARD) {
    return "Standard Delivery";
  } else if (option === ShipmentOptions.EXPRESS) {
    return "Express Delivery";
  } else if (option === ShipmentOptions.SPECIAL) {
    return "Special Delivery";
  } else if (option === ShipmentOptions.BULK) {
    return "Bulk Delivery";
  }
  return option;
}

export function getIconByShipmentStatus(status: string) {
  const iconDisplay: Record<string, LucideIcon> = {
    [ShipmentStatus.OUT_FOR_DELIVERY]: TruckIcon,
    [ShipmentStatus.FAILED_DELIVERY_ATTEMPT]: BanIcon,
    [ShipmentStatus.DELIVERED]: CheckIcon,
    [ShipmentStatus.RIDER_REASSIGNED]: UserPlusIcon,
    [ShipmentStatus.PICKUP_CONFIRMED]: PackageCheckIcon,
    [ShipmentStatus.PENDING]: LoaderIcon,
    [ShipmentStatus.RIDER_ASSIGNED]: UserCheckIcon,
    [ShipmentStatus.PAYMENT_RECEIVED]: CreditCardIcon,
    [ShipmentStatus.RETURNED]: Undo2Icon,
    [ShipmentStatus.ON_HOLD]: PauseCircleIcon,
    [ShipmentStatus.REPACKAGED]: BoxIcon,
    [ShipmentStatus.IN_TRANSIT]: MapIcon,
    [ShipmentStatus.ARRIVED]: MapPinIcon,
    [ShipmentStatus.READY_FOR_PICKUP]: StoreIcon,
    [ShipmentStatus.REFUNDED]: BanknoteIcon,
  };

  return iconDisplay[status] ?? CheckIcon;
}
