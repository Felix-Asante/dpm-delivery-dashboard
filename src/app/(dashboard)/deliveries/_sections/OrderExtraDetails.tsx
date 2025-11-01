"use client";
import { Shipment, ShipmentHistory } from "@/types/shipment";
import {
  getIconByShipmentStatus,
  getShipmentStatusDisplay,
} from "@/utils/helpers";
import { Tab, Tabs } from "@nextui-org/react";
import { HistoryIcon, TruckIcon } from "lucide-react";
import Image from "next/image";
import { EditOrder } from "./EditOrder";
import AddDeliveryCostForm from "./AddDeliveryCostForm";
import { useSession } from "next-auth/react";
import { UserRoles } from "@/config/constants";

interface Props {
  shipment: Shipment;
}
export default function OrderExtraDetails({ shipment }: Props) {
  return (
    <div className="mt-6 rounded-lg bg-white p-4">
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
      >
        <Tab
          key="delivery_fees"
          title={
            <div className="flex items-center space-x-2">
              <HistoryIcon size={20} />
              <span>Delivery Fees</span>
            </div>
          }
        >
          <AddDeliveryCostForm shipment={shipment} />
        </Tab>
        <Tab
          key="information"
          title={
            <div className="flex items-center space-x-2">
              <TruckIcon size={20} />
              <span>Extra Details</span>
            </div>
          }
        >
          <EditOrder shipment={shipment} />
        </Tab>
        <Tab
          key="order_history"
          title={
            <div className="flex items-center space-x-2">
              <HistoryIcon size={20} />
              <span>Order History</span>
            </div>
          }
        >
          <OrderHistory history={shipment.history} />
        </Tab>
      </Tabs>
    </div>
  );
}

function OrderHistory({ history }: { history: ShipmentHistory[] }) {
  const { data: session } = useSession();
  const role = session?.user?.role.name as UserRoles;

  const isAdmin = role === UserRoles.ADMIN;

  return (
    <ol className="relative border-l border-gray-200 mt-3">
      {history.map((item, index) => {
        const StatusIcon = getIconByShipmentStatus(item.status);
        return (
          <li
            className={`mb-10 ml-6 ${
              index === history.length - 1 ? "pb-0" : "pb-4"
            }`}
            key={index}
          >
            <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-3 ring-8 ring-white">
              <StatusIcon className="w-5 h-5 text-white" />
            </span>
            <div className="px-4">
              <div className="mb-2">
                <h3 className="font-medium text-primary">
                  {getShipmentStatusDisplay(item.status, isAdmin)}
                </h3>
                <time className="text-sm font-normal text-gray-500">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "-"}
                </time>
              </div>
              {item.data?.rider_name && (
                <p className="text-sm font-normal text-gray-500 mb-1">
                  Rider: {item.data.rider_name}
                </p>
              )}
              {item.data?.old_rider_name && (
                <p className="text-sm font-normal text-gray-500 mb-1">
                  Previous Rider: {item.data.old_rider_name}
                </p>
              )}
              {item.data?.new_rider_name && (
                <p className="text-sm font-normal text-gray-500 mb-1">
                  New Rider: {item.data.new_rider_name}
                </p>
              )}
              {item.description && (
                <p className="mb-1 text-sm font-normal text-gray-500 lg:w-3/4">
                  {item.description}
                </p>
              )}
              {Object.keys(item.data).length > 0 && (
                <div className="mt-2">
                  {item.data?.photo && (
                    <div>
                      <Image
                        src={item.data.photo}
                        alt="Photo"
                        className="w-20 h-20 rounded-md object-cover"
                        width={80}
                        height={80}
                      />
                      <a
                        href={item.data.photo}
                        target="_blank"
                        className="font-medium text-sm"
                      >
                        Expand photo
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
