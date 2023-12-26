"use client";
import SelectInput from "@/components/shared/input/SelectInput";
import HStack from "@/components/shared/layout/HStack";
import { BookingStatus, ExportType, Periods } from "@/config/constants";
import useQueryParams from "@/hooks/useQueryParam";
import { Category } from "@/types/category";
import { getDateRange } from "@/utils/formatTime";
import { Button, Tab, Tabs } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const DateFilters = [
	{
		label: "Latest",
		key: "latest",
		value: "latest",
	},
	{
		label: "Last 7 days",
		key: Periods.last7Days,
		value: Periods.last7Days,
	},
	{
		label: "Current Month",
		key: Periods.currentMonth,
		value: Periods.currentMonth,
	},
	{
		label: "Last 3 Months",
		key: Periods.last3Months,
		value: Periods.last3Months,
	},
];

const exportFormats = [
	{ label: ExportType.pdf, value: ExportType.pdf },
	{ label: ExportType.csv, value: ExportType.csv },
];

interface SelectMenu {
	createdAt: string;
	category: string;
}

interface Props {
	categories: Category[];
}
export default function BookingListFilters({ categories }: Props) {
	const { add, addMultiple } = useQueryParams();
	const { control, watch } = useForm<SelectMenu>();

	useEffect(() => {
		add("category", watch("category"));
	}, [watch("category")]);

	useEffect(() => {
		const selectedDate = watch("createdAt");
		if (selectedDate !== "latest" && selectedDate) {
			const dateRange = getDateRange(selectedDate as Periods);
			addMultiple({
				from: dateRange[0].toISOString(),
				to: dateRange[1].toISOString(),
			});
		} else {
			addMultiple({
				from: "",
				to: "",
			});
		}
	}, [watch("createdAt")]);

	return (
		<div className='pb-3'>
			<nav className='border-b border-gray-100 p-2 pb-0'>
				<Tabs
					variant='underlined'
					aria-label='Tabs variants'
					color='primary'
					onSelectionChange={(key) =>
						add("status", key === "all" ? "" : key?.toString())
					}
				>
					<Tab key={"all"} title={"All"} className='capitalize pb-0' />
					{Object.values(BookingStatus).map((status) => (
						<Tab key={status} title={status} className='capitalize pb-0' />
					))}
				</Tabs>
			</nav>
			<HStack className='items-center justify-between p-5'>
				<HStack className='w-1/2 items-center'>
					<SelectInput
						control={control}
						name='createdAt'
						options={DateFilters}
						placeholder='Select a booking date'
					/>
					<SelectInput
						control={control}
						name='category'
						options={categories?.map((category) => ({
							label: category?.name,
							value: category?.name,
						}))}
						placeholder='Sort by category'
					/>
				</HStack>
				<Button radius='sm' disableRipple className='px-8' color='primary'>
					Export
				</Button>
			</HStack>
		</div>
	);
}
