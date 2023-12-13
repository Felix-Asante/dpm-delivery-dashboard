import * as z from "zod";

const File = z.object({
	name: z.string(),
	size: z.number(),
	type: z.string(),
	path: z.string(),
	lastModified: z.number(),
	lastModifiedDate: z.date(),
	webkitRelativePath: z.string(),
});

export const createPlaceSchema = z.object({
	name: z.string(),
	category: z.string(),
	phone: z.string(),
	email: z.string().email(),
	address: z.string(),
	longitude: z.string(),
	latitude: z.string(),
	website: z.string().url(),
	averagePrice: z.string().transform((val) => +val),
	deliveryFee: z
		.string()
		.optional()
		.transform((val) => (val ? +val : 0)),
	min_prep_time: z
		.string()
		.optional()
		.transform((val) => (val ? +val : 0)),
	max_prep_time: z
		.string()
		.optional()
		.transform((val) => (val ? +val : 0)),
	fullName: z.string(),
	admin_phone: z.string(),
	password: z.string(),
	logo: z.any(),
	mainImage: z.any(),
});

export type CreatePlaceField = z.infer<typeof createPlaceSchema>;
