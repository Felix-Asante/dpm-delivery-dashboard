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
