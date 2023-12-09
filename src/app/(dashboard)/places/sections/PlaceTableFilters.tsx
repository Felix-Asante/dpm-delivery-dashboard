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
export default function PlaceTableFilters({
	categories,
}: {
	categories: Category[];
}) {
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
		<HStack className='items-center justify-between'>
			<HStack className='items-center'>
				{categories?.length > 0 && (
					<Controller
						render={({ field }) => (
							<Select
								label='Sort by category'
								className='w-52 max-w-xs'
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
					className='w-64'
					variant='bordered'
				/>
			</HStack>
			<Button color='danger' disableRipple radius='sm' disabled>
				Delete places
			</Button>
		</HStack>
	);
}
