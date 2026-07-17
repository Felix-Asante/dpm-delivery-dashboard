import { getShipments } from "@/actions/shipment";
import WithServerError from "@/components/hoc/WithServerError";
import { ShipmentLists } from "./_sections/ShipmentLists";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    query?: string;
    page?: string;
  }>;
}
export default async function DeliveriesPage({
  searchParams,
}: Readonly<PageProps>) {
  const params = await searchParams;
  const { status } = params;

  const queries = {
    ...(params.query ? { query: params.query } : {}),
    ...(params.page ? { page: params.page } : {}),
    ...(status && status !== "all" ? { status } : {}),
  };
  const { results, error } = await getShipments(queries);

  return (
    <WithServerError error={error}>
      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6">
          <p className="text-sm font-medium text-primary">Operations</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
            Deliveries
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track orders, manage assignments, and move each delivery forward.
          </p>
        </header>
        {results ? <ShipmentLists shipments={results} /> : null}
      </main>
    </WithServerError>
  );
}
