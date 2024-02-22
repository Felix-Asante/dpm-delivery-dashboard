"use client";
import { addPlaceOpeningHour } from "@/actions/place";
import TextField from "@/components/shared/input/TextField";
import HStack from "@/components/shared/layout/HStack";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { DAYS_OF_WEEK } from "@/config/constants";
import { useServerAction } from "@/hooks/useServerAction";
import { OpeningHour as OpeningHourType, OpeningHours } from "@/types";
import { Place } from "@/types/place";
import { getErrorMessage } from "@/utils/helpers";
import { Button, Radio, RadioGroup } from "@nextui-org/react";
import { TrashIcon } from "lucide-react";
import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const enum OPENING_HOURS {
	CLOSED = "closed",
	OPEN_ALL_DAY = "openAllDay",
	CUSTOM = "custom",
}

interface OpenHrs {
	status: "closed" | "openAllDay" | "custom";
	ranges: { from: string; to: string }[];
}

const transformHoursToFormValue = (value?: OpeningHourType) => {
	if (!value || value?.openAllDay) return { status: "openAllDay" };

	if (value?.closed) {
		return { status: "closed" };
	} else {
		return {
			status: "custom",
			ranges: value.ranges ?? [],
		};
	}
};

function formatOpenHours(data: { [key: string]: OpenHrs }): OpeningHours {
	const formattedHours = Object.keys(data).reduce((acc, day) => {
		if (data[day].status === "closed") {
			return { ...acc, [day]: { closed: true } };
		} else if (data[day].status === "openAllDay") {
			return { ...acc, [day]: { openAllDay: true } };
		}

		if (data[day].status === "custom" && data[day]?.ranges?.length === 0) {
			return { ...acc, [day]: { openAllDay: true } };
		}

		return {
			...acc,
			[day]: {
				ranges: data[day].ranges?.map((range) => {
					if (range?.from && range?.to)
						return { from: range?.from, to: range?.to };
				}),
			},
		};
	}, {});

	return formattedHours as OpeningHours;
}

function DisplayStatus({ status }: { status: string }) {
	if (status === "closed") {
		return <div>Closed</div>;
	} else if (status === "openAllDay") {
		return <div>Opened all day</div>;
	} else if (status === "custom") {
		return <div>Custom</div>;
	} else {
		return null;
	}
}

interface Props {
	place: Place;
}
export default function PlaceOpeningHour({ place }: Props) {
	const openingHour = place?.openingHours;

	const form = useForm({
		defaultValues: {
			monday: transformHoursToFormValue(openingHour?.monday),

			tuesday: transformHoursToFormValue(openingHour?.tuesday),

			wednesday: transformHoursToFormValue(openingHour?.wednesday),
			thursday: transformHoursToFormValue(openingHour?.thursday),

			friday: transformHoursToFormValue(openingHour?.friday),

			saturday: transformHoursToFormValue(openingHour?.saturday),

			sunday: transformHoursToFormValue(openingHour?.sunday),
		},
	});

	const [runCreateOpeningHour, { loading }] = useServerAction<
		any,
		typeof addPlaceOpeningHour
	>(addPlaceOpeningHour);

	const onSubmit = async (data: any) => {
		try {
			const payload = formatOpenHours(data);
			console.log(payload);
			const response = await runCreateOpeningHour(place.id, payload);
			if (response?.error) {
				toast.error(response?.error);
				return;
			}
			toast.success("Opening hours updated successfully");
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};
	return (
		<div>
			<HStack className='justify-end mb-4'>
				<Button
					radius='none'
					disableRipple
					color='primary'
					className='mt-6'
					onClick={form.handleSubmit(onSubmit)}
					isLoading={loading}
				>
					Save opening hours
				</Button>
			</HStack>
			<div className='mt-5 p-3 border rounded-md'>
				<Accordion type='multiple'>
					{DAYS_OF_WEEK.map((day, index) => (
						<OpeningHour
							day={day?.toLowerCase()}
							index={index}
							key={day}
							control={form.control}
							watch={form.watch}
						/>
					))}
				</Accordion>
			</div>
		</div>
	);
}

interface OpeningHourProps {
	day: string;
	index: number;
	control: any;
	watch: (key: string) => string;
}
function OpeningHour(props: OpeningHourProps) {
	const { index, day, control, watch } = props;
	const { fields, append, remove } = useFieldArray({
		name: `${day}.ranges`,
		control,
	});
	const isCustomHour = watch(`${day}.status`) === OPENING_HOURS.CUSTOM;
	return (
		<AccordionItem
			value={index?.toString()}
			className='rounded-md shadow bg-white mb-4'
		>
			<AccordionTrigger className='border-b p-5 px-8'>
				<HStack className='items-center justify-between w-full pr-3'>
					<h4 className='font-semibold text-lg capitalize'>{day}</h4>
					<DisplayStatus status={watch(`${day}.status`)} />
				</HStack>
			</AccordionTrigger>
			<AccordionContent className='px-5 py-3'>
				<Controller
					name={`${day}.status`}
					control={control}
					render={({ field }) => (
						<RadioGroup
							{...field}
							orientation='horizontal'
							classNames={{
								wrapper: "flex-row justify-between",
							}}
							// defaultValue='closed'
						>
							<Radio value='closed'>Closed</Radio>
							<Radio value='openAllDay'>Opened all day</Radio>
							<Radio value='custom'>Custom</Radio>
						</RadioGroup>
					)}
				/>
				{isCustomHour &&
					fields.map((field, index) => (
						<HStack key={field.id} className='items-center my-5'>
							<div className='w-1/2'>
								<TextField
									name={`${day}.ranges.${index}.from`}
									type='time'
									control={control}
									label='From'
									placeholder='00:00'
									labelPlacement='outside'
									variant='bordered'
									radius='sm'
								/>
							</div>
							<div className='w-1/2'>
								<TextField
									name={`${day}.ranges.${index}.to`}
									type='time'
									control={control}
									label='To'
									placeholder='00:00'
									labelPlacement='outside'
									variant='bordered'
									radius='sm'
								/>
							</div>
							<Button
								radius='sm'
								isIconOnly
								disableRipple
								color='primary'
								className='mt-6'
								onClick={() => remove(index)}
							>
								<TrashIcon />
							</Button>
						</HStack>
					))}
				{isCustomHour && (
					<HStack className='my-4 justify-center'>
						<Button onClick={append} variant='light' color='primary'>
							+ Add more
						</Button>
					</HStack>
				)}
			</AccordionContent>
		</AccordionItem>
	);
}
