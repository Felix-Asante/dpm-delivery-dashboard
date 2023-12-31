import { Place, PlaceProducts } from "./place";

export interface Special {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: null;
	reductionPercent: number;
	price: number;
	start_date: string;
	end_date: string;
	place: Place;
	product: PlaceProducts;
	type: SpecialType;
	title?: string;
	description: string;
}

type OfferTypes = "place_offer" | "product_offer";

export interface SpecialType {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: null;
	name: OfferTypes;
}
