"use client";
import { GetShipmentsResponse } from "@/actions/shipment";
import EmptyContent from "@/components/shared/EmptyContent";
import TextField from "@/components/shared/input/TextField";
import HStack from "@/components/shared/layout/HStack";
import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShipmentStatusOptions } from "@/config/constants/data";
import { DELIVIRIES_TABLE_COLUMNS } from "@/config/constants/tables";
import useDebounce from "@/hooks/useDebounce";
import type { Status } from "@/types";
import type { Shipment } from "@/types/shipment";
import {
  cn,
  getShipmentStatusDisplay,
  getStyleByStatus,
  pluralize,
} from "@/utils/helpers";
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
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AddDeliveryCostForm from "./AddDeliveryCostForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { UserRoles } from "@/config/constants";

interface Props {
  shipments: GetShipmentsResponse;
}

export function ShipmentLists({ shipments }: Props) {
  const { meta } = shipments;
  const [page, setPage] = useQueryState("page", { shallow: false });
  const [query, setQuery] = useQueryState("query", { shallow: false });
  const { control, watch } = useForm();

  const debouncedSearch = useDebounce(watch("search"), 500);
  const [status, setStatus] = useQueryState("status", { shallow: false });

  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );

  useEffect(() => {
    setQuery(debouncedSearch);
  }, [debouncedSearch]);

  const { data: session } = useSession();
  const role = session?.user?.role.name as UserRoles;

  const isAdmin = role === UserRoles.ADMIN;

  return (
    <div className="p-4">
      <h3 className="font-semibold text-xl">
        {meta?.totalItems} {pluralize("Order", meta?.totalItems)}
      </h3>
      <p className="text-gray-400">List of all orders</p>
      <div className="px-2 py-1 border rounded-md my-4 bg-white">
        <div className="px-2 mb-3 flex items-center gap-5">
          <TextField
            name="search"
            placeholder="Search"
            control={control}
            variant="bordered"
            radius="sm"
            size="md"
            className="md:w-[350px]"
            defaultValue={query ?? ""}
          />
          <div className="md:w-[350px]">
            <Select value={status || ""} onValueChange={(e) => setStatus(e)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ShipmentStatusOptions.map((status) => (
                  <SelectItem value={status.value} key={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table aria-label="list of shipments" shadow="none" radius="none">
          <TableHeader columns={DELIVIRIES_TABLE_COLUMNS}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={
              <EmptyContent title="" description="There are no shipments yet" />
            }
          >
            {shipments?.items?.map((shipment) => {
              return (
                <TableRow key={shipment?.id}>
                  <TableCell>
                    {new Date(shipment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{shipment?.pickupCity}</TableCell>
                  <TableCell>{shipment?.pickupArea}</TableCell>
                  <TableCell>{shipment?.dropOffCity}</TableCell>
                  <TableCell>{shipment?.dropOffArea}</TableCell>
                  {/* <TableCell>
                    {shipment?.pickupDate
                      ? new Date(shipment.pickupDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {shipment?.dropOffDate
                      ? new Date(shipment.dropOffDate).toLocaleDateString()
                      : "-"}
                  </TableCell> */}
                  <TableCell>
                    <Chip
                      variant="dot"
                      className={cn("capitalize")}
                      classNames={getStyleByStatus(shipment?.status as Status)}
                    >
                      {getShipmentStatusDisplay(shipment?.status, isAdmin)}
                    </Chip>
                  </TableCell>
                  <TableCell>{shipment?.senderPhone}</TableCell>
                  <TableCell>{shipment?.recipientPhone}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs rounded-full"
                        onClick={() => setSelectedShipment(shipment)}
                      >
                        Set fee
                      </Button>
                      <Link href={`/deliveries/${shipment?.id}`}>
                        <Button
                          variant="default"
                          color="primary"
                          size="sm"
                          className="text-xs rounded-full"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {shipments?.meta?.totalPages > 1 && (
        <HStack className="justify-end mt-3">
          <Pagination
            total={shipments?.meta?.totalPages}
            initialPage={1}
            variant="bordered"
            showControls
            onChange={(page) => setPage(page.toString())}
          />
        </HStack>
      )}

      <Dialog
        open={!!selectedShipment}
        onOpenChange={() => setSelectedShipment(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader className="mb-5">
            <DialogTitle>Add Delivery Cost</DialogTitle>
            <DialogDescription>
              Define and manage the cost details associated with a shipment,
              including pickup, delivery, rider commission, and optional
              repackaging fees
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
