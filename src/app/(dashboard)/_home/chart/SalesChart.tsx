"use client";
import { getSales } from "@/actions/bookings";
import VStack from "@/components/shared/layout/VStack";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { theme } from "@/config/constants/theme";
import { useServerAction } from "@/hooks/useServerAction";
import { SeverActionResponse } from "@/types";
import { Sales } from "@/types/booking";
import { getAllYearsFrom } from "@/utils/formatTime";
import { formatCurrency } from "@/utils/helpers";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";

import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesChart() {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  const [runGetSales, { loading, data }] = useServerAction<
    SeverActionResponse<Sales[]>,
    typeof getSales
  >(getSales);

  useEffect(() => {
    runGetSales(selectedYear);
  }, [selectedYear]);

  const totalRevenue = useMemo(() => {
    if (!data?.results || data.results?.length === 0) {
      return 0;
    }
    return data.results.reduce(
      (previous, current) => previous + Number(current.totalamount),
      0
    );
  }, [data]);

  const chartData = useMemo(() => {
    if (!data?.results) return [];
    return Array.from(data?.results, (sale) => ({
      month: format(new Date(sale.month), "MMMM"),
      revenue: sale.totalamount,
    }));
  }, [data]);

  if (loading)
    return (
      <div className="h-[480px] rounded-xl border bg-white p-5">
        <h2 className="font-semibold text-secondary">Booking revenue</h2>
        <div className="flex h-[390px] items-center justify-center">
          <Spinner
            label="Loading revenue"
            color="primary"
            labelColor="primary"
          />
        </div>
      </div>
    );
  return (
    <div className="rounded-xl border bg-white">
      <div className="flex flex-col justify-between gap-4 border-b px-5 py-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-semibold text-secondary">Booking revenue</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Monthly revenue for the selected year
          </p>
        </div>
        <Select
          aria-label="Revenue year"
          size="sm"
          variant="bordered"
          className="w-full sm:w-28"
          selectedKeys={[selectedYear]}
          onChange={(event) => setSelectedYear(event.target.value)}
        >
          {getAllYearsFrom(2024).map((year) => (
            <SelectItem key={year.toString()}>{year.toString()}</SelectItem>
          ))}
        </Select>
      </div>
      {!data?.error ? (
        <div className="p-5">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Total revenue
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-secondary">
              {DEFAULT_CURRENCY.symbol}
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="min-h-[330px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={330}>
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    tickFormatter={(month) => month.slice(0, 3)}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="revenue"
                    fill={theme.colors.primary.DEFAULT}
                    barSize={34}
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center text-center">
                <p className="text-sm font-medium text-secondary">
                  No revenue recorded
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Booking revenue for {selectedYear} will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <VStack className="h-[400px] items-center justify-center px-5 text-center">
          <h3 className="font-semibold text-secondary">
            Revenue could not be loaded
          </h3>
          <p className="mt-1 text-sm text-gray-500">{data?.error}</p>
        </VStack>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border bg-white px-3 py-2">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-sm font-semibold text-secondary">
          {DEFAULT_CURRENCY.symbol}
          {formatCurrency(Number(payload[0].value))}
        </p>
      </div>
    );
  }

  return null;
};
