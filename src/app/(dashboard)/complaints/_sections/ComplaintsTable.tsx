"use client";

import type { GetComplaintsForAdminResponse } from "@/actions/complaints";
import EmptyContent from "@/components/shared/EmptyContent";
import HStack from "@/components/shared/layout/HStack";
import { Button } from "@/components/ui/button";
import {
  COMPLAINT_CATEGORY_LABEL,
  Complaint,
  ComplaintCategory,
} from "@/types/complaint";
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
import { ExternalLink, Filter } from "lucide-react";
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
  { key: "picture", label: "Photo" },
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

export default function ComplaintsTable({ data }: Readonly<Props>) {
  const { items: complaints = [], meta } = data || {};

  const [filters, setFilters] = useQueryStates(
    {
      page: parseAsString,
      query: parseAsString,
      category: parseAsString,
      from: parseAsString,
      to: parseAsString,
    },
    { shallow: false },
  );

  const [searchDraft, setSearchDraft] = useState(() => filters.query ?? "");
  const [categoryDraft, setCategoryDraft] = useState(
    () => filters.category || "all",
  );
  const [fromDraft, setFromDraft] = useState(() => filters.from ?? "");
  const [toDraft, setToDraft] = useState(() => filters.to ?? "");
  const [dateHint, setDateHint] = useState<string | null>(null);

  useEffect(() => {
    setSearchDraft(filters.query ?? "");
    setCategoryDraft(filters.category || "all");
    setFromDraft(filters.from ?? "");
    setToDraft(filters.to ?? "");
  }, [filters.query, filters.category, filters.from, filters.to]);

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
      from: fromDraft || null,
      to: toDraft || null,
      page: "1",
    });
  };

  const onClearFilters = () => {
    setSearchDraft("");
    setCategoryDraft("all");
    setFromDraft("");
    setToDraft("");
    setDateHint(null);
    setFilters({
      page: null,
      query: null,
      category: null,
      from: null,
      to: null,
    });
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      {meta && (
        <div className="mb-6 p-4 rounded-lg border border-gray-100 bg-gray-50/80">
          <p className="text-sm text-gray-600">Total complaints</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">
            {meta.totalItems}
          </p>
        </div>
      )}

      <form
        className="flex flex-col gap-4 mb-4"
        onSubmit={onApplyFilters}
        noValidate
      >
        <div className="flex flex-col lg:flex-row flex-wrap gap-3 items-stretch lg:items-end">
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="complaints-category"
              className="text-xs text-gray-500 mb-1 block"
            >
              Category
            </label>
            <select
              id="complaints-category"
              className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm"
              value={categoryDraft}
              onChange={(e) => setCategoryDraft(e.target.value)}
            >
              {categoryOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[220px]">
            <label
              htmlFor="complaints-search"
              className="text-xs text-gray-500 mb-1 block"
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
          <div className="flex flex-wrap gap-2 items-end">
            <div>
              <label
                htmlFor="complaints-from"
                className="text-xs text-gray-500 mb-1 block"
              >
                From
              </label>
              <input
                id="complaints-from"
                type="date"
                className="w-full min-w-[140px] h-10 rounded-md border border-gray-200 bg-white px-3 text-sm"
                value={fromDraft}
                onChange={(e) => setFromDraft(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="complaints-to"
                className="text-xs text-gray-500 mb-1 block"
              >
                To
              </label>
              <input
                id="complaints-to"
                type="date"
                className="w-full min-w-[140px] h-10 rounded-md border border-gray-200 bg-white px-3 text-sm"
                value={toDraft}
                onChange={(e) => setToDraft(e.target.value)}
              />
            </div>
          </div>
        </div>
        <HStack className="flex-wrap gap-2 items-center justify-start">
          <Button type="submit" className="gap-2">
            <Filter className="h-4 w-4" />
            Apply filters
          </Button>
          <Button type="button" variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        </HStack>
        {dateHint && <p className="text-sm text-amber-700">{dateHint}</p>}
      </form>

      {complaints.length > 0 && (
        <p className="text-sm text-gray-600 mb-3">
          Showing {complaints.length} of {meta?.totalItems ?? 0} complaints
        </p>
      )}

      <Table aria-label="Complaints table" shadow="none" radius="sm">
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
              title="No complaints"
              description="Complaints from customers will appear here."
            />
          }
        >
          {complaints.map((row: Complaint) => (
            <TableRow key={row.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(row.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(row.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900">{row.fullName}</p>
                  <p className="text-xs text-gray-500">{row.phone}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-gray-700 font-mono text-xs">
                  {row.trackingNumber}
                </span>
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="flat" className="text-xs">
                  {COMPLAINT_CATEGORY_LABEL[row.category] ?? row.category}
                </Chip>
              </TableCell>
              <TableCell>
                <p
                  className="text-sm text-gray-700 line-clamp-2 max-w-[min(100%,280px)]"
                  title={row.issue}
                >
                  {truncate(row.issue, 180)}
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
                  <span className="text-gray-400 text-sm">—</span>
                )}
              </TableCell>
              <TableCell>
                {row.picture ? (
                  <a
                    href={row.picture}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary font-medium"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {meta && meta.totalPages > 1 && (
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
      )}
    </div>
  );
}
