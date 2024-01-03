import { getCategory } from "@/actions/category";
import CreatePlaceForm from "../sections/new/CreatePlaceForm";
import WithServerError from "@/components/hoc/WithServerError";

export default async function NewPlace() {
	const categories = await getCategory();
	return (
		<WithServerError error={categories?.error}>
			<div className='py-3 px-4 md:px-16 md:py-8 min-h-screen bg-gray-50'>
				<CreatePlaceForm
					categories={categories?.results!}
					headline='Add New Place'
				/>
			</div>
		</WithServerError>
	);
}
