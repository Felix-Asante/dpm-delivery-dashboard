import { formatCurrency } from "@/utils/helpers";
import {
  BanknoteIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  WalletIcon,
} from "lucide-react";
import React from "react";
import { AnalyticsDashboardResponse } from "@/actions/analytics";
import { DEFAULT_CURRENCY } from "@/config/constants";

interface Props {
  data: AnalyticsDashboardResponse;
}

export default function AnalyticsStats({ data }: Readonly<Props>) {
  const stats = [
    {
      label: "Total Revenue",
      value: `${DEFAULT_CURRENCY.symbol} ${formatCurrency(data.totalRevenue)}`,
      icon: BanknoteIcon,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Total Payouts",
      value: `${DEFAULT_CURRENCY.symbol} ${formatCurrency(data.totalPayouts)}`,
      icon: WalletIcon,
      color: "bg-success/10 text-success",
    },
    {
      label: "Pending Payouts",
      value: `${DEFAULT_CURRENCY.symbol} ${formatCurrency(
        data.pendingPayouts
      )}`,
      icon: CreditCardIcon,
      color: "bg-gray-100 text-secondary",
    },
    {
      label: "Total Orders",
      value: data.totalOrders,
      icon: ShoppingBagIcon,
      color: "bg-gray-100 text-secondary",
    },
  ];

  return (
    <div className="grid overflow-hidden rounded-xl border bg-white sm:grid-cols-2 xl:grid-cols-4 sm:[&>*:nth-child(even)]:border-l xl:[&>*+*]:border-l">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex min-w-0 items-start justify-between gap-4 border-b p-5 last:border-b-0 sm:nth-last-[-n+2]:border-b-0 xl:border-b-0"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-2 truncate text-xl font-bold tracking-tight text-secondary xl:text-2xl">
              {stat.value}
            </p>
          </div>
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.color}`}
          >
            <stat.icon size={19} strokeWidth={1.8} />
          </div>
        </div>
      ))}
    </div>
  );
}
