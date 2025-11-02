import { z } from "zod";
import { PayoutRequestStatus } from "@/types/payout";

export const updatePayoutStatusSchema = z
  .object({
    status: z.nativeEnum(PayoutRequestStatus, {
      required_error: "Status is required",
    }),
    rejectionReason: z.string().optional(),
    failureReason: z.string().optional(),
    notes: z.string().optional(),
    externalReference: z.string().optional(),
    transactionId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate rejection reason when status is rejected
    if (data.status === PayoutRequestStatus.REJECTED) {
      if (!data.rejectionReason || data.rejectionReason.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Rejection reason is required when rejecting a request",
          path: ["rejectionReason"],
        });
      }
    }

    // Validate failure reason when status is failed
    if (data.status === PayoutRequestStatus.FAILED) {
      if (!data.failureReason || data.failureReason.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Failure reason is required when marking as failed",
          path: ["failureReason"],
        });
      }
    }

    // Validate external reference when status is completed
    if (data.status === PayoutRequestStatus.COMPLETED && !data.transactionId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Transaction ID is required",
        path: ["transactionId"],
      });
    }
  });

export type UpdatePayoutStatusFormData = z.infer<
  typeof updatePayoutStatusSchema
>;
