import TextField from "@/components/shared/input/TextField";
import HStack from "@/components/shared/layout/HStack";
import useDebounce from "@/hooks/useDebounce";
import useQueryParams from "@/hooks/useQueryParam";
import { Category } from "@/types/category";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface FormFields {
	search: string;
	category: string;
}
interface Props {
	categories: Category[];
	disableDelete: boolean;
	onDelete: () => void;
	deleting: boolean;
}
export default function PlaceTableFilters({
	categories,
	disableDelete,
	onDelete,
	deleting,
}: Props) {
	const { control, watch } = useForm<FormFields>();

	const search = useDebounce(watch("search"), 1000);
	const category = watch("category");

	const { add, remove } = useQueryParams();

	useEffect(() => {
		search ? add("search", search) : remove("search");
	}, [search]);

	useEffect(() => {
		category ? add("category", category) : remove("category");
	}, [category]);

	return (
		<HStack className='flex-col md:flex-row md:items-center justify-between'>
			<HStack className='flex-col md:flex-row md:items-center'>
				{categories?.length > 0 && (
					<Controller
						render={({ field }) => (
							<Select
								label='Sort by category'
								className='md:w-52 max-w-xs'
								size='sm'
								radius='sm'
								variant='bordered'
								value={field.value}
								onChange={field.onChange}
							>
								{categories?.map((category) => (
									<SelectItem
										key={category?.id}
										value={category?.id}
										className='capitalize'
									>
										{category?.name}
									</SelectItem>
								))}
							</Select>
						)}
						name='category'
						control={control}
					/>
				)}
				<TextField
					name='search'
					control={control}
					size='sm'
					radius='sm'
					placeholder='Search by place'
					startContent={<SearchIcon className='text-gray-400' size={20} />}
					className='md:w-64'
					variant='bordered'
				/>
			</HStack>
			<Button
				color='danger'
				disableRipple
				radius='sm'
				isDisabled={disableDelete}
				isLoading={deleting}
				onClick={onDelete}
			>
				Delete places
			</Button>
		</HStack>
	);
}
