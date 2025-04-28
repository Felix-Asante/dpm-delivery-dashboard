import { Rider } from "./auth";

export interface Shipment {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  pickupAddress: string;
  senderPhone: string;
  pickupDate: any;
  dropOffAddress: string;
  recipientPhone: string;
  dropOffDate: any;
  extraInformation: string;
  shipmentOption: string;
  modeOfShipment: string;
  status: string;
  reference: string;
  rider: Rider | null;
  history: ShipmentHistory[];
}

export type ShipmentHistory = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  status: string;
  description: any;
  data: HistoryData;
};

export type HistoryData = Record<string, any>;
