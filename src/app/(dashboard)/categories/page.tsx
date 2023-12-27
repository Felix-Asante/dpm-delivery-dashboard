import { getCategory } from "@/actions/category";
import WithServerError from "@/components/hoc/WithServerError";
import React from "react";
import CategorySection from "./_sections/CategorySection";

export default async function CategoriesPage() {
	const categories = await getCategory();
	return (
		<WithServerError error={categories?.error}>
			<div className='bg-white min-h-screen'>
				<CategorySection categories={categories?.results!} />
			</div>
		</WithServerError>
	);
}
