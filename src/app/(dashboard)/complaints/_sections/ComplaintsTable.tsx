"use client";

import type { GetComplaintsForAdminResponse } from "@/actions/complaints";
import EmptyContent from "@/components/shared/EmptyContent";
import HStack from "@/components/shared/layout/HStack";
import { Button } from "@/components/ui/button";
import ComplaintDetailsSheet from "./ComplaintDetailsSheet";
import { useServerAction } from "@/hooks/useServerAction";
import {
  COMPLAINT_CATEGORY_LABEL,
  COMPLAINT_STATUS_FILTER_OPTIONS,
  COMPLAINT_STATUS_LABEL,
  COMPLAINT_STATUS_OPTIONS,
  COMPLAINT_STATUS_VARIANTS,
  Complaint,
  ComplaintCategory,
  ComplaintStatus,
} from "@/types/complaint";
import {
  getComplaintDetail,
  updateComplaintStatus,
} from "@/actions/complaints";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Filter, Eye } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const columns = [
  { key: "date", label: "Submitted" },
  { key: "reporter", label: "Reporter" },
  { key: "tracking", label: "Tracking" },
  { key: "category", label: "Category" },
  { key: "issue", label: "Issue" },
  { key: "order", label: "Order" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

const categoryOptions: { value: string; label: string }[] = [
  { value: "all", label: "All categories" },
  ...Object.values(ComplaintCategory).map((c) => ({
    value: c,
    label: COMPLAINT_CATEGORY_LABEL[c],
  })),
];

interface Props {
  data?: GetComplaintsForAdminResponse;
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

function statusLabel(status: ComplaintStatus) {
  return COMPLAINT_STATUS_LABEL[status] ?? status;
}

function statusClass(status: ComplaintStatus) {
  return COMPLAINT_STATUS_VARIANTS[status] ?? "bg-slate-100 text-slate-700";
}

export default function ComplaintsTable({ data }: Readonly<Props>) {
  const { items: complaints = [], meta } = data || {};

  const [filters, setFilters] = useQueryStates(
    {
      page: parseAsString,
      query: parseAsString,
      category: parseAsString,
      status: parseAsString,
      from: parseAsString,
      to: parseAsString,
    },
    { shallow: false },
  );

  const [searchDraft, setSearchDraft] = useState(() => filters.query ?? "");
  const [categoryDraft, setCategoryDraft] = useState(
    () => filters.category || "all",
  );
  const [statusDraft, setStatusDraft] = useState(() => filters.status || "all");
  const [fromDraft, setFromDraft] = useState(() => filters.from ?? "");
  const [toDraft, setToDraft] = useState(() => filters.to ?? "");
  const [dateHint, setDateHint] = useState<string | null>(null);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null,
  );
  const [complaintDetail, setComplaintDetail] = useState<Complaint | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(
    ComplaintStatus.OPEN,
  );
  const [statusComment, setStatusComment] = useState("");
  const [localStatus, setLocalStatus] = useState<
    Record<string, ComplaintStatus>
  >({});
  const [loadComplaintDetail] = useServerAction(getComplaintDetail);
  const [submitComplaintStatus] = useServerAction(updateComplaintStatus);

  useEffect(() => {
    setSearchDraft(filters.query ?? "");
    setCategoryDraft(filters.category || "all");
    setStatusDraft(filters.status || "all");
    setFromDraft(filters.from ?? "");
    setToDraft(filters.to ?? "");
  }, [
    filters.query,
    filters.category,
    filters.status,
    filters.from,
    filters.to,
  ]);

  const onApplyFilters = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((fromDraft && !toDraft) || (toDraft && !fromDraft)) {
      setDateHint("Select both a start and end date to filter by period.");
      return;
    }
    setDateHint(null);
    setFilters({
      ...filters,
      query: searchDraft.trim() || null,
      category: categoryDraft === "all" ? null : categoryDraft,
      status: statusDraft === "all" ? null : statusDraft,
      from: fromDraft || null,
      to: toDraft || null,
      page: "1",
    });
  };

  const onClearFilters = () => {
    setSearchDraft("");
    setCategoryDraft("all");
    setStatusDraft("all");
    setFromDraft("");
    setToDraft("");
    setDateHint(null);
    setFilters({
      page: null,
      query: null,
      category: null,
      status: null,
      from: null,
      to: null,
    });
  };

  const getStatusForRow = (row: Complaint) => localStatus[row.id] ?? row.status;

  const openComplaint = async (row: Complaint) => {
    setSelectedComplaint(row);
    setComplaintDetail(null);
    setDetailError(null);
    setSelectedStatus(getStatusForRow(row));
    setStatusComment("");
    setStatusUpdateError(null);
    setDetailLoading(true);
    setIsSheetOpen(true);

    try {
      const result = await loadComplaintDetail(row.id);
      if (result.error) {
        throw new Error(result.error);
      }
      setComplaintDetail(result.results ?? null);
    } catch (error) {
      setDetailError(
        error instanceof Error
          ? error.message
          : "Unable to load complaint details.",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setSelectedComplaint(null);
    setComplaintDetail(null);
    setDetailError(null);
    setStatusUpdateError(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) {
      return;
    }
    setStatusUpdateError(null);
    setStatusUpdateLoading(true);

    try {
      const result = await submitComplaintStatus(selectedComplaint.id, {
        status: selectedStatus,
        comment: statusComment || undefined,
      });
      if (result.error) {
        throw new Error(result.error);
      }
      const updatedComplaint = result.results;
      if (!updatedComplaint) {
        throw new Error("Unable to update complaint status.");
      }
      setComplaintDetail(updatedComplaint);
      setLocalStatus((prev) => ({
        ...prev,
        [updatedComplaint.id]: updatedComplaint.status,
      }));
      setSelectedStatus(updatedComplaint.status);
      setStatusComment("");
    } catch (error) {
      setStatusUpdateError(
        error instanceof Error ? error.message : "Unable to update status.",
      );
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      {meta && (
        <div className="mb-6 grid gap-3 rounded-2xl border border-gray-100 bg-slate-50 p-4 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm text-slate-500">Total complaints</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">
              {meta.totalItems}
            </p>
          </div>
        </div>
      )}

      <form
        className="flex flex-col gap-4 mb-4"
        onSubmit={onApplyFilters}
        noValidate
      >
        <div className="grid gap-3 md:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_minmax(220px,1fr)_minmax(180px,1fr)]">
          <div>
            <label
              htmlFor="complaints-category"
              className="text-xs text-slate-500 mb-1 block"
            >
              Category
            </label>
            <select
              id="complaints-category"
              className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-slate-900"
              value={categoryDraft}
              onChange={(e) => setCategoryDraft(e.target.value)}
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="complaints-status"
              className="text-xs text-slate-500 mb-1 block"
            >
              Status
            </label>
            <select
              id="complaints-status"
              className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-slate-900"
              value={statusDraft}
              onChange={(e) => setStatusDraft(e.target.value)}
            >
              {COMPLAINT_STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="complaints-search"
              className="text-xs text-slate-500 mb-1 block"
            >
              Search
            </label>
            <Input
              id="complaints-search"
              size="sm"
              radius="sm"
              placeholder="Name, phone, tracking, issue…"
              value={searchDraft}
              onValueChange={setSearchDraft}
              className="w-full"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="complaints-from"
                className="text-xs text-slate-500 mb-1 block"
              >
                From
              </label>
              <input
                id="complaints-from"
                type="date"
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-slate-900"
                value={fromDraft}
                onChange={(e) => setFromDraft(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="complaints-to"
                className="text-xs text-slate-500 mb-1 block"
              >
                To
              </label>
              <input
                id="complaints-to"
                type="date"
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-slate-900"
                value={toDraft}
                onChange={(e) => setToDraft(e.target.value)}
              />
            </div>
          </div>
        </div>

        <HStack className="flex-wrap gap-2 items-center">
          <Button type="submit" className="gap-2">
            <Filter className="h-4 w-4" />
            Apply filters
          </Button>
          <Button type="button" variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        </HStack>
        {dateHint ? <p className="text-sm text-amber-700">{dateHint}</p> : null}
      </form>

      {complaints.length > 0 ? (
        <p className="text-sm text-slate-600 mb-3">
          Showing {complaints.length} of {meta?.totalItems ?? 0} complaints
        </p>
      ) : null}

      <Table aria-label="Complaints table" shadow="none" radius="sm">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className="bg-gray-50 text-xs font-medium text-slate-500"
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={
            <EmptyContent
              title="No complaints"
              description="Complaints from customers will appear here."
            />
          }
        >
          {complaints.map((row: Complaint) => {
            const rowStatus = getStatusForRow(row);
            return (
              <TableRow key={row.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-900">
                      {new Date(row.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(row.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-900">{row.fullName}</p>
                    <p className="text-xs text-slate-500">{row.phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-slate-700 font-mono text-xs">
                    {row.trackingNumber}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" className="text-xs uppercase">
                    {COMPLAINT_CATEGORY_LABEL[row.category] ?? row.category}
                  </Chip>
                </TableCell>
                <TableCell>
                  <p
                    className="text-sm text-slate-700 line-clamp-2 max-w-[min(100%,260px)]"
                    title={row.issue}
                  >
                    {truncate(row.issue, 90)}
                  </p>
                </TableCell>
                <TableCell>
                  {row.order?.id ? (
                    <Link
                      href={`/deliveries/${row.order.id}`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      {row.order.reference}
                    </Link>
                  ) : (
                    <span className="text-slate-400 text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      "inline-flex rounded-full px-3 py-1 text-xs font-semibold " +
                      statusClass(rowStatus)
                    }
                  >
                    {statusLabel(rowStatus)}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openComplaint(row)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {meta && meta.totalPages > 1 ? (
        <HStack className="justify-end mt-4">
          <Pagination
            total={meta.totalPages}
            page={meta.currentPage}
            onChange={(p) => setFilters({ ...filters, page: p.toString() })}
            variant="bordered"
            showControls
            size="sm"
          />
        </HStack>
      ) : null}

      <ComplaintDetailsSheet
        open={isSheetOpen}
        onClose={closeSheet}
        complaint={complaintDetail}
        isLoading={detailLoading}
        error={detailError}
        selectedStatus={selectedStatus}
        statusOptions={COMPLAINT_STATUS_OPTIONS}
        onStatusChange={setSelectedStatus}
        comment={statusComment}
        onCommentChange={setStatusComment}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={statusUpdateLoading}
        updateError={statusUpdateError}
      />
    </div>
  );
}
