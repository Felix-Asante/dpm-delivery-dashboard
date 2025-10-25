export interface SetShipmentCostDto {
  pickupFee: number;
  deliveryFee: number;
  riderCommission: number;
  repackagingFee?: number;
  paid?: boolean;
  paidAt?: string;
}
