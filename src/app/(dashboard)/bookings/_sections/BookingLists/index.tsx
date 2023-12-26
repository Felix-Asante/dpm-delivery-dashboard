"use client";
import HStack from "@/components/shared/layout/HStack";
import { pluralize } from "@/utils/helpers";
import { Button, Pagination } from "@nextui-org/react";
import React from "react";
import BookingListFilters from "./BookingListFilters";
import { Category } from "@/types/category";
import { Booking } from "@/types/booking";
import BookingListTable from "./BookingListTable";
import useQueryParams from "@/hooks/useQueryParam";

interface Props {
	categories: Category[];
	bookings: Booking[];
	totalBookings: number;
	totalPages: number;
}
export default function BookingLists(props: Props) {
	const { categories, totalBookings, totalPages, bookings } = props;
	const { add } = useQueryParams();
	return (
		<section>
			<BookingListFilters categories={categories} />
			<div className='px-5 pb-4'>
				<h3 className='font-semibold text-xl'>
					{totalBookings} {pluralize("Booking", totalBookings)}
				</h3>
				<p className='text-gray-400'>List of all bookings</p>
				<div className='px-3 py-1 border rounded-md my-3'>
					<BookingListTable bookings={bookings} />
					{totalPages > 1 && (
						<HStack className='justify-end mt-3'>
							<Pagination
								total={totalPages}
								initialPage={1}
								variant='bordered'
								showControls
								onChange={(page) => add("page", page.toString())}
							/>
						</HStack>
					)}
				</div>
			</div>
		</section>
	);
}
