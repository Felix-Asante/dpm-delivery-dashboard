import { z } from "zod";

export const AddDeliveryCostSchema = z
  .object({
    pickupCost: z.coerce.number({
      required_error: "Pickup cost is required",
      invalid_type_error: "Pickup cost must be a number",
    }),
    deliveryCost: z.coerce.number({
      required_error: "Delivery cost is required",
      invalid_type_error: "Delivery cost must be a number",
    }),
    riderCommission: z.coerce
      .number({
        required_error: "Rider commission is required",
        invalid_type_error: "Rider commission must be a number",
      })
      .max(100, "Rider commission must be less or equal to 100"),
    repackagingFee: z.coerce
      .number({ invalid_type_error: "Repackaging fee must be a number" })
      .optional(),
    paid: z.boolean().optional(),
    includeRepackagingFee: z.boolean().optional(),
    paidAt: z
      .date({
        required_error: "Paid at is required",
        invalid_type_error: "Paid at must be a date",
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paid && !data.paidAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Paid at is required",
        path: ["paidAt"],
      });
    }

    if (data.includeRepackagingFee && !data.repackagingFee) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Repackaging fee is required",
        path: ["repackagingFee"],
      });
    }
  });

export type AddDeliveryCostInput = z.infer<typeof AddDeliveryCostSchema>;
