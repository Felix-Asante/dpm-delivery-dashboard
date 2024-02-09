import { deleteService } from "@/actions/services";
import HStack from "@/components/shared/layout/HStack";
import Modal from "@/components/shared/modal";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { useServerAction } from "@/hooks/useServerAction";
import { PlaceProducts } from "@/types/place";
import { getErrorMessage } from "@/utils/helpers";
import { Avatar, Button, useDisclosure } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { PenLineIcon, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

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
	const { isOpen, onOpen, onClose } = useDisclosure();
	const params = useParams();

	const [runDeleteService, { loading }] = useServerAction<
		any,
		typeof deleteService
	>(deleteService);

	const queryClient = useQueryClient();

	const onDelete = async () => {
		try {
			const response = await runDeleteService(service?.id);
			if (response?.error) {
				toast.error(getErrorMessage(response.error));
				return;
			}
			toast.success("Service deleted successfully");
			queryClient.invalidateQueries({
				queryKey: [params?.placeId, "getPlaceService"],
			});
			onClose();
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	return (
		<>
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
							<button
								onClick={(e) => {
									e.stopPropagation();
									onOpen();
								}}
							>
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

			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title='Delete service'
				description='Do you really want to delete this service? Note that 
            this operation cannot be undone'
				content={
					<HStack className='items-center gap-2'>
						<Button
							color='secondary'
							disableRipple
							radius='sm'
							isDisabled={loading}
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							color='primary'
							disableRipple
							radius='sm'
							isLoading={loading}
							onClick={onDelete}
						>
							Continue
						</Button>
					</HStack>
				}
			/>
		</>
	);
}
