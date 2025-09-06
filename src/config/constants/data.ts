import { ShipmentStatus } from "./index";

export const ShipmentStatusOptions = [
  {
    label: "All",
    value: "all",
    isAdmin: true,
  },
  {
    label: "Pending",
    value: ShipmentStatus.PENDING,
    isAdmin: true,
  },
  {
    label: "Delivered",
    value: ShipmentStatus.DELIVERED,
  },
  {
    label: "Out for Delivery",
    value: ShipmentStatus.OUT_FOR_DELIVERY,
  },
  {
    label: "Pickup Confirmed",
    value: ShipmentStatus.PICKUP_CONFIRMED,
  },
  {
    label: "Failed Delivery Attempt",
    value: ShipmentStatus.FAILED_DELIVERY_ATTEMPT,
  },

  {
    label: "Rider Assigned",
    value: ShipmentStatus.RIDER_ASSIGNED,
  },
  {
    label: "Returned",
    value: ShipmentStatus.RETURNED,
  },
  {
    label: "Repackaged",
    value: ShipmentStatus.REPACKAGED,
  },
  {
    label: "On Hold",
    value: ShipmentStatus.ON_HOLD,
  },

  {
    label: "Ready for Pickup",
    value: ShipmentStatus.READY_FOR_PICKUP,
  },
  {
    label: "Refunded",
    value: ShipmentStatus.REFUNDED,
  },
  {
    label: "In Transit",
    value: ShipmentStatus.IN_TRANSIT,
  },
  {
    label: "Arrived",
    value: ShipmentStatus.ARRIVED,
  },
  {
    label: "Payment Received",
    value: ShipmentStatus.PAYMENT_RECEIVED,
  },
];

export const IdentificationDocumentTypeOptions = [
  {
    label: "Ghana Card",
    value: "ghana_card",
  },
  {
    label: "Passport",
    value: "passport",
  },
  {
    label: "Driver's License",
    value: "drivers_license",
  },
];

export const BikeTypes = [
  { value: "Aboboyaa", label: "Aboboyaa" },
  { value: "Bike", label: "Bike" },
  { value: "Van", label: "Van" },
];
