import { getRiderStats } from "@/actions/riders";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { getCurrentUser } from "@/lib/auth";
import { Alert } from "@nextui-org/react";
import { Suspense } from "react";
import { RiderBookingsTable } from "./riders/RiderBookingsTable";
import { RidersHomeHeader } from "./riders/RidersHomeHeader";
import { getUserWallet } from "@/actions/users";

export async function RidersHomeView() {
  const user = await getCurrentUser();

  if (!user?.id) {
    return;
  }

  const [stats, walletResponse] = await Promise.all([
    getRiderStats(user?.id),
    getUserWallet(),
  ]);

  const wallet = walletResponse?.results;
  const totalRevenue = wallet?.totalEarned ? +wallet.totalEarned : 0;
  const totalAssignedOrders = stats?.results?.total_orders_assigned || 0;

  const STATS = [
    {
      label: "Total revenue",
      value: `${DEFAULT_CURRENCY.symbol} ${totalRevenue.toFixed(2)}`,
    },
    {
      label: "Total deliveries today",
      value: stats?.results?.total_deliveries_today || 0,
    },
    {
      label: "Total deliveries",
      value: stats?.results?.total_orders_delivered || 0,
    },
    {
      label: "Cancelled Orders",
      value: stats?.results?.total_orders_cancelled || 0,
    },
  ];

  return (
    <section className="py-10">
      {totalAssignedOrders > 0 ? (
        <Alert
          // color="primary"
          classNames={{
            base: "mb-5 bg-primary/15",
            iconWrapper: "text-primary",
            title: "text-primary",
          }}
          title={`You have ${totalAssignedOrders} orders assigned to you`}
        />
      ) : null}
      <RidersHomeHeader wallet={wallet} />
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
          <Suspense fallback={<p>Loading orders...</p>}>
            <RiderBookingsTable />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
