"use client";
import { Place } from "@/types/place";
import { Tab, Tabs } from "@nextui-org/react";
import React from "react";
import ProductCategoriesSection from "./ProductCategoriesSection";

interface Props {
	place: Place;
}
export default function PlaceContent({ place }: Props) {
	return (
		<div className='px-4 py-5'>
			<div className='w-full'>
				<Tabs
					size={"md"}
					aria-label='place nav tabs'
					className='w-full min-w-full'
				>
					<Tab key='productCategory' title='Product Category'>
						<ProductCategoriesSection
							placeId={place?.id}
							categories={place?.productCategory}
						/>
					</Tab>
					<Tab key='products' title='Products (Services/Menu)'>
						<div>Menu</div>
					</Tab>
					<Tab key='bookings' title='Bookings'>
						<div>Bookings</div>
					</Tab>
					<Tab key='Reviews' title='Reviews'>
						<div>Reviews</div>
					</Tab>
				</Tabs>
			</div>
		</div>
	);
}
