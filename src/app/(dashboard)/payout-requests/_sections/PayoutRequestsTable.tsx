"use client";

import type { GetPayoutRequestsResponse } from "@/actions/wallet";
import EmptyContent from "@/components/shared/EmptyContent";
import HStack from "@/components/shared/layout/HStack";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { PayoutRequest, PayoutRequestStatus } from "@/types/payout";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { ArrowRight, Filter, Landmark, Search, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import React, { useEffect, useState } from "react";
import { UpdateStatusModal } from "./UpdateStatusModal";

interface Props {
  payoutResponse?: GetPayoutRequestsResponse;
}

const columns = [
  { key: "date", label: "Requested" },
  { key: "reference", label: "Reference" },
  { key: "rider", label: "Rider" },
  { key: "method", label: "Destination" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Pending", value: PayoutRequestStatus.PENDING },
  { label: "Approved", value: PayoutRequestStatus.APPROVED },
  { label: "Completed", value: PayoutRequestStatus.COMPLETED },
  { label: "Rejected", value: PayoutRequestStatus.REJECTED },
  { label: "Failed", value: PayoutRequestStatus.FAILED },
  { label: "Cancelled", value: PayoutRequestStatus.CANCELLED },
];

function getStatusColor(status: PayoutRequestStatus) {
  switch (status) {
    case PayoutRequestStatus.PENDING:
      return {
        dot: "bg-amber-500",
        base: "border-amber-200 bg-amber-50 text-amber-700",
      };
    case PayoutRequestStatus.APPROVED:
      return {
        dot: "bg-blue-500",
        base: "border-blue-200 bg-blue-50 text-blue-700",
      };
    case PayoutRequestStatus.COMPLETED:
      return {
        dot: "bg-emerald-500",
        base: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case PayoutRequestStatus.REJECTED:
    case PayoutRequestStatus.FAILED:
      return {
        dot: "bg-red-500",
        base: "border-red-200 bg-red-50 text-red-700",
      };
    default:
      return {
        dot: "bg-gray-500",
        base: "border-gray-200 bg-gray-50 text-gray-700",
      };
  }
}

function getPaymentMethodDisplay(method: string) {
  return method === "mobile_money" ? "Mobile money" : "Bank transfer";
}

export default function PayoutRequestsTable({
  payoutResponse,
}: Readonly<Props>) {
  const router = useRouter();
  const { items: requests = [], meta } = payoutResponse || {};
  const [selectedRequest, setSelectedRequest] = useState<PayoutRequest | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useQueryStates(
    {
      status: parseAsString,
      page: parseAsString,
      search: parseAsString,
    },
    { shallow: false },
  );
  const [searchDraft, setSearchDraft] = useState(filters.search ?? "");
  const [statusDraft, setStatusDraft] = useState(filters.status || "all");

  useEffect(() => {
    setSearchDraft(filters.search ?? "");
    setStatusDraft(filters.status || "all");
  }, [filters.search, filters.status]);

  const openRequest = (request: PayoutRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const applyFilters = (event: React.FormEvent) => {
    event.preventDefault();
    setFilters({
      search: searchDraft.trim() || null,
      status: statusDraft === "all" ? null : statusDraft,
      page: "1",
    });
  };

  const clearFilters = () => {
    setSearchDraft("");
    setStatusDraft("all");
    setFilters({ search: null, status: null, page: null });
  };

  const pageGrossAmount = requests.reduce(
    (sum, request) => sum + Number(request.amount),
    0,
  );
  const pagePending = requests.filter(
    (request) => request.status === PayoutRequestStatus.PENDING,
  ).length;
  const hasFilters = Boolean(filters.search || filters.status);

  return (
    <div className="space-y-6">
      <div className="grid overflow-hidden rounded-xl border bg-white sm:grid-cols-3 sm:[&>*+*]:border-l">
        <Metric
          label="Total requests"
          value={String(meta?.totalItems || 0)}
          hint="Across this filtered view"
        />
        <Metric
          label="Pending on this page"
          value={String(pagePending)}
          hint="Requires admin review"
        />
        <Metric
          label="Gross amount on this page"
          value={`${DEFAULT_CURRENCY.symbol}${pageGrossAmount.toFixed(2)}`}
          hint="Before processing fees"
          last
        />
      </div>

      <div className="rounded-xl border bg-white">
        <form
          onSubmit={applyFilters}
          className="flex flex-col gap-3 border-b p-4 sm:p-5 lg:flex-row lg:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="payout-search"
              className="mb-1.5 block text-xs font-medium text-gray-500"
            >
              Search requests
            </label>
            <Input
              id="payout-search"
              value={searchDraft}
              onValueChange={setSearchDraft}
              placeholder="Reference, rider name, or phone"
              variant="bordered"
              radius="sm"
              size="md"
              startContent={<Search size={17} className="text-gray-400" />}
              classNames={{
                inputWrapper: "h-10 min-h-10 border-gray-200 bg-white",
              }}
            />
          </div>
          <div className="lg:w-60">
            <label
              htmlFor="payout-status"
              className="mb-1.5 block text-xs font-medium text-gray-500"
            >
              Request status
            </label>
            <Select value={statusDraft} onValueChange={setStatusDraft}>
              <SelectTrigger id="payout-status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="gap-2">
              <Filter size={16} />
              Apply
            </Button>
            {hasFilters ? (
              <Button type="button" variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            ) : null}
          </div>
        </form>

        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-secondary">
              {requests.length}
            </span>{" "}
            of {meta?.totalItems || 0}
          </p>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <Table aria-label="Payout requests" shadow="none" radius="none">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  className="bg-gray-50 text-xs font-semibold text-gray-500"
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={
                <EmptyContent
                  title={
                    hasFilters ? "No matching requests" : "No payout requests"
                  }
                  description={
                    hasFilters
                      ? "Try changing or clearing the current filters."
                      : "New rider withdrawal requests will appear here."
                  }
                />
              }
            >
              {requests.map((request) => {
                const statusColors = getStatusColor(request.status);
                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      <p className="text-sm font-medium text-secondary">
                        {new Date(request.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-semibold text-secondary">
                        {request.reference}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-semibold text-secondary">
                        {request.rider.fullName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {request.rider.phone}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex min-w-36 items-center gap-2">
                        {request.payoutMethod === "mobile_money" ? (
                          <Smartphone size={16} className="text-gray-400" />
                        ) : (
                          <Landmark size={16} className="text-gray-400" />
                        )}
                        <div>
                          <p className="text-sm text-secondary">
                            {getPaymentMethodDisplay(request.payoutMethod)}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {request.payoutMethod === "mobile_money"
                              ? request.mobileMoneyProvider
                              : request.bankName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-semibold text-secondary">
                        {DEFAULT_CURRENCY.symbol}
                        {Number(request.amount).toFixed(2)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Net {DEFAULT_CURRENCY.symbol}
                        {Number(request.netAmount).toFixed(2)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Chip
                        variant="dot"
                        classNames={statusColors}
                        className="capitalize"
                      >
                        {request.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => openRequest(request)}
                      >
                        Review
                        <ArrowRight size={15} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="divide-y md:hidden">
          {requests.length ? (
            requests.map((request) => {
              const statusColors = getStatusColor(request.status);
              return (
                <article key={request.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs font-semibold text-secondary">
                        {request.reference}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Chip
                      variant="dot"
                      classNames={statusColors}
                      className="capitalize"
                    >
                      {request.status}
                    </Chip>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-secondary">
                        {request.rider.fullName}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {getPaymentMethodDisplay(request.payoutMethod)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-secondary">
                        {DEFAULT_CURRENCY.symbol}
                        {Number(request.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Net {DEFAULT_CURRENCY.symbol}
                        {Number(request.netAmount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => openRequest(request)}
                  >
                    Review request
                  </Button>
                </article>
              );
            })
          ) : (
            <div className="px-4 py-12">
              <EmptyContent
                title={
                  hasFilters ? "No matching requests" : "No payout requests"
                }
                description={
                  hasFilters
                    ? "Try changing or clearing the current filters."
                    : "New rider withdrawal requests will appear here."
                }
              />
            </div>
          )}
        </div>

        {meta && meta.totalPages > 1 ? (
          <HStack className="justify-end border-t px-4 py-4 sm:px-5">
            <Pagination
              total={meta.totalPages}
              page={meta.currentPage}
              onChange={(page) =>
                setFilters({ ...filters, page: page.toString() })
              }
              variant="bordered"
              showControls
              size="sm"
            />
          </HStack>
        ) : null}
      </div>

      <UpdateStatusModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        payoutRequest={selectedRequest}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
  last = false,
}: Readonly<{
  label: string;
  value: string;
  hint: string;
  last?: boolean;
}>) {
  return (
    <div className={last ? "p-5" : "border-b p-5 sm:border-b-0"}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-secondary">
        {value}
      </p>
      <p className="mt-1 text-xs text-gray-400">{hint}</p>
    </div>
  );
}
