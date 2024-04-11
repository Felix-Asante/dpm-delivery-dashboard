import { z } from "zod";

export const createVariableSchema = z.object({
	label: z.string({ required_error: "variable name is required" }),
	value: z.string({ required_error: "variable value is required" }),
});

export type CreateVariableDto = z.infer<typeof createVariableSchema>;
