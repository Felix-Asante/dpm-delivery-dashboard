import { getPlaces } from "@/actions/place";
import PlacesContentSection from "./sections/PlacesContentSection";
import { getCategory } from "@/actions/category";

interface PageProps {
	searchParams: {
		search?: string;
		category?: string;
		page?: string;
	};
}
export default async function Places({ searchParams }: PageProps) {
	const [places, categories] = await Promise.all([
		getPlaces(searchParams),
		getCategory(),
	]);

	return (
		<div className='bg-white h-full p-5'>
			<PlacesContentSection
				places={places?.items}
				meta={places?.meta}
				categories={categories}
			/>
		</div>
	);
}
