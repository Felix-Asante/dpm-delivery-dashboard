"use client";
import { GetShipmentsResponse } from "@/actions/shipment";
import EmptyContent from "@/components/shared/EmptyContent";
import HStack from "@/components/shared/layout/HStack";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_CURRENCY, UserRoles } from "@/config/constants";
import { ShipmentStatusOptions } from "@/config/constants/data";
import type { Shipment } from "@/types/shipment";
import {
  cn,
  formatCurrency,
  getShipmentStatusDisplay,
  getStyleByStatus,
} from "@/utils/helpers";
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
import { ArrowRight, Filter, MapPin, ReceiptText, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import AddDeliveryCostForm from "./AddDeliveryCostForm";

interface Props {
  shipments: GetShipmentsResponse;
}

const columns = [
  { key: "order", label: "Order" },
  { key: "route", label: "Route" },
  { key: "contacts", label: "Contacts" },
  { key: "rider", label: "Rider" },
  { key: "cost", label: "Cost" },
  { key: "status", label: "Status" },
  { key: "action", label: "" },
];

export function ShipmentLists({ shipments }: Readonly<Props>) {
  const { meta } = shipments;
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null,
  );
  const [filters, setFilters] = useQueryStates(
    {
      page: parseAsString,
      query: parseAsString,
      status: parseAsString,
    },
    { shallow: false },
  );
  const [searchDraft, setSearchDraft] = useState(filters.query ?? "");
  const [statusDraft, setStatusDraft] = useState(filters.status || "all");

  useEffect(() => {
    setSearchDraft(filters.query ?? "");
    setStatusDraft(filters.status || "all");
  }, [filters.query, filters.status]);

  const { data: session } = useSession();
  const role = session?.user?.role.name as UserRoles;
  const isAdmin = role === UserRoles.ADMIN;

  const applyFilters = (event: React.FormEvent) => {
    event.preventDefault();
    setFilters({
      query: searchDraft.trim() || null,
      status: statusDraft === "all" ? null : statusDraft,
      page: "1",
    });
  };

  const clearFilters = () => {
    setSearchDraft("");
    setStatusDraft("all");
    setFilters({ query: null, status: null, page: null });
  };

  const hasFilters = Boolean(filters.query || filters.status);

  return (
    <div className="rounded-xl border bg-white">
      <div className="border-b p-4 sm:p-5">
        <form
          onSubmit={applyFilters}
          className="flex flex-col gap-3 lg:flex-row lg:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="delivery-search"
              className="mb-1.5 block text-xs font-medium text-gray-500"
            >
              Search orders
            </label>
            <Input
              id="delivery-search"
              value={searchDraft}
              onValueChange={setSearchDraft}
              placeholder="Reference, city, area, or phone number"
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
              htmlFor="delivery-status"
              className="mb-1.5 block text-xs font-medium text-gray-500"
            >
              Delivery status
            </label>
            <Select value={statusDraft} onValueChange={setStatusDraft}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                {ShipmentStatusOptions.map((option) => (
                  <SelectItem value={option.value} key={option.value}>
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
      </div>

      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-secondary">
            {meta?.totalItems ?? 0}
          </span>{" "}
          deliveries
        </p>
        <p className="hidden text-xs text-gray-400 sm:block">
          Showing {shipments.items.length} on this page
        </p>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <Table aria-label="Deliveries" shadow="none" radius="none">
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
                title={hasFilters ? "No matching deliveries" : "No deliveries"}
                description={
                  hasFilters
                    ? "Try changing or clearing the current filters."
                    : "New delivery orders will appear here."
                }
              />
            }
          >
            {shipments.items.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>
                  <div>
                    <p className="font-mono text-xs font-semibold text-secondary">
                      {shipment.reference}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(shipment.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-44">
                    <p className="text-sm font-medium text-secondary">
                      {shipment.pickupArea}, {shipment.pickupCity}
                    </p>
                    <div className="my-1 h-3 border-l border-dashed border-gray-300" />
                    <p className="text-sm text-gray-600">
                      {shipment.dropOffArea}, {shipment.dropOffCity}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    <p className="text-secondary">{shipment.senderPhone}</p>
                    <p className="mt-1 text-gray-500">
                      {shipment.recipientPhone}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-32 truncate text-sm text-gray-700">
                    {shipment.rider?.fullName || "Not assigned"}
                  </p>
                </TableCell>
                <TableCell>
                  {shipment.shipmentCost ? (
                    <div>
                      <p className="text-sm font-semibold text-secondary">
                        {DEFAULT_CURRENCY.symbol}
                        {formatCurrency(shipment.shipmentCost.totalCost)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {shipment.shipmentCost.paid
                          ? "Paid"
                          : "Payment pending"}
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-700">Not set</span>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    variant="dot"
                    className={cn("capitalize")}
                    classNames={getStyleByStatus(shipment.status)}
                  >
                    {getShipmentStatusDisplay(shipment.status, isAdmin)}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {isAdmin ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 text-xs"
                        onClick={() => setSelectedShipment(shipment)}
                      >
                        <ReceiptText size={15} />
                        {shipment.shipmentCost ? "Edit fee" : "Set fee"}
                      </Button>
                    ) : null}
                    <Button asChild variant="ghost" size="sm" className="h-8">
                      <Link href={`/deliveries/${shipment.id}`}>
                        Open <ArrowRight size={15} />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y md:hidden">
        {shipments.items.length ? (
          shipments.items.map((shipment) => (
            <article key={shipment.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-semibold text-secondary">
                    {shipment.reference}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(shipment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Chip
                  variant="dot"
                  className="capitalize"
                  classNames={getStyleByStatus(shipment.status)}
                >
                  {getShipmentStatusDisplay(shipment.status, isAdmin)}
                </Chip>
              </div>
              <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <div className="flex gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                  <div className="text-sm">
                    <p className="font-medium text-secondary">
                      {shipment.pickupArea}, {shipment.pickupCity}
                    </p>
                    <p className="mt-1 text-gray-500">
                      to {shipment.dropOffArea}, {shipment.dropOffCity}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500">Rider</p>
                  <p className="text-sm font-medium text-secondary">
                    {shipment.rider?.fullName || "Not assigned"}
                  </p>
                </div>
                <div className="flex gap-1">
                  {isAdmin ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedShipment(shipment)}
                    >
                      {shipment.shipmentCost ? "Edit fee" : "Set fee"}
                    </Button>
                  ) : null}
                  <Button asChild size="sm">
                    <Link href={`/deliveries/${shipment.id}`}>Open</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="px-4 py-12">
            <EmptyContent
              title={hasFilters ? "No matching deliveries" : "No deliveries"}
              description={
                hasFilters
                  ? "Try changing or clearing the current filters."
                  : "New delivery orders will appear here."
              }
            />
          </div>
        )}
      </div>

      {shipments?.meta?.totalPages > 1 && (
        <HStack className="justify-end border-t px-4 py-4 sm:px-5">
          <Pagination
            total={shipments?.meta?.totalPages}
            page={shipments.meta.currentPage}
            variant="bordered"
            showControls
            onChange={(page) =>
              setFilters({ ...filters, page: page.toString() })
            }
          />
        </HStack>
      )}

      <Dialog
        open={!!selectedShipment}
        onOpenChange={() => setSelectedShipment(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader className="mb-5">
            <DialogTitle>
              {selectedShipment?.shipmentCost
                ? "Edit delivery fee"
                : "Set delivery fee"}
            </DialogTitle>
            <DialogDescription>
              Configure charges and rider commission for{" "}
              <span className="font-mono">{selectedShipment?.reference}.</span>
            </DialogDescription>
          </DialogHeader>
          <AddDeliveryCostForm
            shipment={selectedShipment!}
            onSuccess={() => setSelectedShipment(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
