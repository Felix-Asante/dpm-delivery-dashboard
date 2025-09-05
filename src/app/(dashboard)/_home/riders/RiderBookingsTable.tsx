"use client";
import { RiderBookingStatus } from "@/config/constants";
import { DELIVIRIES_TABLE_COLUMNS } from "@/config/constants/tables";
import type { Status } from "@/types";
import { getShipmentStatusDisplay, getStyleByStatus } from "@/utils/helpers";
import {
  Chip,
  cn,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@nextui-org/react";
import Link from "next/link";
import { parseAsString, useQueryStates } from "nuqs";

export function RiderBookingsTable() {
  const [filters, setFilters] = useQueryStates({
    status: parseAsString.withDefault(RiderBookingStatus.ASSIGNED),
  });

  return (
    <div>
      <Tabs
        variant="underlined"
        aria-label="Tabs variants"
        color="primary"
        classNames={{
          tabList: "w-full border-b border-divider pb-0",
          tab: "max-w-fit w-full px-0 pr-4 sm:pr-7",
          base: "w-full",
        }}
        onSelectionChange={(key) =>
          setFilters({ status: key === "all" ? "" : key.toString() })
        }
      >
        {Object.values(RiderBookingStatus).map((status) => (
          <Tab key={status} title={status} className="capitalize pb-0" />
        ))}
      </Tabs>

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
          <TableHeader columns={DELIVIRIES_TABLE_COLUMNS}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={
              <p className="text-gray-300 text-sm">There are no orders yet</p>
            }
          >
            {[]?.map((shipment: any) => {
              return (
                <TableRow key={shipment?.id}>
                  <TableCell>
                    {new Date(shipment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{shipment?.pickupCity}</TableCell>
                  <TableCell>{shipment?.pickupArea}</TableCell>
                  <TableCell>{shipment?.dropOffCity}</TableCell>
                  <TableCell>{shipment?.dropOffArea}</TableCell>

                  <TableCell>
                    <Chip
                      variant="dot"
                      className={cn("capitalize")}
                      classNames={getStyleByStatus(shipment?.status as Status)}
                    >
                      {getShipmentStatusDisplay(shipment?.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>{shipment?.senderPhone}</TableCell>
                  <TableCell>{shipment?.recipientPhone}</TableCell>

                  <TableCell>
                    <Link href={`/deliveries/${shipment?.id}`}>View</Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
