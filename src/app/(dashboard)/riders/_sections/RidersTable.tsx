"use client";
import { GetRidersResponse } from "@/actions/riders";
import TextField from "@/components/shared/input/TextField";
import HStack from "@/components/shared/layout/HStack";
import { buttonVariants } from "@/components/ui/button";
import { DASHBOARD_PATHS } from "@/config/routes";
import useQueryParams from "@/hooks/useQueryParam";
import { pluralize } from "@/utils/helpers";
import Link from "next/link";
import { useForm } from "react-hook-form";

interface RidersTableProps {
  data: GetRidersResponse;
}

export default function RidersTable({ data }: RidersTableProps) {
  const { control, watch } = useForm();
  const { query } = useQueryParams();

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
      </div>
    </div>
  );
}
