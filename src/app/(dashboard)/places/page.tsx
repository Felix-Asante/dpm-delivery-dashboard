import { getPlaces } from "@/actions/place";
import PlacesContentSection from "./sections/PlacesContentSection";

export default async function Places() {
	const places = await getPlaces();

	return (
		<div className='bg-white h-full p-5'>
			<PlacesContentSection places={places} />
		</div>
	);
}
