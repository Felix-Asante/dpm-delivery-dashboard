import { CountResponse } from "@/types";
import {
  BadgePercentIcon,
  BookMarkedIcon,
  Building2Icon,
  UsersIcon,
} from "lucide-react";
import React from "react";

interface Props {
  totalUsers: CountResponse;
  totalBookings: CountResponse;
  totalPlaces: CountResponse;
  totalOffers: CountResponse;
}
export default function StatisticsSection(props: Readonly<Props>) {
  const { totalBookings, totalOffers, totalPlaces, totalUsers } = props;
  const stats = [
    {
      ...totalUsers,
      label: "Total users",
      icon: UsersIcon,
      color: "bg-primary/10 text-primary",
    },
    {
      ...totalBookings,
      label: "Total bookings",
      icon: BookMarkedIcon,
      color: "bg-success/10 text-success",
    },
    {
      ...totalPlaces,
      label: "Total businesses",
      icon: Building2Icon,
      color: "bg-gray-100 text-secondary",
    },
    {
      ...totalOffers,
      label: "Total offers",
      icon: BadgePercentIcon,
      color: "bg-gray-100 text-secondary",
    },
  ];
  return (
    <div className="grid overflow-hidden rounded-xl border bg-white sm:grid-cols-2 xl:grid-cols-4 sm:[&>*:nth-child(even)]:border-l xl:[&>*+*]:border-l">
      {stats?.map((stat) => (
        <div
          key={stat?.label}
          className="flex min-w-0 items-start justify-between gap-4 border-b p-5 last:border-b-0 sm:nth-last-[-n+2]:border-b-0 xl:border-b-0"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-secondary">
              {stat.all_time}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              <span className="font-semibold text-secondary">
                {stat.currentMonth}
              </span>{" "}
              this month
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
