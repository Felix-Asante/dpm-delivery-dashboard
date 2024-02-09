import { getPlaceRatings } from "@/actions/place";
import WithServerError from "@/components/hoc/WithServerError";
import EmptyContent from "@/components/shared/EmptyContent";
import ReviewCard from "@/components/shared/cards/ReviewCard";
import HStack from "@/components/shared/layout/HStack";
import { Place } from "@/types/place";
import { Pagination, Skeleton } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

interface Props {
	place: Place;
}
export default function PlaceReviews({ place }: Props) {
	const [page, setPage] = useState(1);

	const { data, error, isPending } = useQuery({
		queryKey: ["placeReviews", place?.id, page],
		queryFn: () => getPlaceRatings(place?.id, { page }),
	});

	if (isPending) {
		return (
			<div className='grid grid-cols-2 xl:grid-cols-3 gap-3'>
				{Array.from("loadin").map((l) => (
					<Skeleton className='rounded-lg mb-3' key={l}>
						<div className='h-40 rounded-lg bg-default-300'></div>
					</Skeleton>
				))}
			</div>
		);
	}

	if (data?.results?.items?.length === 0 && !isPending) {
		return <EmptyContent title='No reviews yet' />;
	}

	const totalPages = data?.results?.meta?.totalPages || 1;

	return (
		<WithServerError error={error?.message}>
			<div className='grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
				{data?.results?.items?.map((rating) => (
					<ReviewCard key={rating?.id} rating={rating} />
				))}
			</div>
			{totalPages > 1 && (
				<HStack className='justify-center mt-3'>
					<Pagination
						total={totalPages}
						initialPage={1}
						variant='bordered'
						showControls
						onChange={(page) => setPage(page)}
					/>
				</HStack>
			)}
		</WithServerError>
	);
}
