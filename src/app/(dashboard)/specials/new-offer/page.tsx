import CreateOfferContent from "../_sections/CreateOfferContent";
import CreateOfferSection from "../_sections/new/CreateOfferSection";

export default function CreateNewOfferPage() {
	return (
		<div className='px-8 pt-8'>
			<h3 className='text-lg font-semibold mb-2'>Create new place</h3>
			<CreateOfferSection />
		</div>
	);
}
