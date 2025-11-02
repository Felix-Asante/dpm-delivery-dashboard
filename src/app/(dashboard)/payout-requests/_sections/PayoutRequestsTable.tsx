"use client";

import React, { useState } from "react";
import { GetPayoutRequestsResponse } from "@/actions/wallet";
import EmptyContent from "@/components/shared/EmptyContent";
import HStack from "@/components/shared/layout/HStack";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { PayoutRequest, PayoutRequestStatus } from "@/types/payout";
import { parseAsString, useQueryStates } from "nuqs";
import {
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw } from "lucide-react";
import { UpdateStatusModal } from "./UpdateStatusModal";
import { useRouter } from "next/navigation";

interface Props {
  payoutResponse?: GetPayoutRequestsResponse;
}

const columns = [
  { key: "date", label: "Date" },
  { key: "reference", label: "Reference" },
  { key: "rider", label: "Rider" },
  { key: "method", label: "Method" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: PayoutRequestStatus.PENDING },
  { label: "Approved", value: PayoutRequestStatus.APPROVED },
  // { label: "Processing", value: PayoutRequestStatus.PROCESSING },
  { label: "Completed", value: PayoutRequestStatus.COMPLETED },
  { label: "Rejected", value: PayoutRequestStatus.REJECTED },
  { label: "Failed", value: PayoutRequestStatus.FAILED },
  { label: "Cancelled", value: PayoutRequestStatus.CANCELLED },
];

export default function PayoutRequestsTable({ payoutResponse }: Props) {
  const router = useRouter();
  const { items: payoutRequests = [], meta } = payoutResponse || {};
  const [selectedRequest, setSelectedRequest] = useState<PayoutRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useQueryStates(
    {
      status: parseAsString,
      page: parseAsString,
    },
    { shallow: false }
  );

  const getStatusColor = (status: PayoutRequestStatus) => {
    switch (status) {
      case PayoutRequestStatus.PENDING:
        return {
          dot: "bg-yellow-500",
          base: "border-yellow-200 bg-yellow-50 text-yellow-700",
        };
      case PayoutRequestStatus.APPROVED:
        return {
          dot: "bg-green-500",
          base: "border-green-200 bg-green-50 text-green-700",
        };
      // case PayoutRequestStatus.PROCESSING:
      //   return {
      //     dot: "bg-blue-500",
      //     base: "border-blue-200 bg-blue-50 text-blue-700",
      //   };
      case PayoutRequestStatus.COMPLETED:
        return {
          dot: "bg-green-600",
          base: "border-green-300 bg-green-100 text-green-800",
        };
      case PayoutRequestStatus.REJECTED:
        return {
          dot: "bg-red-500",
          base: "border-red-200 bg-red-50 text-red-700",
        };
      case PayoutRequestStatus.FAILED:
        return {
          dot: "bg-red-600",
          base: "border-red-300 bg-red-100 text-red-800",
        };
      case PayoutRequestStatus.CANCELLED:
        return {
          dot: "bg-gray-500",
          base: "border-gray-200 bg-gray-50 text-gray-700",
        };
      default:
        return {
          dot: "bg-gray-500",
          base: "border-gray-200 bg-gray-50 text-gray-700",
        };
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    return method === "mobile_money" ? "Mobile Money" : "Bank Transfer";
  };

  const handleUpdateStatus = (request: PayoutRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    router.refresh();
  };

  // Calculate statistics
  const totalAmount = payoutRequests.reduce(
    (sum, req) => sum + parseFloat(req.amount),
    0
  );
  const pendingCount = payoutRequests.filter(
    (req) => req.status === PayoutRequestStatus.PENDING
  ).length;
  const completedCount = payoutRequests.filter(
    (req) => req.status === PayoutRequestStatus.COMPLETED
  ).length;

  return (
    <div className="bg-white border rounded-lg p-4">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Total Requests</p>
          <h3 className="text-2xl font-bold text-blue-900 mt-1">
            {meta?.totalItems || 0}
          </h3>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm text-yellow-700 font-medium">Pending</p>
          <h3 className="text-2xl font-bold text-yellow-900 mt-1">
            {pendingCount}
          </h3>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700 font-medium">Completed</p>
          <h3 className="text-2xl font-bold text-green-900 mt-1">
            {completedCount}
          </h3>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-700 font-medium">Total Amount</p>
          <h3 className="text-2xl font-bold text-purple-900 mt-1">
            {DEFAULT_CURRENCY.symbol}
            {totalAmount.toFixed(2)}
          </h3>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-between">
        <div className="md:w-[250px]">
          <Select
            value={filters.status || ""}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
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

        {/* <Button
          variant="outline"
          size="sm"
          onClick={() => router.refresh()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button> */}
      </div>

      {/* Results count */}
      {payoutRequests.length > 0 && (
        <p className="text-sm text-gray-600 mb-3">
          Showing {payoutRequests.length} of {meta?.totalItems || 0} requests
        </p>
      )}

      {/* Table */}
      <Table aria-label="Payout requests table" shadow="none" radius="sm">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} className="bg-gray-50">
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={
            <EmptyContent
              title={filters.status ? "No results found" : "No payout requests"}
              description={
                filters.status
                  ? "Try adjusting your filters"
                  : "Payout requests will appear here"
              }
            />
          }
        >
          {payoutRequests.map((request) => {
            const statusColors = getStatusColor(request.status);
            return (
              <TableRow key={request.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(request.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-700 font-mono text-xs">
                    {request.reference}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">
                      {request.rider.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {request.rider.phone}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm capitalize">
                    {getPaymentMethodDisplay(request.payoutMethod)}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {DEFAULT_CURRENCY.symbol}
                      {parseFloat(request.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Net: {DEFAULT_CURRENCY.symbol}
                      {parseFloat(request.netAmount).toFixed(2)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    variant="dot"
                    classNames={{
                      dot: statusColors.dot,
                      base: statusColors.base,
                    }}
                    className="capitalize"
                  >
                    {request.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  {request.status !== PayoutRequestStatus.APPROVED ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateStatus(request)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Update
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      {meta && meta?.totalPages > 1 && (
        <HStack className="justify-end mt-4">
          <Pagination
            total={meta?.totalPages}
            page={meta?.currentPage}
            onChange={(p) => setFilters({ ...filters, page: p.toString() })}
            variant="bordered"
            showControls
            size="sm"
          />
        </HStack>
      )}

      {/* Update Status Modal */}
      <UpdateStatusModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        payoutRequest={selectedRequest}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
