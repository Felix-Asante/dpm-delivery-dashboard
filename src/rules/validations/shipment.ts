import { ShipmentStatus } from "@/config/constants";
import { z } from "zod";

export const updateShipmentHistorySchema = z
  .object({
    status: z.string(),
    reason: z.string().optional(),
    confirmationCode: z.string().min(4).max(4).optional(),
    photo: z.any().optional(),
    paid: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.status === ShipmentStatus.FAILED_DELIVERY_ATTEMPT &&
      !data.reason
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Reason is required",
      });
    }

    if (data.status === ShipmentStatus.DELIVERED && !data.confirmationCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Confirmation code is required",
      });
    }
  });

export const assignRiderSchema = z.object({
  riderId: z.string(),
});

export type AssignRiderField = z.infer<typeof assignRiderSchema>;

export type UpdateShipmentHistoryField = z.infer<
  typeof updateShipmentHistorySchema
>;
