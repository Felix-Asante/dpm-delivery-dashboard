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
		},
		{
			...totalBookings,
			label: "Total bookings",
			icon: BookMarkedIcon,
		},
		{
			...totalPlaces,
			label: "Total businesses",
			icon: Building2Icon,
		},
		{
			...totalOffers,
			label: "Total Offers",
			icon: BadgePercentIcon,
		},
	];
	return (
		<div className='mt-7 grid gap-4 divide-y sm:divide-y-0 sm:divide-x sm:grid-cols-2 md:grid-cols-4'>
			{stats?.map((stat) => (
				<div key={stat?.label} className='px-3 pt-3 sm:pt-0'>
					<div className='flex items-center gap-2'>
						{<stat.icon size={20} className='text-gray-500' />}
						<p className='text-gray-500 text-sm'>{stat.label}</p>
					</div>
					<h3 className='font-bold text-xl md:text-2xl mt-3'>
						{stat.all_time}
					</h3>
					<p className='text-gray-500 text-sm'>
						vs current month:{" "}
						<span className='font-bold'>{stat.currentMonth}</span>{" "}
					</p>
				</div>
			))}
		</div>
	);
}
