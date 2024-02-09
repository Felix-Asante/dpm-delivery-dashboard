"use client";
import { getBookings } from "@/actions/bookings";
import BookingListTable from "@/app/(dashboard)/bookings/_sections/BookingLists/BookingListTable";
import WithServerError from "@/components/hoc/WithServerError";
import HStack from "@/components/shared/layout/HStack";
import { Place } from "@/types/place";
import { Pagination } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
	place: Place;
}
export default function PlaceBookings({ place }: Props) {
	const [page, setPage] = useState(1);

	const {
		data: bookings,
		error,
		isPending,
	} = useQuery({
		queryKey: ["placeBookings", place?.id, page],
		queryFn: () => getBookings({ place: place?.id, page }),
	});

	if (isPending) return <div>Fetching bookings...</div>;

	const totalPages = bookings?.results?.meta?.totalPages || 1;

	return (
		<WithServerError error={error?.message}>
			<div className='mt-4'>
				<h3 className='font-semibold text-lg mb-2'>List of all bookings </h3>
				<BookingListTable bookings={bookings?.results?.items ?? []} />
				{totalPages > 1 && (
					<HStack className='justify-end mt-3'>
						<Pagination
							total={totalPages}
							initialPage={1}
							variant='bordered'
							showControls
							onChange={(page) => setPage(page)}
						/>
					</HStack>
				)}
			</div>
		</WithServerError>
	);
}
