"use client";
import { GetRidersResponse } from "@/actions/riders";
import EmptyContent from "@/components/shared/EmptyContent";
import TextField from "@/components/shared/input/TextField";
import HStack from "@/components/shared/layout/HStack";
import { buttonVariants } from "@/components/ui/button";
import { DASHBOARD_PATHS } from "@/config/routes";
import useQueryParams from "@/hooks/useQueryParam";
import { pluralize } from "@/utils/helpers";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

const columns = [
  { label: "ID", key: "riderId" },
  { label: "Joined at", key: "JoinedAt" },
  { label: "Full Name", key: "name" },
  { label: "Phone", key: "phone" },
  { label: "Email", key: "email" },
  { label: "Status", key: "status" },
  {
    label: "Identification Document Number",
    key: "identificationDocumentNumber",
  },
  { label: "Identification Document Type", key: "identificationDocumentType" },
  { label: "Document Expiry Date", key: "documentExpiryDate" },
  { label: "", key: "" },
];

interface RidersTableProps {
  data: GetRidersResponse;
}

export default function RidersTable({ data }: RidersTableProps) {
  const { control, watch } = useForm();
  const { query } = useQueryParams();
  const [selectionBehavior, setSelectionBehavior] = useState<
    "toggle" | "replace" | undefined
  >("toggle");
  const [selectedRiders, setSelectedRiders] = useState<Set<string>>(
    new Set([])
  );

  const totalRiders = data?.meta?.totalItems;
  const riders = data?.items;

  return (
    <div>
      <div className="mb-3">
        <h3 className="font-semibold text-xl">
          {totalRiders} {pluralize("Rider", totalRiders)}
        </h3>
        <p className="text-gray-400">List of all riders</p>
      </div>
      <div className="border rounded-md p-3">
        <HStack className="items-center justify-between">
          <TextField
            name="search"
            placeholder="Search by user name"
            control={control}
            variant="bordered"
            radius="sm"
            size="md"
            className="md:w-[350px]"
            defaultValue={query?.search ?? ""}
          />
          <Link
            href={DASHBOARD_PATHS.riders.new}
            className={buttonVariants({ variant: "default" })}
          >
            Add Rider
          </Link>
        </HStack>
        <Table
          className="mt-4"
          aria-label="list of users"
          selectionMode="multiple"
          selectionBehavior={selectionBehavior}
          shadow="none"
          radius="none"
          selectedKeys={selectedRiders}
          // @ts-ignore
          onSelectionChange={setSelectedRiders}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={
              <EmptyContent title="" description="Riders not found" />
            }
          >
            {riders?.map((rider) => (
              <TableRow key={rider?.id}>
                <TableCell>{rider?.rider?.riderId}</TableCell>
                <TableCell>
                  {new Date(rider?.createdAt)?.toLocaleDateString()}
                </TableCell>
                <TableCell>{rider?.fullName}</TableCell>
                <TableCell>{rider?.phone}</TableCell>
                <TableCell>{rider?.email}</TableCell>
                <TableCell>
                  <Chip variant="dot" color="primary">
                    {rider?.isVerified ? "Verified" : "Not Verified"}
                  </Chip>
                </TableCell>
                <TableCell>
                  {rider?.rider?.identificationDocumentNumber}
                </TableCell>
                <TableCell>
                  {rider?.rider?.identificationDocumentType}
                </TableCell>
                <TableCell>
                  {new Date(
                    rider?.rider?.documentExpiryDate
                  )?.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Link href={DASHBOARD_PATHS.riders.get(rider?.id)}>
                    <EyeIcon className="text-gray-400" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
