import { ShipmentStatus } from "./index";

export const ShipmentStatusOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Pending",
    value: ShipmentStatus.PENDING,
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
