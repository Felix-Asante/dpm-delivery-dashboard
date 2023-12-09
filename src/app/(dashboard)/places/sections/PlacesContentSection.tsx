"use client";
import HStack from "@/components/shared/layout/HStack";
import { DASHBOARD_PATHS } from "@/config/routes";
import { Button, Pagination } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import React from "react";
import PlaceTableFilters from "./PlaceTableFilters";
import PlaceTable from "./PlaceTable";
import { Place } from "@/types/place";
import { Category } from "@/types/category";
import { pluralize } from "@/utils/helpers";
import { ResponseMeta } from "@/types";
import useQueryParams from "@/hooks/useQueryParam";

interface Props {
	places: Place[];
	categories: Category[];
	meta: ResponseMeta;
}

export default function PlacesContentSection({
	places,
	categories,
	meta,
}: Props) {
	const totalPlace = meta?.totalItems;
	const { add } = useQueryParams();
	return (
		<>
			<HStack className='items-center justify-between'>
				<h3 className='font-semibold text-xl'>
					{totalPlace} {pluralize("Place", totalPlace)}
				</h3>
				<Button
					color='primary'
					radius='sm'
					href={DASHBOARD_PATHS.places.new}
					className='font-semibold'
					startContent={<PlusIcon size={20} className='text-white' />}
				>
					Add new place
				</Button>
			</HStack>
			<div className='mt-3 border rounded-lg p-4'>
				<PlaceTableFilters categories={categories} />
				<PlaceTable places={places} />
				{meta?.totalPages > 1 && (
					<HStack className='justify-center mt-2'>
						<Pagination
							total={meta?.totalPages}
							initialPage={1}
							variant='bordered'
							showControls
							onChange={(page) => add("page", page.toString())}
						/>
					</HStack>
				)}
			</div>
		</>
	);
}
