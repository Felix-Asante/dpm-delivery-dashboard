"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { PayoutRequest, PayoutRequestStatus } from "@/types/payout";
import {
  updatePayoutStatusSchema,
  UpdatePayoutStatusFormData,
} from "@/rules/validations/update-payout-status";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface UpdateStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payoutRequest: PayoutRequest | null;
  onSuccess?: () => void;
}

function getAvailableStatuses(status: PayoutRequestStatus) {
  if (status === PayoutRequestStatus.PENDING) {
    return [PayoutRequestStatus.APPROVED, PayoutRequestStatus.REJECTED];
  }
  if (status === PayoutRequestStatus.APPROVED) {
    return [PayoutRequestStatus.COMPLETED, PayoutRequestStatus.FAILED];
  }
  if (status === PayoutRequestStatus.FAILED) {
    return [PayoutRequestStatus.APPROVED];
  }
  return [];
}

export function UpdateStatusModal({
  open,
  onOpenChange,
  payoutRequest,
  onSuccess,
}: Readonly<UpdateStatusModalProps>) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdatePayoutStatusFormData>({
    resolver: zodResolver(updatePayoutStatusSchema),
    defaultValues: {
      status: payoutRequest?.status,
    },
  });

  const selectedStatus = watch("status");

  useEffect(() => {
    if (open && payoutRequest) {
      reset({
        status: undefined,
        rejectionReason: "",
        failureReason: "",
        notes: "",
        externalReference: "",
        transactionId: "",
      });
      setError(null);
    }
  }, [open, payoutRequest, reset]);

  const onSubmit = async (data: UpdatePayoutStatusFormData) => {
    if (!payoutRequest) return;

    setError(null);
    startTransition(async () => {
      const result = await updatePayoutRequestStatus(payoutRequest.id, data);

      if (result.error) {
        setError(result.error);
      } else {
        toast.success("Payout request updated");
        reset();
        onOpenChange(false);
        onSuccess?.();
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
      reset();
      setError(null);
      onOpenChange(false);
    }
  };

  if (!payoutRequest) return null;

  const availableStatuses = getAvailableStatuses(payoutRequest.status);

  const canUpdate = availableStatuses.length > 0;
  const actionLabel = selectedStatus
    ? `${selectedStatus.charAt(0).toUpperCase()}${selectedStatus.slice(1)} request`
    : "Select an action";

  const getStatusColor = (status: PayoutRequestStatus) => {
    switch (status) {
      case PayoutRequestStatus.APPROVED:
        return "text-green-600";
      case PayoutRequestStatus.REJECTED:
        return "text-red-600";
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
      <DialogContent className="z-105 max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Review payout request</DialogTitle>
          <DialogDescription>
            Verify the payout details before taking action on{" "}
            <span className="font-mono text-xs">
              {payoutRequest.reference}.
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="rounded-xl border bg-gray-50 p-4">
            <div className="mb-4 flex items-start justify-between gap-4 border-b pb-4">
              <div>
                <p className="text-xs font-medium text-gray-500">Rider</p>
                <p className="mt-1 text-sm font-semibold text-secondary">
                  {payoutRequest.rider.fullName}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {payoutRequest.rider.phone}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500">
                  Requested amount
                </p>
                <p className="mt-1 text-xl font-bold text-secondary">
                  GH₵ {Number.parseFloat(payoutRequest.amount).toFixed(2)}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  Net GH₵{" "}
                  {Number.parseFloat(payoutRequest.netAmount).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Payment method</p>
                <p className="mt-1 text-sm font-medium capitalize text-secondary">
                  {payoutRequest.payoutMethod === "mobile_money"
                    ? "Mobile money"
                    : "Bank transfer"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Current status</p>
                <p
                  className={`mt-1 text-sm font-semibold capitalize ${getStatusColor(
                    payoutRequest.status,
                  )}`}
                >
                  {payoutRequest.status}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              {payoutRequest.payoutMethod === "mobile_money" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Detail
                    label="Provider"
                    value={payoutRequest.mobileMoneyProvider || "—"}
                  />
                  <Detail
                    label="Mobile money number"
                    value={payoutRequest.mobileMoneyNumber || "—"}
                    mono
                  />
                  <div className="sm:col-span-2">
                    <Detail
                      label="Account name"
                      value={payoutRequest.mobileMoneyAccountName || "—"}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Detail label="Bank" value={payoutRequest.bankName || "—"} />
                  <Detail
                    label="Account number"
                    value={payoutRequest.accountNumber || "—"}
                    mono
                  />
                  <div className="sm:col-span-2">
                    <Detail
                      label="Account name"
                      value={payoutRequest.accountName || "—"}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {canUpdate ? (
            <div className="space-y-2">
              <label
                htmlFor="payout-next-action"
                className="text-sm font-medium"
              >
                Next action
              </label>
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setValue("status", value as PayoutRequestStatus)
                }
              >
                <SelectTrigger id="payout-next-action">
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent className="z-105">
                  {availableStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Only valid actions for the current request state are shown.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border bg-gray-50 p-4 text-sm text-gray-600">
              This request is in a final state. Its details remain available for
              review, but no further action can be taken.
            </div>
          )}

          {selectedStatus === PayoutRequestStatus.REJECTED && (
            <div className="space-y-2">
              <label htmlFor="rejectionReason" className="text-sm font-medium">
                Rejection Reason *
              </label>
              <TextField
                id="rejectionReason"
                placeholder="Enter reason for rejection"
                name="rejectionReason"
                control={control}
              />
              {errors.rejectionReason && (
                <p className="text-xs text-red-500">
                  {errors.rejectionReason.message}
                </p>
              )}
            </div>
          )}

          {selectedStatus === PayoutRequestStatus.FAILED && (
            <div className="space-y-2">
              <label htmlFor="failureReason" className="text-sm font-medium">
                Failure Reason *
              </label>
              <TextField
                id="failureReason"
                placeholder="Enter reason for failure"
                name="failureReason"
                control={control}
              />
              {errors.failureReason && (
                <p className="text-xs text-red-500">
                  {errors.failureReason.message}
                </p>
              )}
            </div>
          )}

          {selectedStatus === PayoutRequestStatus.COMPLETED && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="transactionId" className="text-sm font-medium">
                  Transaction ID *
                </label>
                <TextField
                  id="transactionId"
                  placeholder="e.g., TXN123456"
                  name="transactionId"
                  control={control}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="externalReference"
                  className="text-sm font-medium"
                >
                  External Reference (Optional)
                </label>
                <TextField
                  id="externalReference"
                  placeholder="e.g., REF789"
                  name="externalReference"
                  control={control}
                />
              </div>
            </div>
          )}

          {canUpdate ? (
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Internal notes (optional)
              </label>
              <TextField
                id="notes"
                placeholder="Add context for the operations team"
                name="notes"
                control={control}
              />
            </div>
          ) : null}

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
              {canUpdate ? "Cancel" : "Close"}
            </Button>
            {canUpdate ? (
              <Button
                type="submit"
                disabled={isPending || !selectedStatus}
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  actionLabel
                )}
              </Button>
            ) : null}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Detail({
  label,
  value,
  mono = false,
}: Readonly<{ label: string; value: string; mono?: boolean }>) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`mt-1 wrap-break-word text-sm font-medium text-secondary ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
