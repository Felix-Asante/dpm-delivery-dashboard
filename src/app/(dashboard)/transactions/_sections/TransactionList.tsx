"use client";
import type { GetWalletTransactionsResponse } from "@/actions/wallet";
import EmptyContent from "@/components/shared/EmptyContent";
import HStack from "@/components/shared/layout/HStack";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_CURRENCY, WalletTransactionTypes } from "@/config/constants";
import type { Wallet } from "@/types/wallet";
import { cn } from "@/utils/helpers";
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
import { parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  transactionResponse?: GetWalletTransactionsResponse;
  wallet?: Wallet;
}

const columns = [
  { key: "date", label: "Date" },
  { key: "reference", label: "Reference" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Amount" },
];

const transactionTypeOptions = [
  { label: "All Types", value: "All" },
  { label: "Payment Received", value: WalletTransactionTypes.PAYMENT_RECEIVED },
  { label: "Withdrawal", value: WalletTransactionTypes.WITHDRAWAL },
  { label: "Debit", value: WalletTransactionTypes.DEBIT },
  { label: "Adjustment", value: WalletTransactionTypes.ADJUSTMENT },
];

export default function TransactionList(props: Props) {
  const { transactionResponse, wallet } = props;
  const { items: transactions = [], meta } = transactionResponse || {};

  const [filters, setFilters] = useQueryStates(
    {
      type: parseAsString,
      page: parseAsString,
    },
    { shallow: false }
  );

  const getTransactionTypeDisplay = (type: WalletTransactionTypes) => {
    switch (type) {
      case WalletTransactionTypes.PAYMENT_RECEIVED:
        return "Payment Received";
      case WalletTransactionTypes.WITHDRAWAL:
        return "Withdrawal";
      case WalletTransactionTypes.DEBIT:
        return "Debit";
      case WalletTransactionTypes.ADJUSTMENT:
        return "Adjustment";
      case WalletTransactionTypes.PAYOUT_PENDING:
        return "Payout Pending";
      case WalletTransactionTypes.PAYOUT_REJECTED:
        return "Payout Rejected";
      case WalletTransactionTypes.PAYOUT_FAILED:
        return "Payout Failed";
      case WalletTransactionTypes.PAYOUT_APPROVED:
        return "Payout Approved";
      default:
        return type;
    }
  };

  const getTransactionTypeColor = (type: WalletTransactionTypes) => {
    switch (type) {
      case WalletTransactionTypes.PAYMENT_RECEIVED:
        return {
          dot: "bg-green-500",
          base: "border-green-200 bg-green-50 text-green-700",
        };
      case WalletTransactionTypes.WITHDRAWAL:
        return {
          dot: "bg-blue-500",
          base: "border-blue-200 bg-blue-50 text-blue-700",
        };
      case WalletTransactionTypes.DEBIT:
        return {
          dot: "bg-red-500",
          base: "border-red-200 bg-red-50 text-red-700",
        };
      case WalletTransactionTypes.ADJUSTMENT:
        return {
          dot: "bg-yellow-500",
          base: "border-yellow-200 bg-yellow-50 text-yellow-700",
        };
      case WalletTransactionTypes.PAYOUT_PENDING:
        return {
          dot: "bg-yellow-500",
          base: "border-yellow-200 bg-yellow-50 text-yellow-700",
        };
      case WalletTransactionTypes.PAYOUT_REJECTED:
        return {
          dot: "bg-yellow-500",
          base: "border-yellow-200 bg-yellow-50 text-yellow-700",
        };
      case WalletTransactionTypes.PAYOUT_FAILED:
        return {
          dot: "bg-red-500",
          base: "border-red-200 bg-red-50 text-red-700",
        };
      case WalletTransactionTypes.PAYOUT_APPROVED:
        return {
          dot: "bg-green-500",
          base: "border-green-200 bg-green-50 text-green-700",
        };
      default:
        return {
          dot: "bg-gray-500",
          base: "border-gray-200 bg-gray-50 text-gray-700",
        };
    }
  };

  const formatAmount = (amount: string, type: WalletTransactionTypes) => {
    const numAmount = parseFloat(amount);
    const isPositive =
      type === WalletTransactionTypes.PAYMENT_RECEIVED ||
      type === WalletTransactionTypes.ADJUSTMENT;

    return (
      <span
        className={cn(
          "font-semibold",
          isPositive ? "text-green-600" : "text-red-600"
        )}
      >
        {isPositive ? "+" : "-"}
        {DEFAULT_CURRENCY.symbol}
        {Math.abs(numAmount).toFixed(2)}
      </span>
    );
  };

  const totalEarned = wallet?.totalEarned ? parseFloat(wallet.totalEarned) : 0;
  const balance = wallet?.balance ? parseFloat(wallet.balance) : 0;

  const totalWithdrawn = totalEarned - balance;

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700 font-medium">
            Total Transactions
          </p>
          <h3 className="text-2xl font-bold text-green-900 mt-1">
            {transactions.length}
          </h3>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Total Received</p>
          <h3 className="text-2xl font-bold text-blue-900 mt-1">
            {DEFAULT_CURRENCY.symbol}
            {transactions
              .filter((t) => t.type === WalletTransactionTypes.PAYMENT_RECEIVED)
              .reduce((sum, t) => sum + parseFloat(t.amount), 0)
              .toFixed(2)}
          </h3>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-red-700 font-medium">Total Withdrawn</p>
          <h3 className="text-2xl font-bold text-red-900 mt-1">
            {DEFAULT_CURRENCY.symbol}
            {totalWithdrawn.toFixed(2)}
          </h3>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="md:w-[250px]">
          <Select
            value={filters.type || ""}
            onValueChange={(value) => setFilters({ ...filters, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {transactionTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      {transactions.length > 0 && (
        <p className="text-sm text-gray-600 mb-3">
          Showing {transactions.length} of {transactions.length} transactions
        </p>
      )}

      {/* Table */}
      <Table aria-label="Transactions table" shadow="none" radius="sm">
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
              title={filters.type ? "No results found" : "No transactions yet"}
              description={
                filters.type
                  ? "Try adjusting your filters or search term"
                  : "Your transaction history will appear here"
              }
            />
          }
        >
          {transactions.map((transaction) => {
            const typeColors = getTransactionTypeColor(transaction.type);
            return (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(transaction.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-700 font-mono">
                    {transaction.reference}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    variant="dot"
                    classNames={{
                      dot: typeColors.dot,
                      base: typeColors.base,
                    }}
                    className="capitalize"
                  >
                    {getTransactionTypeDisplay(transaction.type)}
                  </Chip>
                </TableCell>
                <TableCell>
                  {formatAmount(transaction.amount, transaction.type)}
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
    </div>
  );
}
