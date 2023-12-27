import { getCategory } from "@/actions/category";
import { getPlaceAdmin, getPlaceBySlug } from "@/actions/place";
import UpdatePlaceSection from "../../sections/update/UpdatePlaceSection";
import WithServerError from "@/components/hoc/WithServerError";

interface PageProps {
	params: {
		slug: string;
	};
}
export default async function EditPlacePage({ params }: PageProps) {
	const [categories, place] = await Promise.all([
		getCategory(),
		getPlaceBySlug(params.slug),
	]);
	const placeAdmin = await getPlaceAdmin(place?.results!?.id);

	const error = categories?.error ?? place?.error;

	return (
		<WithServerError error={error}>
			<div className='py-3 px-4 md:px-16 md:py-8 min-h-screen bg-gray-50'>
				<UpdatePlaceSection
					categories={categories?.results!}
					place={place?.results!}
					admin={placeAdmin?.results!}
				/>
			</div>
		</WithServerError>
	);
}
