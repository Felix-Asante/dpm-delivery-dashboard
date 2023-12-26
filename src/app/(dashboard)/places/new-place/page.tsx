import { getCategory } from "@/actions/category";
import CreatePlaceForm from "../sections/new/CreatePlaceForm";

export default async function NewPlace() {
	const categories = await getCategory();
	return (
		<div className='py-3 px-4 md:px-16 md:py-8 min-h-screen bg-gray-50'>
			<CreatePlaceForm categories={categories} headline='Add New Place' />
		</div>
	);
}
