import React from "react";
import { Filters } from "./_sections/Filters";
import { getShipments } from "@/actions/shipment";
import WithServerError from "@/components/hoc/WithServerError";
import { ShipmentLists } from "./_sections/ShipmentLists";

interface PageProps {
  searchParams: Promise<{
    status: string;
    query: string;
  }>;
}
export default async function DeliveriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { status } = params;

  const queries = { ...params, status: status === "all" ? "" : status };
  const { results, error } = await getShipments(queries);

  return (
    <WithServerError error={error}>
      <div className="bg-gray-50 min-h-screen">
        <Filters />
        <ShipmentLists shipments={results!} />
      </div>
    </WithServerError>
  );
}
