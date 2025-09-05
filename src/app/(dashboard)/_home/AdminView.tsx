import React from "react";
import { getBookingsCount } from "@/actions/bookings";
import { getPlacesCount, getPopularPlaces } from "@/actions/place";
import { getSpecialsCount } from "@/actions/specials";
import { getUsersCount } from "@/actions/users";
import WithServerError from "@/components/hoc/WithServerError";
import HStack from "@/components/shared/layout/HStack";
import VStack from "@/components/shared/layout/VStack";
import { DASHBOARD_PATHS } from "@/config/routes";
import { getInitials } from "@/utils/helpers";
import { Avatar } from "@nextui-org/react";
import { BanknoteIcon, TrendingUpIcon } from "lucide-react";
import Link from "next/link";
import SalesChart from "./chart/SalesChart";
import StatisticsSection from "./StatisticsSection";

export async function HomeAdminView() {
  const [users, bookings, places, offers, popularPlaces] = await Promise.all([
    getUsersCount(),
    getBookingsCount(),
    getPlacesCount(),
    getSpecialsCount(),
    getPopularPlaces(),
  ]);

  const error =
    users.error ||
    bookings?.error ||
    places?.error ||
    offers?.error ||
    popularPlaces?.error;

  return (
    <WithServerError error={error}>
      <main className="bg-white h-screen w-full">
        <div className="px-3 sm:px-8 pt-5">
          <h3 className="text-xl">Overview</h3>
          <StatisticsSection
            totalBookings={bookings?.results!}
            totalOffers={offers.results!}
            totalPlaces={places.results!}
            totalUsers={users.results!}
          />
          <div className="grid lg:grid-cols-[75%,25%] gap-5 my-6">
            <SalesChart />
            <div className="border p-3 rounded-md max-h-fit">
              <HStack className="items-center justify-between mb-4">
                <h3 className="text-base font-semibold">Popular places</h3>
                <Link
                  href={DASHBOARD_PATHS.places.root}
                  className="text-primary"
                >
                  See all
                </Link>
              </HStack>
              {popularPlaces?.results && popularPlaces?.results?.length > 0 ? (
                <VStack className="gap-3">
                  {popularPlaces.results.slice(0, 6).map((place) => (
                    <div
                      key={place?.id}
                      className=" border p-2 bg-gray-100 rounded-sm flex items-center gap-2"
                    >
                      <Avatar
                        src={place?.logo}
                        fallback={getInitials(place?.name)}
                        size="sm"
                      />
                      <div>
                        <h3 className="text-sm font-semibold">{place?.name}</h3>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <TrendingUpIcon
                              size={20}
                              className="text-primary"
                            />
                            <p className="text-gray-400 text-sm">
                              {place?.visits}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <BanknoteIcon size={20} className="text-primary" />
                            <p className="text-gray-400 text-sm">
                              {place?.averagePrice}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </VStack>
              ) : (
                <div className="pt-5">No trending business</div>
              )}
            </div>
          </div>
          {/* <div className='border p-3 rounded-md'>Recent bookings</div> */}
        </div>
      </main>
    </WithServerError>
  );
}
