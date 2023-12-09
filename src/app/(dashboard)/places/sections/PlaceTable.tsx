"use client";
import EmptyContent from "@/components/shared/EmptyContent";
import HStack from "@/components/shared/layout/HStack";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { DASHBOARD_PATHS } from "@/config/routes";
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
import { PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import illustration_empty_content from "../../../../../public/svg/illustration_empty_content.svg";

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

				<TableColumn />
			</TableHeader>
			<TableBody
				emptyContent={
					<EmptyContent
						img={illustration_empty_content}
						title=''
						description='No places added'
					/>
				}
			>
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
						<TableCell>
							<HStack>
								<Link href={DASHBOARD_PATHS.places.edit(row?.slug)}>
									<PencilIcon size={20} className='text-success' />
								</Link>
								<TrashIcon size={20} className='text-danger' />
							</HStack>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
