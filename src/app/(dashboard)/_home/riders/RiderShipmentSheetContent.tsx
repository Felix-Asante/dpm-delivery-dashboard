import { Shipment } from "@/types/shipment";
import { getShipmentOptionDisplay } from "@/utils/helpers";
import { Tab, Tabs, Card, CardBody } from "@nextui-org/react";
import UpdateDeliveryStatus from "../../deliveries/_sections/UpdateDeliveryStatus";
import { ShipmentStatus } from "@/config/constants";
import { OrderItem } from "../../deliveries/_sections/OrderItem";

interface Props {
  order: Shipment | null;
  onClose: () => void;
}

const blockUpdateDeliveryStatus = [
  ShipmentStatus.DELIVERED,
  ShipmentStatus.RETURNED,
];
export function RiderShipmentSheetContent({ order, onClose }: Props) {
  if (!order) return null;

  const commission = order.shipmentCost?.riderCommission ?? 0;

  const totalCost = Number(order.shipmentCost?.totalCost) || 0;

  const riderAmount = (commission / 100) * totalCost;

  const isPaid = order.shipmentCost?.paid ?? false;

  return (
    <div>
      {/* Rider Payment Card */}
      <Card
        className="mb-6 border-2 border-primary/20 shadow-lg"
        classNames={{
          base: "bg-gradient-to-br from-primary/5 to-success/5",
        }}
      >
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-default-500 font-medium mb-1">
                Your Earnings for This Order
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  ₵{riderAmount.toFixed(2)}
                </span>
                <span className="text-sm text-default-400">GHS</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  isPaid
                    ? "bg-success/20 text-success"
                    : "bg-warning/20 text-warning"
                }`}
              >
                {isPaid ? "✓ Paid" : "Pending Payment"}
              </div>
              {isPaid && order.shipmentCost?.paidAt && (
                <p className="text-xs text-default-400">
                  Paid on{" "}
                  {new Date(order.shipmentCost.paidAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
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
          <UpdateDeliveryStatus shipment={order} onSuccess={onClose} />
        </Tab>
      </Tabs>
    </div>
  );
}
