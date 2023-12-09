"use client";
import EmptyContent from "@/components/shared/EmptyContent";
import HStack from "@/components/shared/layout/HStack";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { DASHBOARD_PATHS } from "@/config/routes";
import { Place } from "@/types/place";
import {
	Avatar,
	Button,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/react";
import { PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import illustration_empty_content from "../../../../../public/svg/illustration_empty_content.svg";
import Modal from "@/components/shared/modal";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/helpers";
import { deletePlace } from "@/actions/place";
import { useServerAction } from "@/hooks/useServerAction";

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
	selectedKeys: any;
	onSelectionChange: any;
}
export default function PlaceTable({
	places,
	selectedKeys,
	onSelectionChange,
}: TableProps) {
	const [selectionBehavior, setSelectionBehavior] = useState<
		"toggle" | "replace" | undefined
	>("toggle");

	const [placeToBeDeleted, setPlaceToBeDeleted] = useState<string | null>(null);

	const [run, { loading }] = useServerAction<any, typeof deletePlace>(
		deletePlace,
	);

	const openModal = placeToBeDeleted != null && placeToBeDeleted?.length > 0;

	const closeModal = () => setPlaceToBeDeleted(null);

	const deletePlaceHandler = async () => {
		try {
			if (placeToBeDeleted) {
				await run(placeToBeDeleted);
				toast.success("Place successfully deleted");
				closeModal();
			}
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};
	return (
		<>
			<Table
				className='mt-4'
				aria-label='list of places'
				selectionMode='multiple'
				selectionBehavior={selectionBehavior}
				shadow='none'
				radius='none'
				selectedKeys={selectedKeys}
				onSelectionChange={onSelectionChange}
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
									<Avatar
										src={row?.logo}
										isBordered
										name={row?.name}
										size='sm'
									/>
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
								<HStack className='gap-2 items-center'>
									<Link href={DASHBOARD_PATHS.places.edit(row?.slug)}>
										<PencilIcon size={20} className='text-success' />
									</Link>
									<Button
										isIconOnly
										variant='light'
										size='sm'
										aria-label='delete'
										onClick={(e) => {
											e.stopPropagation();
											setPlaceToBeDeleted(row.id);
										}}
									>
										<TrashIcon size={20} className='text-danger' />
									</Button>
								</HStack>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Modal
				title='Delete place'
				description='Please note that this operation cannot be undone'
				content={
					<HStack className='justify-end gap-2'>
						<Button
							onClick={closeModal}
							variant='bordered'
							color='default'
							radius='sm'
							isDisabled={loading}
						>
							Cancel
						</Button>
						<Button
							color='primary'
							radius='sm'
							isLoading={loading}
							onClick={deletePlaceHandler}
						>
							Continue
						</Button>
					</HStack>
				}
				isOpen={openModal}
				onClose={closeModal}
			/>
		</>
	);
}
