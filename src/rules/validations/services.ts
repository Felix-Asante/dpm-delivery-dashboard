import { z } from "zod";

export const createServiceSchema = z.object({
	description: z.string().optional(),
	photo: z.any().optional(),
	productCategory: z.string({
		required_error: "product category is required",
	}),
	name: z.string(),
	price: z.string(),
});

export type CreateServiceDto = z.infer<typeof createServiceSchema>;
