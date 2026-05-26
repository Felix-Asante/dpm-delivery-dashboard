"use client";

import HStack from "@/components/shared/layout/HStack";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  COMPLAINT_CATEGORY_LABEL,
  COMPLAINT_STATUS_LABEL,
  COMPLAINT_STATUS_VARIANTS,
  Complaint,
  ComplaintStatus,
} from "@/types/complaint";
import { Chip } from "@heroui/chip";
import { ExternalLink, Info, MessageCircle, Package, User } from "lucide-react";
import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  isLoading: boolean;
  error?: string | null;
  selectedStatus: ComplaintStatus;
  statusOptions: { value: ComplaintStatus; label: string }[];
  onStatusChange: (value: ComplaintStatus) => void;
  comment: string;
  onCommentChange: (value: string) => void;
  onUpdateStatus: () => Promise<void>;
  isUpdating: boolean;
  updateError: string | null;
}

export default function ComplaintDetailsSheet({
  open,
  onClose,
  complaint,
  isLoading,
  error,
  selectedStatus,
  statusOptions,
  onStatusChange,
  comment,
  onCommentChange,
  onUpdateStatus,
  isUpdating,
  updateError,
}: Props) {
  const formattedDate = complaint
    ? new Date(complaint.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        size="lg"
        className="shadow-none border-l border-gray-200 sm:w-[45%] flex h-full flex-col"
      >
        <SheetHeader className="px-6 pb-4 border-b border-gray-200">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Complaint detail
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {complaint?.trackingNumber ?? "—"}
                </h2>
                <p className="text-sm text-slate-500">
                  Submitted {formattedDate}
                </p>
              </div>
              <div
                className={
                  "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium " +
                  (complaint
                    ? COMPLAINT_STATUS_VARIANTS[complaint.status]
                    : "bg-slate-100 text-slate-700")
                }
              >
                {complaint
                  ? COMPLAINT_STATUS_LABEL[complaint.status]
                  : "Loading"}
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-6 px-6 py-5 overflow-y-auto">
          {error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {isLoading ? (
            <div className="space-y-3">
              <div className="h-5 w-2/5 rounded-md bg-gray-100" />
              <div className="h-80 rounded-md bg-gray-100" />
              <div className="h-5 w-3/4 rounded-md bg-gray-100" />
            </div>
          ) : complaint ? (
            <div className="space-y-6">
              <section className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                  <HStack className="items-center gap-3">
                    <User className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">
                      Reporter
                    </span>
                  </HStack>
                  <p className="mt-3 text-sm text-slate-900 font-semibold">
                    {complaint.fullName}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {complaint.phone}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                  <HStack className="items-center gap-3">
                    <Package className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">
                      Order reference
                    </span>
                  </HStack>
                  <p className="mt-3 text-sm text-slate-900 font-semibold">
                    {complaint.order?.reference ?? "—"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {complaint.order?.pickupCity ?? ""}
                    {complaint.order?.pickupCity && complaint.order?.dropOffCity
                      ? " • "
                      : ""}
                    {complaint.order?.dropOffCity ?? ""}
                  </p>
                </div>
              </section>

              <section className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Category
                      </p>
                      <p className="mt-2 text-sm text-slate-900 font-semibold">
                        {COMPLAINT_CATEGORY_LABEL[complaint.category]}
                      </p>
                    </div>
                    <Chip
                      size="sm"
                      variant="flat"
                      className="text-xs uppercase"
                    >
                      {COMPLAINT_CATEGORY_LABEL[complaint.category]}
                    </Chip>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Current status
                      </p>
                      <p className="mt-2 text-sm text-slate-900 font-semibold">
                        {COMPLAINT_STATUS_LABEL[complaint.status]}
                      </p>
                    </div>
                    <div
                      className={
                        "rounded-full px-3 py-1 text-xs font-semibold " +
                        COMPLAINT_STATUS_VARIANTS[complaint.status]
                      }
                    >
                      {COMPLAINT_STATUS_LABEL[complaint.status]}
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="rounded-2xl border border-gray-200 p-4">
                  <HStack className="items-center gap-3">
                    <Info className="h-4 w-4 text-slate-500" />
                    <p className="text-sm font-medium text-slate-700">Issue</p>
                  </HStack>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {complaint.issue}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200 overflow-hidden">
                  {complaint.picture ? (
                    <img
                      src={complaint.picture}
                      alt="Complaint evidence"
                      className="h-64 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-slate-50 p-4 text-sm text-slate-500">
                      No photo attached for this complaint.
                    </div>
                  )}
                  {complaint.picture ? (
                    <div className="border-t border-gray-200 bg-white p-3 text-sm text-slate-600">
                      <a
                        href={complaint.picture}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open full image
                      </a>
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Complaint history
                    </h3>
                    <p className="text-sm text-slate-500">
                      Status changes and admin notes.
                    </p>
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {complaint.statusHistory?.length ?? 0} updates
                  </div>
                </div>
                <div className="space-y-3">
                  {complaint.statusHistory?.length ? (
                    complaint.statusHistory
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime(),
                      )
                      .map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-2xl border border-gray-200 bg-slate-50 p-4"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {COMPLAINT_STATUS_LABEL[entry.newStatus]}
                              </p>
                              <p className="text-xs text-slate-500">
                                From {COMPLAINT_STATUS_LABEL[entry.oldStatus]}
                              </p>
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(entry.createdAt).toLocaleString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                },
                              )}
                            </div>
                          </div>
                          {entry.comment ? (
                            <p className="mt-3 text-sm text-slate-700">
                              {entry.comment}
                            </p>
                          ) : null}
                          {entry.updatedBy ? (
                            <p className="mt-3 text-xs text-slate-500">
                              Updated by {entry.updatedBy.fullName}
                            </p>
                          ) : null}
                        </div>
                      ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-4 text-sm text-slate-500">
                      No status updates yet.
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-4 rounded-2xl border border-gray-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MessageCircle className="h-4 w-4 text-slate-500" />
                  Update complaint status
                </div>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="status-select"
                      className="text-sm text-slate-600"
                    >
                      New status
                    </label>
                    <select
                      id="status-select"
                      value={selectedStatus}
                      onChange={(event) =>
                        onStatusChange(event.target.value as ComplaintStatus)
                      }
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="status-comment"
                      className="text-sm text-slate-600"
                    >
                      Note (optional)
                    </label>
                    <textarea
                      id="status-comment"
                      value={comment}
                      onChange={(event) => onCommentChange(event.target.value)}
                      rows={4}
                      className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900"
                      placeholder="Add context for this update"
                    />
                  </div>
                </div>
                {updateError ? (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                    {updateError}
                  </div>
                ) : null}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full sm:w-auto"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={onUpdateStatus}
                    disabled={isUpdating || selectedStatus === complaint.status}
                    className="w-full sm:w-auto"
                  >
                    {isUpdating ? "Saving…" : "Save status"}
                  </Button>
                </div>
              </section>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-slate-50 p-6 text-sm text-slate-500">
              Select a complaint to view details.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
