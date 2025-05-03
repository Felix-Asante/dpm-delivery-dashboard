import { Filters } from "@/app/(dashboard)/deliveries/_sections/Filters";
import { useQueryState } from "nuqs";
import { getShipmentsByRider } from "@/actions/shipment";
import { useQuery } from "@tanstack/react-query";
import WithServerError from "@/components/hoc/WithServerError";
import { ShipmentLists } from "@/app/(dashboard)/deliveries/_sections/ShipmentLists";

export function RiderOrderHistory({ riderId }: { riderId: string }) {
  const [status] = useQueryState("status", { shallow: false });
  const [query] = useQueryState("query", { shallow: false });

  const queries = {
    status: status === "all" ? "" : status || "",
    query: query || "",
  };

  const { data, isPending } = useQuery({
    queryKey: ["shipments", riderId, status, query],
    queryFn: () => getShipmentsByRider(riderId, queries),
  });

  return (
    <WithServerError error={data?.error}>
      <Filters />
      {isPending ? (
        <p>Fetching orders...</p>
      ) : (
        <ShipmentLists shipments={data?.results!} />
      )}
    </WithServerError>
  );
}
