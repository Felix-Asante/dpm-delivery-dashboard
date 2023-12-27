"use client";
import HStack from "@/components/shared/layout/HStack";
import useQueryParams from "@/hooks/useQueryParam";
import { Category } from "@/types/category";
import { Pagination } from "@nextui-org/react";
import CategoryTable from "./CategoryTable";

interface Props {
	categories: Category[];
}
const PAGE_SIZE = 10;

export default function CategorySection({ categories }: Props) {
	const { add } = useQueryParams();

	const totalCategories = categories.length;
	const totalPages = Math.ceil(totalCategories / PAGE_SIZE);

	return (
		<section className='px-5 pt-5'>
			<CategoryTable
				categories={categories}
				totalCategories={totalCategories}
			/>
			{totalPages > 1 && (
				<HStack className='justify-end mt-3'>
					<Pagination
						total={totalPages}
						initialPage={1}
						variant='bordered'
						showControls
						onChange={(page) => add("page", page.toString())}
					/>
				</HStack>
			)}
		</section>
	);
}
