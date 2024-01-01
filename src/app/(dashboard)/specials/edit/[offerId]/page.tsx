import React from "react";
import UpdateOfferSection from "../../_sections/update/UpdateOfferSection";
import { getOffer } from "@/actions/specials";

interface PageProps {
	params: {
		offerId: string;
	};
}
export default async function EditOfferPage({ params }: PageProps) {
	const offer = await getOffer(params?.offerId);
	return (
		<div className='px-8 pt-8'>
			<UpdateOfferSection offer={offer} />
		</div>
	);
}
