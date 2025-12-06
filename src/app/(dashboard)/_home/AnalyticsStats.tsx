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

export default function AnalyticsStats({ data }: Props) {
  const stats = [
    {
      label: "Total Revenue",
      value: `${DEFAULT_CURRENCY.symbol} ${formatCurrency(data.totalRevenue)}`,
      icon: BanknoteIcon,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Payouts",
      value: `${DEFAULT_CURRENCY.symbol} ${formatCurrency(data.totalPayouts)}`,
      icon: WalletIcon,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Pending Payouts",
      value: `${DEFAULT_CURRENCY.symbol} ${formatCurrency(
        data.pendingPayouts
      )}`,
      icon: CreditCardIcon,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Total Orders",
      value: data.totalOrders,
      icon: ShoppingBagIcon,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-start justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
          </div>
          <div className={`p-2 rounded-lg ${stat.color}`}>
            <stat.icon size={20} />
          </div>
        </div>
      ))}
    </div>
  );
}
