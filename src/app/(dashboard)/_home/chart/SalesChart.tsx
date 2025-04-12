"use client";
import { getSales } from "@/actions/bookings";
import HStack from "@/components/shared/layout/HStack";
import VStack from "@/components/shared/layout/VStack";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { theme } from "@/config/constants/theme";
import { useServerAction } from "@/hooks/useServerAction";
import { SeverActionResponse } from "@/types";
import { Sales } from "@/types/booking";
import { getAllYearsFrom } from "@/utils/formatTime";
import { cn, formatCurrency } from "@/utils/helpers";
import {
  Button,
  Popover,
  PopoverContent,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CellData {
  month: string;
  revenue: string;
}
export default function SalesChart() {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedCell, setSelectedCell] = useState(0);

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

  const onCellSelect = (data: CellData, index: number) => {
    setSelectedCell(index);
  };

  if (loading)
    return (
      <div className="rounded-md p-3  border h-48">
        <h3>Booking Sales</h3>
        <div className="flex flex-col h-full items-center">
          <Spinner
            label="Retrieving sales"
            color="primary"
            labelColor="primary"
          />
        </div>
      </div>
    );
  return (
    <div className="rounded-md p-3  border">
      <h3>Booking Sales</h3>
      {!data?.error ? (
        <>
          <HStack className="items-center justify-between mt-3">
            <div>
              <p className="text-sm text-gray-400">Total Amount</p>
              <h3 className="text-2xl font-semibold my-1">
                {DEFAULT_CURRENCY.symbol}
                {formatCurrency(totalRevenue)}
              </h3>
            </div>
            <Select
              size="sm"
              variant="bordered"
              className="max-w-[15%]"
              defaultSelectedKeys={[selectedYear]}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {getAllYearsFrom(2024).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year.toString()}
                </SelectItem>
              ))}
            </Select>
          </HStack>
          <div className="mt-10">
            {chartData.length > 0 ? (
              <ResponsiveContainer width={"100%"} height={350}>
                <BarChart width={150} height={80} data={chartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="revenue"
                    onClick={onCellSelect}
                    barSize={110}
                    className="relative before:absolute before:w-[100px] before:h-full before:top-0 before:left-0 before:bg-primary before:px-3 before:pt-2 before:shadow-md"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        cursor="pointer"
                        fill={theme.colors.success.DEFAULT}
                        key={`cell-${index}`}
                        // style={{ backgroundColor: "white", padding: 15 }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-primary font-semibold text-center">
                There&apos;s no data to show for this year
              </p>
            )}
          </div>
        </>
      ) : (
        <VStack className="items-center py-4">
          <h3 className="text-lg">Something went wrong</h3>
          <p className="text-gray-400">{data?.error}</p>
        </VStack>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active) {
    // Custom tooltip content goes here
    return (
      <div className="bg-white p-2 rounded-md shadow-sm">
        <p>{`Label: ${label}`}</p>
        {payload.map(
          (
            data: { dataKey: any; value: any },
            index: React.Key | null | undefined
          ) => (
            <p key={index}>{`${data.dataKey}: ${data.value}`}</p>
          )
        )}
      </div>
    );
  }

  return null;
};
