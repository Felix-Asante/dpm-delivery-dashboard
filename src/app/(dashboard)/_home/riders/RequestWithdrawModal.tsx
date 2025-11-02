"use client";

import React, { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { createPayoutRequest } from "@/actions/wallet";
import { PayoutMethod } from "@/types/payout";
import {
  payoutRequestSchema,
  PayoutRequestFormData,
} from "@/rules/validations/payout";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { formatCurrency } from "@/utils/helpers";
import { Wallet, Loader2, CheckCircle2 } from "lucide-react";

interface RequestWithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number;
}

export function RequestWithdrawModal({
  open,
  onOpenChange,
  balance,
}: RequestWithdrawModalProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PayoutRequestFormData>({
    resolver: zodResolver(
      payoutRequestSchema.refine((data) => data.amount <= balance, {
        message: `Amount cannot exceed ${
          DEFAULT_CURRENCY.symbol
        }${formatCurrency(balance)}`,
        path: ["amount"],
      })
    ),
    defaultValues: {
      amount: 0,
      payoutMethod: PayoutMethod.MOBILE_MONEY,
    },
  });

  const payoutMethod = watch("payoutMethod");
  const amount = watch("amount");

  const onSubmit = async (data: PayoutRequestFormData) => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await createPayoutRequest(data);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          reset();
          setSuccess(false);
          onOpenChange(false);
          window.location.reload(); // Refresh to update balance
        }, 2000);
      }
    });
  };

  const handleWithdrawAll = () => {
    setValue("amount", balance);
  };

  const handleClose = () => {
    if (!isPending) {
      reset();
      setError(null);
      setSuccess(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Request Withdrawal
          </DialogTitle>
          <DialogDescription>
            Request to withdraw funds from your wallet balance
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <p className="text-lg font-semibold text-green-600">
              Withdrawal request submitted successfully!
            </p>
            <p className="text-sm text-gray-500">
              Your request will be processed shortly
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold">
                {DEFAULT_CURRENCY.symbol} {formatCurrency(balance)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Amount *</label>
              <div className="flex gap-2">
                <div className="w-[90%]">
                  <TextField
                    type="number"
                    placeholder="Enter amount"
                    name="amount"
                    control={control}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleWithdrawAll}
                  disabled={isPending}
                  className="mt-1"
                >
                  All
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payout Method *</label>
              <Select
                value={payoutMethod}
                onValueChange={(value) =>
                  setValue("payoutMethod", value as PayoutMethod)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payout method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PayoutMethod.MOBILE_MONEY}>
                    Mobile Money
                  </SelectItem>
                  <SelectItem value={PayoutMethod.BANK_TRANSFER}>
                    Bank Transfer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {payoutMethod === PayoutMethod.MOBILE_MONEY && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Mobile Money Provider *
                  </label>
                  <Select
                    value={watch("mobileMoneyProvider") || ""}
                    onValueChange={(value) => setValue("mobileMoneyProvider", value)}
                  >
                    <SelectTrigger className={errors.mobileMoneyProvider ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MOMO">MTN Mobile Money</SelectItem>
                      <SelectItem value="AIRTELTIGO">AirtelTigo Money</SelectItem>
                      <SelectItem value="TELECEL">Telecel Cash</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.mobileMoneyProvider && (
                    <p className="text-xs text-red-500">
                      {errors.mobileMoneyProvider.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Mobile Money Number *
                  </label>
                  <TextField
                    placeholder="e.g., 0241234567"
                    name="mobileMoneyNumber"
                    control={control}
                  />
                </div>
              </div>
            )}

            {payoutMethod === PayoutMethod.BANK_TRANSFER && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Account Number *
                  </label>
                  <TextField
                    placeholder="Enter account number"
                    name="accountNumber"
                    control={control}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Name *</label>
                  <TextField
                    placeholder="Enter account name"
                    name="accountName"
                    control={control}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Name *</label>
                  <TextField
                    placeholder="e.g., Standard Bank"
                    name="bankName"
                    control={control}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Bank Code (Optional)
                  </label>
                  <TextField
                    placeholder="e.g., 001"
                    name="bankCode"
                    control={control}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <TextField
                placeholder="Add any additional notes"
                name="notes"
                control={control}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
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
              <Button
                type="submit"
                disabled={isPending || amount <= 0 || amount > balance}
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
