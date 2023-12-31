import { getOffers } from "@/actions/specials";
import WithServerError from "@/components/hoc/WithServerError";
import React from "react";
import OffersListSection from "./_sections/OffersListSection";

interface PageProps {
	searchParams: {
		page?: string;
		search?: string;
	};
}
export default async function SpecialsPage({ searchParams }: PageProps) {
	const { page = "1", search = "" } = searchParams;
	const offers = await getOffers({ page, query: search });

	const error = offers?.error;

	return (
		<WithServerError error={error}>
			<div className='bg-white h-screen px-5 pt-5'>
				<OffersListSection offers={offers?.results!} />
			</div>
		</WithServerError>
	);
}
