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
	selectedPlace?: Place;
	selectedType?: SpecialType;
}
export default function CreateOfferContent({
	control,
	watch,
	selectedPlace,
	selectedType,
}: Props) {
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
				name='placeId'
				render={({ field }) => (
					<InfiniteScrollSelect
						url={apiConfig.places.list({})}
						getOptionLabel={(option: Place) => option?.name}
						getOptionValue={(option: Place) => option.id}
						isOptionSelected={(option: Place, selectedValue: Place[]) => {
							const isSelected = option?.id === selectedValue?.[0]?.id;
							return isSelected;
						}}
						label='Establishment'
						defaultValue={selectedPlace}
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
				minDate={(watch("start_date") as unknown as Date) || new Date()}
				name='end_date'
				control={control}
				label='Offer ending date'
				defaultValue={watch("start_date")}
			/>
			<Controller
				name='offerType'
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
						defaultValue={selectedType}
						{...field}
					/>
				)}
				control={control}
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
				name='reductionPercent'
				placeholder='Discount'
				radius='sm'
				variant='bordered'
				labelPlacement='outside'
			/>
			<div>
				<Controller
					name='description'
					control={control}
					render={({ field }) => (
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
							{...field}
						/>
					)}
				/>
			</div>
		</div>
	);
}
