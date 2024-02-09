import {
	createProductCategory,
	deleteProductCategory,
	updateProductCategory,
} from "@/actions/category";
import TextField from "@/components/shared/input/TextField";
import Modal from "@/components/shared/modal";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { useServerAction } from "@/hooks/useServerAction";
import {
	CreateProductCategoryDto,
	createProductCategorySchema,
} from "@/rules/validations/category";
import { ProductCategory } from "@/types/category";
import { getErrorMessage } from "@/utils/helpers";
import { Button, useDisclosure } from "@nextui-org/react";
import { PencilIcon, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
	categories: ProductCategory[];
	placeId: string;
}
export default function ProductCategoriesSection({
	categories,
	placeId,
}: Props) {
	const [showCreateModal, setShowCreateModal] = useState(false);
	const form = useReactHookForm<CreateProductCategoryDto>(
		createProductCategorySchema,
	);

	const [runCreateCategory, { loading }] = useServerAction<
		any,
		typeof createProductCategory
	>(createProductCategory);

	const closeCreateModal = () => {
		form.reset();
		form.clearErrors();
		setShowCreateModal(false);
	};

	const onSubmit = async (data: CreateProductCategoryDto) => {
		try {
			const response = await runCreateCategory({ ...data, place: placeId });
			if (response?.error) {
				toast.error(response.error);
				return;
			}
			toast.success("Category added successfully");
			closeCreateModal();
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	return (
		<div className='p-3'>
			<div className='flex justify-between items-center mb-5'>
				<div>
					<h3 className='text-lg'>Service categories</h3>
					<p className='text-sm font-medium'>List of all service category</p>
				</div>
				<Button
					disableRipple
					color='primary'
					radius='sm'
					onClick={() => setShowCreateModal(true)}
				>
					Add new category
				</Button>
			</div>
			<div className='flex flex-col gap-3'>
				{categories?.map((category) => (
					<ProductCategoryCard key={category?.id} {...category} />
				))}
			</div>

			<Modal
				isOpen={showCreateModal}
				onClose={closeCreateModal}
				title='Add service category'
				content={
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<TextField
							name='name'
							label='Name'
							size='sm'
							control={form.control}
							variant='bordered'
						/>
						<div className='flex gap-2 mt-4'>
							<Button
								disableRipple
								color='secondary'
								radius='sm'
								onClick={closeCreateModal}
								type='button'
								isDisabled={loading}
							>
								Cancel
							</Button>
							<Button
								disabled={!form.formState.isValid}
								isDisabled={!form.formState.isValid}
								disableRipple
								color='primary'
								radius='sm'
								type='submit'
								isLoading={loading}
							>
								Add new category
							</Button>
						</div>
					</form>
				}
			/>
		</div>
	);
}

function ProductCategoryCard(props: ProductCategory) {
	const [editMode, setEditMode] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const form = useReactHookForm<CreateProductCategoryDto>(
		createProductCategorySchema,
		{ name: props?.name },
	);

	const [runUpdateCategory, { loading }] = useServerAction<
		any,
		typeof updateProductCategory
	>(updateProductCategory);

	const [runDeleteCategory, { loading: deleting }] = useServerAction<
		any,
		typeof deleteProductCategory
	>(deleteProductCategory);

	const exitEditMode = () => {
		form.reset();
		form.clearErrors();
		setEditMode(false);
	};

	useEffect(() => {
		if (editMode) {
			setTimeout(() => {
				form.setValue("name", props.name);
			}, 100);
		}
	}, [editMode, props.name]);

	const onSubmit = async (data: CreateProductCategoryDto) => {
		try {
			const response = await runUpdateCategory(data, props?.id);
			if (response?.error) {
				toast.error(response.error);
				return;
			}
			toast.success("Category updated successfully");
			exitEditMode();
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};
	const onDelete = async () => {
		try {
			const response = await runDeleteCategory(props?.id);
			if (response?.error) {
				toast.error(response.error);
				return;
			}
			toast.success("Category deleted successfully");
			onClose();
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};
	return (
		<div className='p-3 rounded-md bg-white flex items-center justify-between'>
			{editMode ? (
				<div className='w-1/2'>
					<TextField
						name='name'
						label='Name'
						size='sm'
						control={form.control}
						variant='bordered'
					/>
				</div>
			) : (
				<p className='font-medium uppercase'>{props?.name}</p>
			)}
			{props.name?.toLowerCase() !== "uncategorized" && !editMode && (
				<div className='flex items-center gap-2'>
					<Button
						onClick={onOpen}
						disableRipple
						size='sm'
						isIconOnly
						color='danger'
					>
						<TrashIcon size={20} />
					</Button>
					<Button
						onClick={() => setEditMode(true)}
						disableRipple
						size='sm'
						isIconOnly
						color='secondary'
					>
						<PencilIcon size={20} />
					</Button>
				</div>
			)}
			{editMode && (
				<div className='flex items-center gap-2'>
					<Button
						disableRipple
						size='sm'
						onClick={exitEditMode}
						color='secondary'
						isDisabled={loading}
					>
						Cancel
					</Button>
					<Button
						disableRipple
						size='sm'
						onClick={form.handleSubmit(onSubmit)}
						color='primary'
						isLoading={loading}
					>
						Save
					</Button>
				</div>
			)}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title='Delete service category'
				description='Do you really want to delete this category? Note that this operation cannot be undone'
				content={
					<div className='flex gap-2 mt-4'>
						<Button
							disableRipple
							color='secondary'
							radius='sm'
							onClick={onClose}
							type='button'
							isDisabled={deleting}
						>
							Cancel
						</Button>
						<Button
							disableRipple
							color='primary'
							radius='sm'
							isLoading={deleting}
							onClick={onDelete}
						>
							Continue
						</Button>
					</div>
				}
			/>
		</div>
	);
}
