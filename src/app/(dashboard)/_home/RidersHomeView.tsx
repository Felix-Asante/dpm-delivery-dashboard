import { getRiderStats } from "@/actions/riders";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { getCurrentUser } from "@/lib/auth";
import { Alert } from "@heroui/alert";
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
    <section className="py-6 sm:py-8">
      <header className="mb-7">
        <p className="text-sm font-medium text-primary">Rider workspace</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
          Welcome back, {user.fullName?.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review your assignments, earnings, and recent delivery activity.
        </p>
      </header>

      {totalAssignedOrders > 0 ? (
        <Alert
          classNames={{
            base: "mb-5 border border-primary/20 bg-primary/10",
            iconWrapper: "text-primary",
            title: "text-primary",
          }}
          title={`You have ${totalAssignedOrders} orders assigned to you`}
        />
      ) : null}
      <RidersHomeHeader wallet={wallet} />

      <div className="mt-8">
        <div className="mb-4">
          <h2 className="font-semibold text-secondary">Performance</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Your delivery activity and earnings.
          </p>
        </div>
        <div className="grid overflow-hidden rounded-xl border bg-white sm:grid-cols-2 lg:grid-cols-4 sm:[&>*:nth-child(even)]:border-l lg:[&>*+*]:border-l">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="border-b p-5 last:border-b-0 sm:nth-last-[-n+2]:border-b-0 lg:border-b-0"
            >
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="mt-3 text-2xl font-bold tracking-tight text-secondary">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="font-semibold text-secondary">Recent orders</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Track and update your latest delivery assignments.
          </p>
          <Suspense
            fallback={
              <div className="mt-4 h-48 animate-pulse rounded-xl border bg-white" />
            }
          >
            <RiderBookingsTable />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
