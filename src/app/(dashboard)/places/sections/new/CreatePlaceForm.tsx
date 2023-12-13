"use client";
import TextField from "@/components/shared/input/TextField";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { Category } from "@/types/category";
import { Button, Select, SelectItem } from "@nextui-org/react";
import React from "react";
import { Controller } from "react-hook-form";
import CreatePlaceDetails from "./CreatePlaceDetails";
import HStack from "@/components/shared/layout/HStack";
import { DASHBOARD_PATHS } from "@/config/routes";
import { CreatePlaceField, createPlaceSchema } from "@/rules/validations/place";
import FileUpload from "@/components/shared/input/FileUpload";
import { useServerAction } from "@/hooks/useServerAction";
import { addNewPlace } from "@/actions/place";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/helpers";

interface Props {
	categories: Category[];
}
export default function CreatePlaceForm({ categories }: Props) {
	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		register,
	} = useReactHookForm<CreatePlaceField>(createPlaceSchema);

	const [createPlace, { loading }] = useServerAction<any, typeof addNewPlace>(
		addNewPlace,
	);

	const onSubmit = async (data: CreatePlaceField) => {
		try {
			const {
				fullName,
				admin_phone,
				password,
				logo,
				mainImage,
				min_prep_time = "",
				max_prep_time = "",
				...placeData
			} = data;
			const formData = new FormData();

			formData.append("logo", logo[0] as unknown as File);
			formData.append("mainImage", mainImage[0] as unknown as File);
			formData.append("minPrepTime", min_prep_time?.toString() ?? "");
			formData.append("maxPrepTime", max_prep_time?.toString() ?? "");
			formData.append("placeAdminFullName", fullName);
			formData.append("placeAdminPhone", admin_phone);
			formData.append("placeAdminPassword", password);

			for (const key in placeData) {
				// @ts-ignore
				formData.append(key, placeData[key]);
			}

			await createPlace(formData);
			toast.success("New place created");
			reset();
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};
	return (
		<div className='min-h-full'>
			<HStack className='justify-between mb-4'>
				<h4 className='text-black text-xl'>Add New Place</h4>
				<HStack className='justify-end'>
					<Button
						href={DASHBOARD_PATHS.places.root}
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
				/>
				<FileUpload
					label='Place Photo'
					{...register("mainImage")}
					name='mainImage'
					errorMessage={errors?.mainImage?.message?.toString()}
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
					<TextField
						name='password'
						control={control}
						label='Password'
						placeholder='Password'
						variant='bordered'
						labelPlacement='outside'
						radius='sm'
						type='password'
					/>
				</div>
			</section>
		</div>
	);
}
