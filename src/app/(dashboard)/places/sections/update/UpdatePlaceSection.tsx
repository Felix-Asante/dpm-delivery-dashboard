"use client";
import HStack from "@/components/shared/layout/HStack";
import { DASHBOARD_PATHS } from "@/config/routes";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import CreatePlaceDetails from "../new/CreatePlaceDetails";
import FileUpload from "@/components/shared/input/FileUpload";
import TextField from "@/components/shared/input/TextField";
import { Place } from "@/types/place";
import { Category } from "@/types/category";
import { User } from "@/types/auth";
import { UpdatePlaceField, UpdatePlaceSchema } from "@/rules/validations/place";
import { toast } from "sonner";
import {
	getErrorMessage,
	removeEmptyFields,
	removeFromObject,
} from "@/utils/helpers";
import { useServerAction } from "@/hooks/useServerAction";
import { updatePlace } from "@/actions/place";

interface Props {
	place: Place;
	categories: Category[];
	admin: User;
}

const fieldsToRemove = [
	"id",
	"createdAt",
	"deletedAt",
	"updatedAt",
	"productCategory",
	"logo",
	"mainImage",
];

export default function UpdatePlaceSection({
	categories,
	place,
	admin,
}: Props) {
	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
		register,
		setValue,
	} = useReactHookForm<UpdatePlaceField>(UpdatePlaceSchema);

	const [runUpdatePlace, { loading }] = useServerAction<
		any,
		typeof updatePlace
	>(updatePlace);

	const router = useRouter();

	const defaultValue = useMemo(() => {
		return {
			name: place?.name,
			category: place?.category?.id,
			phone: place?.phone,
			email: place?.email,
			address: place?.address,
			latitude: place?.latitude,
			longitude: place?.longitude,
			website: place?.website,
			averagePrice: place?.averagePrice,
			deliveryFee: place?.deliveryFee!,
			min_prep_time: place?.minPrepTime!,
			max_prep_time: place?.maxPrepTime!,
			fullName: admin?.fullName,
			admin_phone: admin?.phone,
		};
	}, [place]);
	useEffect(() => {
		if (defaultValue) {
			for (const key in defaultValue) {
				// @ts-ignore
				setValue(key, defaultValue[key]);
			}
		}
	}, [defaultValue]);

	const onSubmit = async (data: UpdatePlaceField) => {
		try {
			const payload = {
				...removeFromObject(place, fieldsToRemove),
				...removeEmptyFields(data),
			};
			const formData = new FormData();
			if (payload?.logo) {
				formData.append("logo", payload?.logo[0] as unknown as File);
			}
			if (payload?.mainImage) {
				formData.append("mainImage", payload?.mainImage[0] as unknown as File);
			}

			formData.append("minPrepTime", payload?.min_prep_time ?? "");
			formData.append("maxPrepTime", payload?.max_prep_time ?? "");
			for (const key in payload) {
				formData.append(key, payload[key]);
			}

			const response = await runUpdatePlace(formData, place?.id);
			if (response?.error) {
				toast.error(response.error);
				return;
			}
			toast.success("place updated successfully");
			router.push(DASHBOARD_PATHS.places.root);
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};
	return (
		<div className='min-h-full'>
			<HStack className='justify-between mb-4'>
				<h4 className='text-black text-xl'>Update place</h4>
				<HStack className='justify-end'>
					<Button
						onClick={() => router.push(DASHBOARD_PATHS.places.root)}
						variant='bordered'
						color='success'
						radius='none'
						size='sm'
						isDisabled={loading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit(onSubmit)}
						color='primary'
						radius='none'
						size='sm'
						isDisabled={!isValid}
						isLoading={loading}
					>
						Save
					</Button>
				</HStack>
			</HStack>
			<div className='bg-white p-5 grid grid-cols-1 sm:grid-cols-2 gap-6'>
				<CreatePlaceDetails
					categories={categories}
					control={control}
					categoryErrorMessage={errors?.category?.message}
				/>
				<FileUpload
					label='Logo'
					{...register("logo")}
					name='logo'
					errorMessage={errors?.logo?.message?.toString()}
					defaultValue={place?.logo}
				/>
				<FileUpload
					label='Place Photo'
					{...register("mainImage")}
					name='mainImage'
					errorMessage={errors?.mainImage?.message?.toString()}
					defaultValue={place?.mainImage}
				/>
			</div>
			<section className='mt-5'>
				<h4 className='text-black text-xl mb-3'>Place Admin Details</h4>
				<div className=' bg-white p-5 grid grid-cols-1 sm:grid-cols-2 gap-6 gap-y-5'>
					<TextField
						name='fullName'
						control={control}
						label='Full Name'
						placeholder='Full Name'
						variant='bordered'
						labelPlacement='outside'
						radius='sm'
					/>
					<TextField
						name='admin_phone'
						control={control}
						label='Phone'
						placeholder='Phone'
						variant='bordered'
						labelPlacement='outside'
						radius='sm'
						type='phone'
					/>
				</div>
			</section>
		</div>
	);
}
