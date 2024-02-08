import { z } from "zod";
import { File } from "./place";

export const createCategorySchema = z.object({
	name: z.string({ required_error: "Category name is required" }).min(1),
	picture: z.any(),
});

export type CreateCategoryFields = z.infer<typeof createCategorySchema>;

export const UpdateCategorySchema = createCategorySchema.partial({
	picture: true,
});

export type UpdateCategoryField = z.infer<typeof UpdateCategorySchema>;

export const createProductCategorySchema = z.object({
	name: z.string({ required_error: "Category name is required" }).min(1),
});

export type CreateProductCategoryDto = z.infer<
	typeof createProductCategorySchema
>;
