"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextField from "@/components/shared/input/TextField";
import { updatePayoutRequestStatus } from "@/actions/wallet";
import {
  PayoutRequest,
  PayoutRequestStatus,
  UpdatePayoutRequestStatusDto,
} from "@/types/payout";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface UpdateStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payoutRequest: PayoutRequest | null;
  onSuccess?: () => void;
}

export function UpdateStatusModal({
  open,
  onOpenChange,
  payoutRequest,
  onSuccess,
}: UpdateStatusModalProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, watch, setValue, reset } =
    useForm<UpdatePayoutRequestStatusDto>({
      defaultValues: {
        status: PayoutRequestStatus.APPROVED,
      },
    });

  const selectedStatus = watch("status");

  const onSubmit = async (data: UpdatePayoutRequestStatusDto) => {
    if (!payoutRequest) return;

    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updatePayoutRequestStatus(payoutRequest.id, data);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          reset();
          setSuccess(false);
          onOpenChange(false);
          onSuccess?.();
        }, 2000);
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
      reset();
      setError(null);
      setSuccess(false);
      onOpenChange(false);
    }
  };

  if (!payoutRequest) return null;

  const getStatusColor = (status: PayoutRequestStatus) => {
    switch (status) {
      case PayoutRequestStatus.APPROVED:
        return "text-green-600";
      case PayoutRequestStatus.REJECTED:
        return "text-red-600";
      case PayoutRequestStatus.PROCESSING:
        return "text-blue-600";
      case PayoutRequestStatus.COMPLETED:
        return "text-green-700";
      case PayoutRequestStatus.FAILED:
        return "text-red-700";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Payout Request Status</DialogTitle>
          <DialogDescription>
            Update the status of payout request{" "}
            <span className="font-mono text-xs">{payoutRequest.reference}</span>
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <p className="text-lg font-semibold text-green-600">
              Status updated successfully!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Request Details */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Rider:</span>
                <span className="text-sm font-medium">
                  {payoutRequest.rider.fullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Amount:</span>
                <span className="text-sm font-semibold">
                  GH₵ {parseFloat(payoutRequest.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Current Status:</span>
                <span
                  className={`text-sm font-medium capitalize ${getStatusColor(
                    payoutRequest.status
                  )}`}
                >
                  {payoutRequest.status}
                </span>
              </div>
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status *</label>
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setValue("status", value as PayoutRequestStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PayoutRequestStatus.APPROVED}>
                    Approved
                  </SelectItem>
                  <SelectItem value={PayoutRequestStatus.PROCESSING}>
                    Processing
                  </SelectItem>
                  <SelectItem value={PayoutRequestStatus.COMPLETED}>
                    Completed
                  </SelectItem>
                  <SelectItem value={PayoutRequestStatus.REJECTED}>
                    Rejected
                  </SelectItem>
                  <SelectItem value={PayoutRequestStatus.FAILED}>
                    Failed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional Fields */}
            {selectedStatus === PayoutRequestStatus.REJECTED && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Rejection Reason *
                </label>
                <TextField
                  placeholder="Enter reason for rejection"
                  name="rejectionReason"
                  control={control}
                />
              </div>
            )}

            {selectedStatus === PayoutRequestStatus.FAILED && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Failure Reason *</label>
                <TextField
                  placeholder="Enter reason for failure"
                  name="failureReason"
                  control={control}
                />
              </div>
            )}

            {(selectedStatus === PayoutRequestStatus.COMPLETED ||
              selectedStatus === PayoutRequestStatus.PROCESSING) && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Transaction ID (Optional)
                  </label>
                  <TextField
                    placeholder="e.g., TXN123456"
                    name="transactionId"
                    control={control}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    External Reference (Optional)
                  </label>
                  <TextField
                    placeholder="e.g., REF789"
                    name="externalReference"
                    control={control}
                  />
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Internal Notes (Optional)
              </label>
              <TextField
                placeholder="Add any internal notes"
                name="notes"
                control={control}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
