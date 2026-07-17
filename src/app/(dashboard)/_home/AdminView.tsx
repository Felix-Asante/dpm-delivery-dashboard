import React from "react";
import { getBookingsCount } from "@/actions/bookings";
import { getPlacesCount, getPopularPlaces } from "@/actions/place";
import { getSpecialsCount } from "@/actions/specials";
import { getUsersCount } from "@/actions/users";
import WithServerError from "@/components/hoc/WithServerError";
import { DASHBOARD_PATHS } from "@/config/routes";
import { getInitials } from "@/utils/helpers";
import { Avatar } from "@heroui/avatar";
import { ArrowUpRight, BanknoteIcon, TrendingUpIcon } from "lucide-react";
import Link from "next/link";
import SalesChart from "./chart/SalesChart";
import StatisticsSection from "./StatisticsSection";

import { getAnalyticsDashboard } from "@/actions/analytics";
import AnalyticsStats from "./AnalyticsStats";

export async function HomeAdminView() {
  const [users, bookings, places, offers, popularPlaces, analytics] =
    await Promise.all([
      getUsersCount(),
      getBookingsCount(),
      getPlacesCount(),
      getSpecialsCount(),
      getPopularPlaces(),
      getAnalyticsDashboard(),
    ]);

  const error =
    users.error ||
    bookings?.error ||
    places?.error ||
    offers?.error ||
    popularPlaces?.error ||
    analytics?.error;

  return (
    <WithServerError error={error}>
      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-8">
          <p className="text-sm font-medium text-primary">Operations</p>
          <div className="mt-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
                Dashboard overview
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Monitor delivery performance and platform activity.
              </p>
            </div>
            <p className="text-sm text-gray-500">
              {new Intl.DateTimeFormat("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date())}
            </p>
          </div>
        </header>

        <div className="space-y-8">
          <section aria-labelledby="financial-overview">
            <div className="mb-4">
              <h2
                id="financial-overview"
                className="text-base font-semibold text-secondary"
              >
                Financial overview
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Revenue, payouts, and order volume across the platform.
              </p>
            </div>
            {analytics?.results && <AnalyticsStats data={analytics.results} />}
          </section>

          <section aria-labelledby="platform-activity">
            <div className="mb-4">
              <h2
                id="platform-activity"
                className="text-base font-semibold text-secondary"
              >
                Platform activity
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                All-time totals with current-month context.
              </p>
            </div>
            <StatisticsSection
              totalBookings={bookings?.results!}
              totalOffers={offers.results!}
              totalPlaces={places.results!}
              totalUsers={users.results!}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <SalesChart />
            <div className="h-fit rounded-xl border bg-white">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div>
                  <h2 className="font-semibold text-secondary">
                    Popular places
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Most visited businesses
                  </p>
                </div>
                <Link
                  href={DASHBOARD_PATHS.places.root}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  See all
                  <ArrowUpRight size={15} />
                </Link>
              </div>
              {popularPlaces?.results && popularPlaces?.results?.length > 0 ? (
                <div className="divide-y">
                  {popularPlaces.results.slice(0, 6).map((place) => (
                    <div
                      key={place?.id}
                      className="flex items-center gap-3 px-5 py-3.5"
                    >
                      <Avatar
                        src={place?.logo}
                        fallback={getInitials(place?.name)}
                        size="sm"
                        className="shrink-0 bg-gray-100"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-secondary">
                          {place?.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <TrendingUpIcon
                              size={14}
                              className="text-primary"
                            />
                            <p className="text-xs text-gray-500">
                              {place?.visits} visits
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BanknoteIcon size={14} className="text-primary" />
                            <p className="text-xs text-gray-500">
                              {place?.averagePrice}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-12 text-center">
                  <p className="text-sm font-medium text-secondary">
                    No place activity yet
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Popular businesses will appear as visits are recorded.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </WithServerError>
  );
}
