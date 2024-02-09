"use client";
import { getPlaceService } from "@/actions/place";
import WithServerError from "@/components/hoc/WithServerError";
import HStack from "@/components/shared/layout/HStack";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Place, PlaceProducts } from "@/types/place";
import {
	Button,
	Select,
	SelectItem,
	Skeleton,
	useDisclosure,
} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import CreateServiceForm from "./CreateServiceForm";
import { getErrorMessage } from "@/utils/helpers";
import { useMemo, useState } from "react";
import EmptyContent from "@/components/shared/EmptyContent";
import PlaceServiceCard from "./PlaceServiceCard";
import { Accordion } from "@/components/ui/accordion";

interface Props {
	place: Place;
}

export default function PlaceServices({ place }: Props) {
	const form = useForm();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedService, setSelectedService] = useState<PlaceProducts | null>(
		null,
	);

	const selectedCategory = form.watch("category");
	const queryClient = useQueryClient();

	const { data, isPending, error } = useQuery({
		queryKey: [place?.id, "getPlaceService"],
		queryFn: () => getPlaceService(place?.id),
	});

	const services = useMemo(() => {
		if (selectedCategory) {
			const filteredService = data?.results?.filter(
				(service) => service.id === selectedCategory,
			);
			return filteredService?.flatMap((service) => service?.products);
		}
		return data?.results?.flatMap((service) => service?.products);
	}, [selectedCategory, data]);

	if (isPending) {
		return Array.from("load").map((l) => (
			<Skeleton className='rounded-lg mb-3' key={l}>
				<div className='h-40 rounded-lg bg-default-300'></div>
			</Skeleton>
		));
	}

	return (
		<div className='mt-6 px-3'>
			<HStack className='justify-between mb-4'>
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
							{place?.productCategory?.map((category) => (
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
					control={form.control}
				/>
				<Button disableRipple radius='sm' color='primary' onClick={onOpen}>
					Add new service
				</Button>
			</HStack>
			<WithServerError error={error?.message ?? undefined}>
				<div>
					{!services || services?.length === 0 ? (
						<EmptyContent
							title='Empty content'
							description='No services found'
						/>
					) : (
						<div>
							<Accordion type='multiple'>
								{services?.map((service, i) => (
									<PlaceServiceCard
										index={i}
										key={service?.id}
										service={service}
										defaultImg={place?.logo}
										onEdit={(service) => {
											setSelectedService(service);
											onOpen();
										}}
									/>
								))}
							</Accordion>
						</div>
					)}
				</div>
			</WithServerError>
			<div className='w-1/2'>
				<Sheet
					open={isOpen}
					onOpenChange={() => {
						onClose();
						setSelectedService(null);
						queryClient.invalidateQueries({
							queryKey: [place?.id, "getPlaceService"],
						});
					}}
				>
					<SheetContent size={"lg"}>
						<div className='px-5 py-2'>
							<h4 className='text-lg font-semibold'>Add place service</h4>
							<p className='text-gray-500 mb-5'>
								This could be place menu item, product or any service offered
							</p>
							<CreateServiceForm
								onClose={() => {
									onClose();
									setSelectedService(null);
									queryClient.invalidateQueries({
										queryKey: [place?.id, "getPlaceService"],
									});
								}}
								service={selectedService}
								mode={selectedService ? "UPDATE" : "CREATE"}
								productCategories={place?.productCategory}
							/>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
}
