"use client";
import { getShipments } from "@/actions/shipment";
import HStack from "@/components/shared/layout/HStack";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRoles } from "@/config/constants";
import { ShipmentStatusOptions } from "@/config/constants/data";
import { RIDER_DELIVERIES_TABLE_COLUMNS } from "@/config/constants/tables";
import type { Shipment } from "@/types/shipment";
import {
  Chip,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import { RiderShipmentSheetContent } from "./RiderShipmentSheetContent";
import {
  cn,
  getShipmentStatusDisplay,
  getStyleByStatus,
} from "@/utils/helpers";
import { useSession } from "next-auth/react";

export function RiderBookingsTable() {
  const [filters, setFilters] = useQueryStates(
    {
      status: parseAsString,
      query: parseAsString.withDefault(""),
      page: parseAsString.withDefault("1"),
    },
    { shallow: false }
  );

  const [selectedOrder, setSelectedShipmentOrder] = useState<Shipment | null>(
    null
  );

  const { data } = useQuery({
    queryKey: [filters.status, filters.page],
    queryFn: () =>
      getShipments({ status: filters.status ?? "", page: filters.page }),
  });

  const queryClient = useQueryClient();

  const shipments = data?.results?.items || [];

  const filteredStatus = ShipmentStatusOptions.filter((s) => !s?.isAdmin);

  const { data: session } = useSession();
  const role = session?.user?.role.name as UserRoles;

  const isAdmin = role === UserRoles.ADMIN;

  return (
    <div>
      <HStack>
        <div className="md:w-[350px]">
          <Select
            value={filters.status || ""}
            onValueChange={(e) => setFilters({ status: e })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {filteredStatus.map((status) => (
                <SelectItem value={status.value} key={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </HStack>

      <div className="border rounded-lg bg-white p-4 mt-4 overflow-x-scroll">
        <Table
          removeWrapper
          aria-label="list of shipments"
          shadow="none"
          radius="none"
          classNames={{
            th: "bg-transparent border-b",
            base: "max-w-full",
          }}
        >
          <TableHeader columns={RIDER_DELIVERIES_TABLE_COLUMNS}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={
              <p className="text-gray-300 text-sm">There are no orders yet</p>
            }
          >
            {shipments?.map((shipment: any) => {
              return (
                <TableRow key={shipment?.id}>
                  <TableCell>
                    {new Date(shipment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{shipment?.pickupCity}</TableCell>
                  <TableCell>{shipment?.pickupArea}</TableCell>
                  <TableCell>{shipment?.dropOffCity}</TableCell>
                  <TableCell>{shipment?.dropOffArea}</TableCell>

                  <TableCell>{shipment?.senderPhone}</TableCell>
                  <TableCell>{shipment?.recipientPhone}</TableCell>
                  <TableCell>
                    <Chip
                      variant="dot"
                      className={cn("capitalize")}
                      classNames={getStyleByStatus(shipment?.status)}
                    >
                      {getShipmentStatusDisplay(shipment?.status, isAdmin)}
                    </Chip>
                  </TableCell>

                  <TableCell>
                    <Button
                      onClick={() => setSelectedShipmentOrder(shipment)}
                      className="!rounded-full"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Drawer
          isOpen={selectedOrder != null}
          onOpenChange={() => setSelectedShipmentOrder(null)}
          size="2xl"
        >
          <DrawerContent>
            <DrawerHeader className="mb-5">
              Order: #{selectedOrder?.reference}
            </DrawerHeader>
            <DrawerBody className="pt-0">
              <RiderShipmentSheetContent
                order={selectedOrder}
                onClose={() => {
                  setSelectedShipmentOrder(null);
                  queryClient.invalidateQueries({
                    queryKey: [filters.status, filters.page],
                  });
                }}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
