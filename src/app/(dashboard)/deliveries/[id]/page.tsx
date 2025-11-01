import { getShipmentById } from "@/actions/shipment";
import WithServerError from "@/components/hoc/WithServerError";
import {
  getShipmentOptionDisplay,
  getShipmentStatusDisplay,
} from "@/utils/helpers";
import { Chip } from "@nextui-org/react";
import OrderExtraDetails from "../_sections/OrderExtraDetails";
import { OrderItem } from "../_sections/OrderItem";
import { UserRoles } from "@/config/constants";
import { checkUserRole } from "@/lib/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function DeliveryDetails({ params }: PageProps) {
  const { id } = await params;
  const { results, error } = await getShipmentById(id);

  const shipment = results!;

  const isAdmin = await checkUserRole(UserRoles.ADMIN);

  return (
    <WithServerError error={error}>
      <div>
        <div className="max-w-4xl 2xl:max-w-5xl p-4 mx-auto mt-10 h-full">
          <div className="bg-gray-100 h-full p-8">
            <h3 className="font-semibold text-xl mb-4">Order Details</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <OrderItem
                label="Order Date"
                value={new Date(shipment.createdAt).toLocaleDateString()}
              />
              <OrderItem label="Reference" value={shipment.reference} />
              <OrderItem label="Pickup City" value={shipment.pickupCity} />
              <OrderItem label="Drop Off City" value={shipment.dropOffCity} />
              <OrderItem label="Pickup Area" value={shipment.pickupArea} />
              <OrderItem label="Drop Off Area" value={shipment.dropOffArea} />
              <OrderItem label="Sender Phone" value={shipment.senderPhone} />
              <OrderItem
                label="Recipient Phone"
                value={shipment.recipientPhone}
              />

              <OrderItem
                label="Pickup Date"
                value={
                  shipment.pickupDate
                    ? new Date(shipment.pickupDate).toLocaleDateString()
                    : "-"
                }
              />
              <OrderItem
                label="Drop Off Date"
                value={
                  shipment.dropOffDate
                    ? new Date(shipment.dropOffDate).toLocaleDateString()
                    : "-"
                }
              />
              <OrderItem
                label="Shipment Option"
                value={getShipmentOptionDisplay(shipment.shipmentOption)}
              />
              <OrderItem
                label="Mode of Transport"
                value={shipment.modeOfShipment}
              />
              <div className="sm:col-span-2">
                <OrderItem
                  label="Item Description"
                  value={shipment?.extraInformation ?? "-"}
                />
              </div>
              <div>
                <p className="font-semibold text-gray-500 text-sm mb-1">
                  Status
                </p>
                <Chip color="primary">
                  {getShipmentStatusDisplay(shipment.status, isAdmin)}
                </Chip>
              </div>
            </div>
          </div>

          <OrderExtraDetails shipment={shipment} />
        </div>
      </div>
    </WithServerError>
  );
}
