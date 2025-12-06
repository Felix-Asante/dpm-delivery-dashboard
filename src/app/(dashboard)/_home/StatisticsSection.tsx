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
export default function StatisticsSection(props: Props) {
  const { totalBookings, totalOffers, totalPlaces, totalUsers } = props;
  const stats = [
    {
      ...totalUsers,
      label: "Total users",
      icon: UsersIcon,
      color: "bg-orange-100 text-orange-600",
    },
    {
      ...totalBookings,
      label: "Total bookings",
      icon: BookMarkedIcon,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      ...totalPlaces,
      label: "Total businesses",
      icon: Building2Icon,
      color: "bg-pink-100 text-pink-600",
    },
    {
      ...totalOffers,
      label: "Total Offers",
      icon: BadgePercentIcon,
      color: "bg-teal-100 text-teal-600",
    },
  ];
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {stats?.map((stat) => (
        <div
          key={stat?.label}
          className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-start justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-2">{stat.all_time}</h3>
            <p className="text-gray-400 text-xs mt-1">
              vs this month:{" "}
              <span className="font-bold text-gray-600">
                {stat.currentMonth}
              </span>
            </p>
          </div>
          <div className={`p-2 rounded-lg ${stat.color}`}>
            <stat.icon size={20} />
          </div>
        </div>
      ))}
    </div>
  );
}
