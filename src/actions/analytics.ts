import { apiHandler } from "@/lib/apiHandler";

export interface AnalyticsDashboardResponse {
  totalRevenue: number;
  totalPayouts: number;
  pendingPayouts: number;
  totalOrders: number;
}

export const getAnalyticsDashboard = async () => {
  try {
    const results = await apiHandler<AnalyticsDashboardResponse>({
      endpoint: "analytics/dashboard",
      method: "GET",
    });

    return { results };
  } catch (error: any) {
    return { error: error?.message || "Failed to fetch analytics" };
  }
};
