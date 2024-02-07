import React from "react";
import PlaceSidebar from "./_sections/PlaceSidebar";
import { getPlace } from "@/actions/place";
import WithServerError from "@/components/hoc/WithServerError";

interface PageProps {
	params: {
		placeId: string;
	};
}
export default async function PlaceDetailPage({ params }: PageProps) {
	const response = await getPlace(params.placeId);
	return (
		<WithServerError error={response?.error}>
			<div className='flex gap-3 min-h-screen bg-gray-50'>
				<div className='w-1/4 sticky top-0 min-h-full'>
					<PlaceSidebar place={response?.results!} />
				</div>
				<p>Home</p>
			</div>
		</WithServerError>
	);
}
