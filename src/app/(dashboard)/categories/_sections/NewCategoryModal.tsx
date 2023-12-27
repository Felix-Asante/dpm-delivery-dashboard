import { createCategory, updateCategory } from "@/actions/category";
import FileUpload from "@/components/shared/input/FileUpload";
import TextField from "@/components/shared/input/TextField";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { useServerAction } from "@/hooks/useServerAction";
import {
	CreateCategoryFields,
	UpdateCategoryField,
	UpdateCategorySchema,
	createCategorySchema,
} from "@/rules/validations/category";
import { createPlaceSchema } from "@/rules/validations/place";
import { ModalProps } from "@/types";
import { Category } from "@/types/category";
import { getErrorMessage } from "@/utils/helpers";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = ModalProps & { category: Category | null };
type Types = CreateCategoryFields | UpdateCategoryField;

export default function NewCategoryModal({
	isOpen,
	onClose,
	mode = "create",
	category,
}: Props) {
	const schema =
		mode === "create" ? createCategorySchema : UpdateCategorySchema;
	const {
		handleSubmit,
		control,
		setValue,
		register,
		formState: { isValid, touchedFields },
		reset,
	} = useReactHookForm<Types>(schema, { name: category?.name ?? "" });

	const title = mode === "create" ? "Add new category" : "Update category";

	const [runCreateCategory, { loading }] = useServerAction<
		any,
		typeof createCategory
	>(createCategory);
	const [runUpdateCategory, { loading: updating }] = useServerAction<
		any,
		typeof updateCategory
	>(updateCategory);

	useEffect(() => {
		if (category && isOpen) {
			setValue("name", category?.name, {
				shouldTouch: true,
				shouldDirty: true,
				shouldValidate: true,
			});
		} else {
			reset();
		}
	}, [category, isOpen]);

	const onSubmit = async (data: Types) => {
		try {
			const formData = new FormData();
			formData.append("name", data?.name);
			if (data?.picture) {
				formData.append("picture", data?.picture?.[0]);
			}

			if (mode === "create") {
				await runCreateCategory(formData);
			} else if (mode === "edit" && category) {
				await runUpdateCategory(category?.id, formData);
			}
			onClose();
			const message =
				mode === "create"
					? "New category added"
					: "Category successfully updated";
			toast.success(message);
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	return (
		<Modal size={"md"} isOpen={isOpen} onClose={onClose} isDismissable={false}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>
						<ModalBody>
							<TextField
								control={control}
								name='name'
								defaultValue={category?.name}
								label='Name'
								variant='bordered'
								labelPlacement='outside'
								radius='sm'
								placeholder='Name'
							/>
							<FileUpload
								label='Picture'
								defaultValue={category?.image}
								{...register("picture")}
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								radius='sm'
								color='danger'
								variant='light'
								onPress={onClose}
								isDisabled={loading || updating}
							>
								Cancel
							</Button>
							<Button
								onClick={handleSubmit(onSubmit)}
								radius='sm'
								color='primary'
								isDisabled={!isValid}
								isLoading={loading || updating}
							>
								Proceed
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
