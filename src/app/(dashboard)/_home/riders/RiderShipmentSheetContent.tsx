import { Shipment } from "@/types/shipment";
import { getShipmentOptionDisplay } from "@/utils/helpers";
import { Tab, Tabs } from "@nextui-org/react";
import UpdateDeliveryStatus from "../../deliveries/_sections/UpdateDeliveryStatus";
import { ShipmentStatus } from "@/config/constants";
import { OrderItem } from "../../deliveries/_sections/OrderItem";

interface Props {
  order: Shipment | null;
}

const blockUpdateDeliveryStatus = [
  ShipmentStatus.DELIVERED,
  ShipmentStatus.RETURNED,
];
export function RiderShipmentSheetContent({ order }: Props) {
  if (!order) return null;

  return (
    <div>
      <Tabs
        classNames={{
          base: "w-full mb-5",
          tabList: "w-full",
        }}
      >
        <Tab key="details" title="Order details">
          <div className="grid sm:grid-cols-2 gap-4">
            <OrderItem
              label="Order Date"
              value={new Date(order.createdAt).toLocaleDateString()}
            />
            <OrderItem label="Reference" value={order.reference} />
            <OrderItem label="Pickup City" value={order.pickupCity} />
            <OrderItem label="Drop Off City" value={order.dropOffCity} />
            <OrderItem label="Pickup Area" value={order.pickupArea} />
            <OrderItem label="Drop Off Area" value={order.dropOffArea} />
            <OrderItem label="Sender Phone" value={order.senderPhone} />
            <OrderItem label="Recipient Phone" value={order.recipientPhone} />

            <OrderItem
              label="Pickup Date"
              value={
                order.pickupDate
                  ? new Date(order.pickupDate).toLocaleDateString()
                  : "-"
              }
            />
            <OrderItem
              label="Drop Off Date"
              value={
                order.dropOffDate
                  ? new Date(order.dropOffDate).toLocaleDateString()
                  : "-"
              }
            />
            <OrderItem
              label="Order option"
              value={getShipmentOptionDisplay(order.shipmentOption)}
            />
            <OrderItem label="Mode of Transport" value={order.modeOfShipment} />
            <div className="sm:col-span-2">
              <OrderItem
                label="Item Description"
                value={order?.extraInformation ?? "-"}
              />
            </div>
          </div>
        </Tab>
        <Tab
          key="update"
          title="Update Delivery"
          disabled={blockUpdateDeliveryStatus.includes(
            order.status as ShipmentStatus
          )}
        >
          <UpdateDeliveryStatus shipment={order} />
        </Tab>
      </Tabs>
    </div>
  );
}
