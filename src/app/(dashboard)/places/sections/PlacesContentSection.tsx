"use client";
import HStack from "@/components/shared/layout/HStack";
import { DASHBOARD_PATHS } from "@/config/routes";
import { Button, Pagination } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import PlaceTableFilters from "./PlaceTableFilters";
import PlaceTable from "./PlaceTable";
import { Place } from "@/types/place";
import { Category } from "@/types/category";
import { getErrorMessage, pluralize } from "@/utils/helpers";
import { ResponseMeta } from "@/types";
import useQueryParams from "@/hooks/useQueryParam";
import { useServerAction } from "@/hooks/useServerAction";
import { deletePlace } from "@/actions/place";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
	const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(
		new Set([]),
	);
	const { push } = useRouter();

	const [run, { loading }] = useServerAction<any, typeof deletePlace>(
		deletePlace,
	);

	const deleteMorePlaceHandler = async () => {
		let placeIds: string[] = [];
		try {
			if (typeof selectedPlaces === "string") {
				placeIds = places?.map((place) => place.id);
			} else {
				placeIds = [...selectedPlaces];
			}
			if (placeIds.length === 0) {
				toast.error("Make sure you have selected a place");
				return;
			}
			const response = await Promise.all(
				placeIds.map((placeId) => run(placeId)),
			);
			if (response?.some((res) => res?.error)) {
				toast.error("Some places failed to delete");
				return;
			}
			setSelectedPlaces(new Set([]));
			toast.success("Places successfully deleted");
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	return (
		<>
			<HStack className='items-center justify-between'>
				<h3 className='font-semibold text-xl'>
					{totalPlace} {pluralize("Place", totalPlace)}
				</h3>
				<Button
					color='primary'
					radius='sm'
					onClick={() => push(DASHBOARD_PATHS.places.new)}
					className='font-semibold'
					startContent={<PlusIcon size={20} className='text-white' />}
				>
					Add new place
				</Button>
			</HStack>
			<div className='mt-3 border rounded-lg p-4'>
				<PlaceTableFilters
					categories={categories}
					disableDelete={selectedPlaces.size <= 0}
					deleting={loading}
					onDelete={deleteMorePlaceHandler}
				/>
				<PlaceTable
					places={places}
					selectedKeys={selectedPlaces}
					onSelectionChange={setSelectedPlaces}
				/>
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
