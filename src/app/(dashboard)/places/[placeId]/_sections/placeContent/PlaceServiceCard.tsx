import HStack from "@/components/shared/layout/HStack";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { PlaceProducts } from "@/types/place";
import { Avatar, Button } from "@nextui-org/react";
import { PenLineIcon, TrashIcon } from "lucide-react";
import React from "react";

interface Props {
	service: PlaceProducts;
	index: number;
	defaultImg: string;
	onEdit: (service: PlaceProducts) => void;
}
export default function PlaceServiceCard({
	service,
	index,
	defaultImg,
	onEdit,
}: Props) {
	return (
		<AccordionItem
			value={index?.toString()}
			className='rounded-md shadow bg-white mb-4'
		>
			<AccordionTrigger className='border-b p-5 px-8'>
				<HStack className='w-[90%] items-center justify-between'>
					<HStack className='items-center gap-6'>
						<Avatar
							isBordered
							color='primary'
							radius='lg'
							src={service?.photo ?? defaultImg}
						/>
						<div>
							<h4 className='font-semibold text-lg w-fit'>{service?.name}</h4>
							<p className='text-gray-500 text-sm text-left'>
								Price: {DEFAULT_CURRENCY.symbol}
								{service?.price}
							</p>
						</div>
					</HStack>
					<HStack className='items-center gap-2'>
						<button>
							<TrashIcon size={20} className='text-primary' />
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								onEdit(service);
							}}
						>
							<PenLineIcon size={20} className='text-secondary' />
						</button>
					</HStack>
				</HStack>
			</AccordionTrigger>
			<AccordionContent className='px-5 py-3'>
				<h5 className='font-semibold mb-2'>Description:</h5>
				{service?.description ?? "No description available"}
			</AccordionContent>
		</AccordionItem>
	);
}
