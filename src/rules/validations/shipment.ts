import { z } from "zod";

export const updateShipmentHistorySchema = z.object({
  status: z.string(),
  reason: z.string().optional(),
  photo: z.any().optional(),
});

export const assignRiderSchema = z.object({
  riderId: z.string(),
});

export type AssignRiderField = z.infer<typeof assignRiderSchema>;

export type UpdateShipmentHistoryField = z.infer<
  typeof updateShipmentHistorySchema
>;
