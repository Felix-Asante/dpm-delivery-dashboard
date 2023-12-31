"use client";
import { GetOffersResponse } from "@/actions/specials";
import HStack from "@/components/shared/layout/HStack";
import { pluralize } from "@/utils/helpers";
import { Button, Pagination } from "@nextui-org/react";
import React from "react";
import OffersTable from "./OffersTable";
import useQueryParams from "@/hooks/useQueryParam";
import { DASHBOARD_PATHS } from "@/config/routes";
import { useRouter } from "next/navigation";

interface Props {
	offers: GetOffersResponse;
}
export default function OffersListSection({ offers }: Props) {
	const totalPages = offers?.meta?.totalPages;
	const totalOffers = offers?.meta?.totalItems;

	const { add } = useQueryParams();
	const router = useRouter();

	return (
		<div>
			<HStack className='items-center justify-between'>
				<div>
					<h3 className='font-semibold text-xl'>
						{totalOffers} {pluralize("Offer", totalOffers)}
					</h3>
					<p className='text-gray-400'>List of all Offers</p>
				</div>

				<Button
					onClick={() => router.push(DASHBOARD_PATHS.specials.new())}
					radius='sm'
					color='primary'
					disableRipple
				>
					Create new offer
				</Button>
			</HStack>
			<OffersTable offers={offers?.items} />
			{totalPages > 1 && (
				<HStack className='justify-center mt-2'>
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
	);
}
