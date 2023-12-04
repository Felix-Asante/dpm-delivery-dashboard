import TextField from "@/components/shared/input/TextField";
import HStack from "@/components/shared/layout/HStack";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

export default function PlaceTableFilters() {
	const { control } = useForm();
	return (
		<HStack className='items-center justify-between'>
			<HStack className='items-center'>
				<Button variant='bordered' radius='sm' size='sm' disableRipple>
					All
				</Button>
				<Button
					variant='bordered'
					radius='sm'
					size='sm'
					disableRipple
					startContent={
						<span className='w-1.5 h-1.5 rounded-full bg-primary' />
					}
				>
					Verified
				</Button>
				<Select
					label='Sort by category'
					className='w-52 max-w-xs'
					size='sm'
					radius='sm'
					variant='bordered'
				>
					{[
						{ label: "Restaurants", id: "1" },
						{ label: "Salons", id: "2" },
					].map((category) => (
						<SelectItem key={category.id} value={category.id}>
							{category.label}
						</SelectItem>
					))}
				</Select>
			</HStack>
			<TextField
				name='search'
				control={control}
				size='sm'
				radius='sm'
				placeholder='Search by place'
				startContent={<SearchIcon className='text-gray-400' size={20} />}
				className='w-64'
				variant='bordered'
			/>
		</HStack>
	);
}
