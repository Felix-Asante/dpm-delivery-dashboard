import { getShipmentById } from "@/actions/shipment";
import WithServerError from "@/components/hoc/WithServerError";
import {
  getShipmentOptionDisplay,
  getShipmentStatusDisplay,
} from "@/utils/helpers";
import { Chip } from "@heroui/chip";
import OrderExtraDetails from "../_sections/OrderExtraDetails";
import { OrderItem } from "../_sections/OrderItem";
import { UserRoles } from "@/config/constants";
import { checkUserRole } from "@/lib/auth";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function DeliveryDetails({ params }: Readonly<PageProps>) {
  const { id } = await params;
  const { results, error } = await getShipmentById(id);

  const shipment = results!;

  const isAdmin = await checkUserRole(UserRoles.ADMIN);

  return (
    <WithServerError error={error}>
      {shipment ? (
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
          <Link
            href="/deliveries"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-secondary"
          >
            <ArrowLeft size={17} />
            Back to deliveries
          </Link>

          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wide text-primary">
                {shipment.reference}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
                Delivery details
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Created{" "}
                {new Date(shipment.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <Chip color="primary" variant="flat" className="w-fit capitalize">
              {getShipmentStatusDisplay(shipment.status, isAdmin)}
            </Chip>
          </div>

          <section className="mb-6 rounded-xl border bg-white">
            <div className="border-b px-5 py-4">
              <h2 className="font-semibold text-secondary">Delivery summary</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Route, contacts, and service information.
              </p>
            </div>

            <div className="grid border-b md:grid-cols-[1.2fr_1fr]">
              <div className="border-b p-5 md:border-b-0 md:border-r">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Route
                </p>
                <div className="grid grid-cols-[auto_1fr_auto_1fr] items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-secondary">
                      {shipment.pickupArea}
                    </p>
                    <p className="text-xs text-gray-500">
                      {shipment.pickupCity}
                    </p>
                  </div>
                  <ArrowRight size={17} className="mt-1 text-gray-300" />
                  <div>
                    <p className="text-sm font-semibold text-secondary">
                      {shipment.dropOffArea}
                    </p>
                    <p className="text-xs text-gray-500">
                      {shipment.dropOffCity}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5 p-5">
                <OrderItem label="Sender" value={shipment.senderPhone} />
                <OrderItem label="Recipient" value={shipment.recipientPhone} />
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
              <OrderItem
                label="Pickup date"
                value={
                  shipment.pickupDate
                    ? new Date(shipment.pickupDate).toLocaleDateString()
                    : "Not scheduled"
                }
              />
              <OrderItem
                label="Drop-off date"
                value={
                  shipment.dropOffDate
                    ? new Date(shipment.dropOffDate).toLocaleDateString()
                    : "Not scheduled"
                }
              />
              <OrderItem
                label="Service"
                value={getShipmentOptionDisplay(shipment.shipmentOption)}
              />
              <OrderItem label="Transport" value={shipment.modeOfShipment} />
              {shipment.extraInformation ? (
                <div className="sm:col-span-2 lg:col-span-4">
                  <OrderItem
                    label="Delivery notes"
                    value={shipment.extraInformation}
                  />
                </div>
              ) : null}
            </div>
          </section>

          <OrderExtraDetails shipment={shipment} />
        </main>
      ) : null}
    </WithServerError>
  );
}
