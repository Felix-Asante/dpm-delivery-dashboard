import EmptyContent from "@/components/shared/EmptyContent";
import HStack from "@/components/shared/layout/HStack";
import { Category } from "@/types/category";
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	useDisclosure,
} from "@nextui-org/react";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import NewCategoryModal from "./NewCategoryModal";
import Modal from "@/components/shared/modal";
import { ERRORS } from "@/config/constants/errors";
import { useServerAction } from "@/hooks/useServerAction";
import { deleteCategory } from "@/actions/category";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/helpers";
import useQueryParams from "@/hooks/useQueryParam";

interface CategoryTableProp {
	categories: Category[];
	totalCategories: number;
}
export default function CategoryTable(props: CategoryTableProp) {
	const { categories, totalCategories } = props;

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null,
	);

	const { query, remove } = useQueryParams();

	const [runDeleteCategory, { loading }] = useServerAction<
		any,
		typeof deleteCategory
	>(deleteCategory);

	const removeCategory = async () => {
		try {
			if (!selectedCategory?.id) {
				toast.error("Operation not allowed");
				return;
			}

			await runDeleteCategory(selectedCategory.id);
			toast.success("Category deleted");
			setSelectedCategory(null);
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	useEffect(() => {
		if (!isOpen) {
			setSelectedCategory(null);
		}
	}, [isOpen]);

	return (
		<>
			<HStack className='justify-between items-center'>
				<div>
					<h3 className='font-semibold text-xl'>
						{totalCategories} {totalCategories > 1 ? "Category" : "Categories"}
					</h3>
					<p className='text-gray-400'>List of all categories</p>
				</div>
				<Button
					radius='sm'
					size='md'
					color='primary'
					disableRipple
					className='font-semibold'
					onClick={onOpen}
				>
					Add new category
				</Button>
			</HStack>
			<div className='p-3 mt-4 border rounded-md'>
				<Table aria-label='list of categories' shadow='none' radius='none'>
					<TableHeader>
						<TableColumn className='w-1/2'>Name</TableColumn>
						<TableColumn>{null}</TableColumn>
					</TableHeader>
					<TableBody
						emptyContent={
							<EmptyContent
								// img={illustration_empty_content}
								title=''
								description='No places added'
							/>
						}
					>
						{categories.map((category) => (
							<TableRow key={category?.id}>
								<TableCell className='capitalize'>{category?.name}</TableCell>
								<TableCell>
									<HStack className='items-center justify-end'>
										<Button
											radius='sm'
											size='sm'
											disableRipple
											color='danger'
											onClick={() => setSelectedCategory(category)}
											isIconOnly
										>
											<Trash2Icon className='text-white' size={15} />
										</Button>
										<Button
											radius='sm'
											size='sm'
											disableRipple
											color='success'
											onClick={() => {
												setSelectedCategory(category);
												onOpen();
											}}
											isIconOnly
										>
											<PencilIcon className='text-white' size={20} />
										</Button>
									</HStack>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<NewCategoryModal
					isOpen={isOpen || query?.new === "true"}
					onClose={() => {
						onClose();
						query?.new === "true" && remove("new");
					}}
					mode={selectedCategory !== null ? "edit" : "create"}
					category={selectedCategory}
				/>
				<Modal
					isOpen={selectedCategory !== null && !isOpen}
					onClose={() => setSelectedCategory(null)}
					title='Delete Category'
					description={ERRORS.MESSAGE.DELETE_PROMPT}
					content={
						<HStack className='justify-end'>
							<Button
								radius='sm'
								size='md'
								variant='bordered'
								disableRipple
								className='font-semibold'
								onClick={() => setSelectedCategory(null)}
								isDisabled={loading}
							>
								Cancel
							</Button>
							<Button
								radius='sm'
								size='md'
								color='primary'
								disableRipple
								className='font-semibold'
								onClick={removeCategory}
								isLoading={loading}
							>
								Continue
							</Button>
						</HStack>
					}
				/>
			</div>
		</>
	);
}
