import { createService, updateService } from "@/actions/services";
import FileUpload from "@/components/shared/input/FileUpload";
import TextField from "@/components/shared/input/TextField";
import HStack from "@/components/shared/layout/HStack";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { useServerAction } from "@/hooks/useServerAction";
import {
	CreateServiceDto,
	createServiceSchema,
} from "@/rules/validations/services";
import { ProductCategory } from "@/types/category";
import { PlaceProducts } from "@/types/place";
import { getErrorMessage } from "@/utils/helpers";
import { Button, Textarea } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

interface Props {
	productCategories: ProductCategory[];
	onClose?: () => void;
	service?: PlaceProducts | null;
	mode?: "CREATE" | "UPDATE";
}
export default function CreateServiceForm(props: Props) {
	const { productCategories, onClose, service, mode = "CREATE" } = props;
	const form = useReactHookForm<CreateServiceDto>(createServiceSchema);

	const [runCreateService, { loading }] = useServerAction<
		any,
		typeof createService
	>(createService);
	const [runUpdateService, { loading: updating }] = useServerAction<
		any,
		typeof updateService
	>(updateService);

	useEffect(() => {
		if (service) {
			form.setValue("productCategory", service?.id);
		}
	}, [service]);

	const onSubmit = async (data: CreateServiceDto) => {
		try {
			const formData = new FormData();
			formData.append("name", data?.name);
			formData.append("description", data?.description ?? "");
			formData.append("photo", data?.photo?.[0]);
			formData.append("price", data?.price ?? "");
			formData.append("productCategory", data?.productCategory);

			const response =
				mode === "CREATE"
					? await runCreateService(formData)
					: service
					? await runUpdateService(formData, service?.id)
					: { error: "Service not found" };

			if (response?.error) {
				toast.error(response.error);
				return;
			}
			onClose?.();
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className='flex flex-col gap-4'
		>
			<TextField
				name='name'
				control={form.control}
				label='Name'
				placeholder='Name'
				variant='bordered'
				labelPlacement='outside'
				radius='sm'
				defaultValue={service?.name ?? ""}
			/>
			<div className='relative z-[200]'>
				<Controller
					render={({ field }) => (
						<select
							className='w-full border rounded-sm p-2 h-10 shadow focus:outline-black focus:ring-1 focus:ring-black'
							value={field.value}
							onChange={field.onChange}
							defaultValue={service?.id}
							// errorMessage={}
						>
							{productCategories?.map((category) => (
								<option
									key={category?.id}
									value={category?.id}
									className='capitalize'
									selected={service?.id === category?.id}
								>
									{category?.name}
								</option>
							))}
						</select>
					)}
					name='productCategory'
					control={form.control}
				/>
				{form.formState.errors?.productCategory?.message && (
					<p className='my-px text-red-600'>
						{form.formState.errors?.productCategory?.message?.toString()}{" "}
					</p>
				)}
			</div>

			<Controller
				name='description'
				control={form.control}
				render={({ field }) => (
					<Textarea
						label='Description'
						variant='bordered'
						labelPlacement='outside'
						placeholder='Add service description'
						disableAnimation
						{...field}
						defaultValue={service?.description ?? ""}
						errorMessage={form.formState.errors?.description?.message?.toString()}
					/>
				)}
			/>
			<TextField
				name='price'
				control={form.control}
				label='Price'
				placeholder='Price'
				variant='bordered'
				labelPlacement='outside'
				radius='sm'
				type='number'
				defaultValue={service?.price ? String(service?.price) : ""}
			/>
			<FileUpload
				{...form.register("photo")}
				errorMessage={form.formState.errors?.photo?.message?.toString()}
				defaultValue={service?.photo ?? ""}
			/>
			<HStack className='items-center gap-2 mt-3'>
				<Button
					type='button'
					disableRipple
					radius='sm'
					color='secondary'
					onClick={onClose}
					isDisabled={loading || updating}
				>
					Cancel
				</Button>
				<Button
					type='submit'
					isLoading={loading || updating}
					disableRipple
					radius='sm'
					color='primary'
				>
					Create service
				</Button>
			</HStack>
		</form>
	);
}
