import { DatePicker } from "@/components/shared/input/DatePicker";
import InfiniteScrollSelect from "@/components/shared/input/InfiniteScrollSelectInput";
import TextField from "@/components/shared/input/TextField";
import { apiConfig } from "@/lib/apiConfig";
import { Place } from "@/types/place";
import { SpecialType } from "@/types/specials";
import { Textarea } from "@nextui-org/react";
import React from "react";
import { Controller } from "react-hook-form";

interface Props {
	control: any;
	watch: (field: string) => string;
}
export default function CreateOfferContent({ control, watch }: Props) {
	const startDate = watch("start_date");
	console.log(startDate);
	return (
		<div className='grid md:grid-cols-2 gap-5'>
			<TextField
				control={control}
				label='Title'
				name='title'
				placeholder='Title'
				radius='sm'
				variant='bordered'
				labelPlacement='outside'
			/>
			<Controller
				name='place'
				render={({ field }) => (
					<InfiniteScrollSelect
						url={apiConfig.places.list({})}
						{...field}
						getOptionLabel={(option: Place) => option?.name}
						getOptionValue={(option: Place) => option.id}
						isOptionSelected={(option: Place, selectedValue: Place[]) => {
							const isSelected = option?.id === selectedValue?.[0]?.id;
							return isSelected;
						}}
						label='Establishment'
					/>
				)}
				control={control}
			/>
			<Controller
				name='type'
				render={({ field }) => (
					<InfiniteScrollSelect
						url={apiConfig.special_offers.list_offer_types()}
						getOptionLabel={(option: SpecialType) => option?.name}
						getOptionValue={(option: SpecialType) => option?.id}
						isOptionSelected={(
							option: SpecialType,
							selectedValue: SpecialType[],
						) => {
							const isSelected = option?.id === selectedValue?.[0]?.id;
							return isSelected;
						}}
						label='Offer Type'
						{...field}
					/>
				)}
				control={control}
			/>

			<DatePicker
				name='start_date'
				control={control}
				label='Offer starting date'
				minDate={new Date()}
			/>
			<DatePicker
				minDate={new Date()}
				name='end_date'
				control={control}
				label='Offer ending date'
			/>
			<TextField
				control={control}
				label='Price'
				name='price'
				placeholder='Price'
				radius='sm'
				variant='bordered'
				labelPlacement='outside'
			/>
			<TextField
				control={control}
				label='Discount'
				name='discount'
				placeholder='Discount'
				radius='sm'
				variant='bordered'
				labelPlacement='outside'
			/>
			<Textarea
				label='Description'
				variant='bordered'
				labelPlacement='outside'
				placeholder='Add offer description'
				disableAnimation
				classNames={{
					// base: "max-w-xs",
					input: "resize-y min-h-[40px]",
				}}
			/>
		</div>
	);
}
