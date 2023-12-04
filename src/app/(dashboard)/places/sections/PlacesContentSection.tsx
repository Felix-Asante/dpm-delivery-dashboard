"use client";
import HStack from "@/components/shared/layout/HStack";
import { DASHBOARD_PATHS } from "@/config/routes";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import React from "react";
import PlaceTableFilters from "./PlaceTableFilters";
import PlaceTable from "./PlaceTable";
import { Place } from "@/types/place";

export default function PlacesContentSection({ places }: { places: Place[] }) {
	return (
		<>
			<HStack className='items-center justify-between'>
				<h3 className='font-semibold text-xl'>100 Places</h3>
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
				<PlaceTableFilters />
				<PlaceTable places={places} />
			</div>
		</>
	);
}
