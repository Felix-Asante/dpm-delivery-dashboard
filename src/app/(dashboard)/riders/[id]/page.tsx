import React from "react";
import RiderDetailsPage from "../_sections/details";
import { getRider } from "@/actions/riders";
import WithServerError from "@/components/hoc/WithServerError";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RiderPage({ params }: PageProps) {
  const { id } = await params;
  const rider = await getRider(id);
  const error = rider?.error;

  return (
    <WithServerError error={error}>
      <div className="bg-white h-screen">
        <RiderDetailsPage riderDetails={rider?.results!} />
      </div>
    </WithServerError>
  );
}
