"use client";
import { Rider } from "@/types/auth";
import { Tab, Tabs } from "@nextui-org/react";
import { CarTaxiFrontIcon, ContactRoundIcon, FileTextIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import BikeInformation from "./BikeInformation";
import RiderGeneralInformation from "./RiderGeneralInformation";

export default function RiderDetailsPage({
  riderDetails,
}: {
  riderDetails: Rider;
}) {
  const { rider, ...user } = riderDetails;

  const [tab, setTab] = useQueryState("information");

  return (
    <div>
      <Tabs
        aria-label="Options"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider px-5",
          cursor: "w-full bg-primary",
          tab: "max-w-fit w-full px-0 h-12",
          tabContent: " group-data-[selected=true]:text-primary",
          base: "w-full",
        }}
        color="primary"
        variant="underlined"
        selectedKey={tab}
        onSelectionChange={(key) => setTab(key.toString())}
      >
        <Tab
          key="information"
          title={
            <div className="flex items-center space-x-2">
              <ContactRoundIcon />
              <span>General Information</span>
            </div>
          }
        >
          <RiderGeneralInformation user={user} />
        </Tab>
        <Tab
          key="bike_details"
          title={
            <div className="flex items-center space-x-2">
              <FileTextIcon />
              <span>Bike Details</span>
            </div>
          }
        >
          <BikeInformation rider={riderDetails} />
        </Tab>
        <Tab
          key="rides"
          title={
            <div className="flex items-center space-x-2">
              <CarTaxiFrontIcon />
              <span>Rides</span>
            </div>
          }
        >
          <p>Ride history</p>
        </Tab>
      </Tabs>
    </div>
  );
}
