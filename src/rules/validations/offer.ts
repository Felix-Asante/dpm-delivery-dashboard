import * as z from "zod";

export const createOfferSchema = z.object({
	title: z.string({ required_error: "Offer title is required" }),
	placeId: z.string().optional(),
	offerType: z.string({ required_error: "Offer type is required" }),
	start_date: z.date(),
	end_date: z.date(),
	price: z
		.string({ required_error: "Price is required" })
		.transform((value) => Number(value)),
	reductionPercent: z.string().transform((value) => Number(value)),
	description: z.string().optional(),
});

export const updateOfferSchema = createOfferSchema.partial();
