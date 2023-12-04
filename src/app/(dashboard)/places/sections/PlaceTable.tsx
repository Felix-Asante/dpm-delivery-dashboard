"use client";
import HStack from "@/components/shared/layout/HStack";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { Place } from "@/types/place";
import {
	Avatar,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/react";
import React, { useState } from "react";

const columns = [
	{
		key: "name",
		label: "NAME",
	},
	{
		key: "Address",
		label: "ADDRESS",
	},
	{
		key: "category",
		label: "CATEGORY",
	},
	{
		key: "delivery fee",
		label: "DELIVERY FEE",
	},
];

interface TableProps {
	places: Place[];
}
export default function PlaceTable({ places }: TableProps) {
	const [selectionBehavior, setSelectionBehavior] = useState<
		"toggle" | "replace" | undefined
	>("toggle");

	return (
		<Table
			className='mt-4'
			aria-label='list of places'
			selectionMode='multiple'
			selectionBehavior={selectionBehavior}
			shadow='none'
			radius='none'
		>
			<TableHeader>
				{columns.map((column) => (
					<TableColumn key={column.key}>{column.label}</TableColumn>
				))}
			</TableHeader>
			<TableBody>
				{places.map((row) => (
					<TableRow key={row.id}>
						<TableCell>
							<HStack className='items-center'>
								<Avatar src={row?.logo} isBordered name={row?.name} size='sm' />
								<div>
									<p>{row?.name}</p>
									<p className='text-gray-400'>{row?.email}</p>
								</div>
							</HStack>
						</TableCell>
						<TableCell>{row?.address}</TableCell>
						<TableCell>{row?.category?.name}</TableCell>
						<TableCell>
							{DEFAULT_CURRENCY.symbol} {row?.deliveryFee}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
