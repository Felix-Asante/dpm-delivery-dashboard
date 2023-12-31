export interface CreateOfferTypeDto {
	name: string;
}
export interface CreateOfferDto {
	reductionPercent: number;
	price: number;
	start_date: string;
	end_date: string;
	offerType: string;
	productId: string;
	placeId: string;
	title?: string;
	description?: string;
}
