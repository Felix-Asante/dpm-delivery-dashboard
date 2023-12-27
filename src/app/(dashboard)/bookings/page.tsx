import React from "react";
import BookingLists from "./_sections/BookingLists";
import { getCategory } from "@/actions/category";
import { getBookings } from "@/actions/bookings";
import EmptyContent from "@/components/shared/EmptyContent";
import WithServerError from "@/components/hoc/WithServerError";

interface PageProps {
	searchParams: {
		status?: string;
		search?: string;
		category?: string;
		from?: string;
		to?: string;
		page?: string;
	};
}
export default async function BookingsPage({ searchParams }: PageProps) {
	const { search = "" } = searchParams;
	const [categories, bookings] = await Promise.all([
		getCategory(),
		getBookings({ ...searchParams, query: search }),
	]);

	const totalBookings = bookings?.results?.meta?.totalItems;
	const error = bookings?.error ?? categories?.error;
	return (
		<WithServerError error={error}>
			<div className='bg-white min-h-screen'>
				<BookingLists
					categories={categories?.results!}
					bookings={bookings?.results?.items!}
					totalBookings={totalBookings!}
					totalPages={bookings?.results?.meta?.totalPages!}
				/>
			</div>
		</WithServerError>
	);
}
