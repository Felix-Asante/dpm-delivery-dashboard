"use client";
import { Place } from "@/types/place";
import { Tab, Tabs } from "@nextui-org/react";
import React from "react";
import ProductCategoriesSection from "./ProductCategoriesSection";
import PlaceServices from "./PlaceServices";
import PlaceBookings from "./PlaceBookings";
import PlaceReviews from "./PlaceReviews";

interface Props {
	place: Place;
}
export default function PlaceContent({ place }: Props) {
	return (
		<div className=' pb-5'>
			<div className='w-full'>
				<Tabs
					size={"lg"}
					aria-label='place nav tabs'
					className='w-full min-w-full bg-gray-300'
					variant='underlined'
				>
					<Tab className='p-4' key='productCategory' title='Product Category'>
						<ProductCategoriesSection
							placeId={place?.id}
							categories={place?.productCategory}
						/>
					</Tab>
					<Tab className='p-4' key='products' title='Products (Services/Menu)'>
						<PlaceServices place={place} />
					</Tab>
					<Tab className='p-4' key='bookings' title='Bookings'>
						<PlaceBookings place={place} />
					</Tab>
					<Tab className='p-4' key='Reviews' title='Reviews'>
						<PlaceReviews place={place} />
					</Tab>
				</Tabs>
			</div>
		</div>
	);
}
