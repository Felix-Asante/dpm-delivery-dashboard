import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { RidersHomeHeader } from "./riders/RidersHomeHeader";
import { RiderBookingsTable } from "./riders/RiderBookingsTable";

export function RidersHomeView() {
  const STATS = [
    {
      label: "Total revenue",
      value: `${DEFAULT_CURRENCY.symbol} 0.00`,
    },
    {
      label: "Total deliveries",
      value: 100,
    },
    {
      label: "Cancelled Orders",
      value: 3,
    },
    {
      label: "Ratings",
      value: 4.5,
    },
  ];
  return (
    <section className="py-10">
      <RidersHomeHeader />
      <div className="mt-7">
        <h4 className="font-semibold text-lg">My stats</h4>
        <ScrollArea className="!w-full whitespace-nowrap">
          <div className="mt-3 flex items-center gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-muted rounded-lg p-4 min-w-[250px] md:min-w-0 md:flex-1"
              >
                <p className="text-gray-500 text-sm h-14">{stat.label}</p>
                <p className="font-semibold text-2xl">{stat.value}</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="mt-7">
          <h4 className="font-semibold text-lg mb-2">Recent orders</h4>
          <RiderBookingsTable />
        </div>
      </div>
    </section>
  );
}
