import { getRiders } from "@/actions/riders";
import React from "react";
import RidersTable from "./_sections/RidersTable";
import WithServerError from "@/components/hoc/WithServerError";

interface PageProps {
  searchParams: Promise<{ search: string }>;
}

export default async function RidersPage({ searchParams }: PageProps) {
  const { search = "" } = await searchParams;
  const riders = await getRiders({ query: search });

  return (
    <WithServerError error={riders?.error}>
      <div className="bg-white h-screen w-full px-5 pt-5">
        <RidersTable data={riders?.results!} />
      </div>
    </WithServerError>
  );
}
