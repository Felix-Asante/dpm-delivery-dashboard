"use server";

import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { ResponseMeta, SeverActionResponse } from "@/types";
import { Shipment } from "@/types/shipment";
import { Query } from "@/types/url";
import { getErrorMessage } from "@/utils/helpers";

export interface GetShipmentsResponse {
  meta: ResponseMeta;
  items: Shipment[];
}
export async function getShipments(
  query: Query
): Promise<SeverActionResponse<GetShipmentsResponse>> {
  try {
    const endpoint = apiConfig.shipments.list(query);
    const results = await apiHandler<GetShipmentsResponse>({
      endpoint,
      method: "GET",
    });
    return { results };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getShipmentsByRider(riderId: string, query: Query) {
  try {
    const endpoint = apiConfig.shipments.get_by_rider(riderId, query);
    const results = await apiHandler<GetShipmentsResponse>({
      endpoint,
      method: "GET",
    });
    return { results };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getShipmentById(id: string) {
  try {
    const endpoint = apiConfig.shipments.get(id);
    const results = await apiHandler<Shipment>({
      endpoint,
      method: "GET",
    });
    return { results };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function updateShipmentHistory(id: string, data: FormData) {
  try {
    const endpoint = apiConfig.shipments.update_history(id);
    await apiHandler<Shipment>({
      endpoint,
      method: "PATCH",
      json: false,
      body: data,
    });
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function assignRider(shipmentId: string, riderId: string) {
  try {
    const endpoint = apiConfig.shipments.assign_rider(shipmentId, riderId);
    await apiHandler<Shipment>({
      endpoint,
      method: "PATCH",
      body: {},
    });
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
