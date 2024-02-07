import { DEFAULT_CURRENCY } from "@/config/constants";
import { Place } from "@/types/place";
import { Avatar, Badge } from "@nextui-org/react";
import { BadgeCheckIcon } from "lucide-react";
import Link from "next/link";

interface Props {
	place: Place;
}
export default function PlaceSidebar({ place }: Props) {
	return (
		<aside className='bg-white py-4 h-full'>
			<div className='px-4 flex flex-col items-center  mb-5'>
				<Badge
					isOneChar
					content={<BadgeCheckIcon size={20} />}
					color='danger'
					shape='circle'
					placement='bottom-right'
				>
					<Avatar radius='full' size='lg' src={place?.logo} />
				</Badge>
				<h3 className='text-base font-semibold mt-3'>{place?.name}</h3>
				<p className='text-gray-400 text-sm'>{place?.address}</p>
				<p className='text-sm mt-2'>
					Joined at {new Date(place?.createdAt).toDateString()}
				</p>
			</div>
			<div>
				<h3 className='border-b pl-3 mb-3'>Place details</h3>
				<div className='px-4'>
					<PlaceDetail label='Email' value={place?.email} />
					<PlaceDetail label='Phone' value={place?.phone} />
					<PlaceDetail label='Website' value={place?.website ?? ""} link />
					<PlaceDetail
						label='Average price'
						value={
							place?.averagePrice
								? `${DEFAULT_CURRENCY.symbol}${place?.averagePrice}`
								: ""
						}
					/>
					<PlaceDetail
						label='Delivery Fee'
						value={
							place?.deliveryFee
								? `${DEFAULT_CURRENCY.symbol}${place?.deliveryFee}`
								: ""
						}
					/>
					<PlaceDetail
						label='Minimum preparation time'
						value={place?.minPrepTime?.toString() ?? ""}
					/>
					<PlaceDetail
						label='Maximum preparation time'
						value={place?.maxPrepTime?.toString() ?? ""}
					/>
				</div>
			</div>
		</aside>
	);
}

interface PlaceDetailProps {
	label: string;
	value: string;
	link?: boolean;
}
function PlaceDetail({ value, label, link }: PlaceDetailProps) {
	return (
		<div className='mb-2'>
			<h3 className='text-gray-400 text-sm'>{label}</h3>
			{link ? (
				<Link
					href={value ?? "#"}
					target='_blank'
					className='font-medium text-sm line-clamp-1'
				>
					{value}
				</Link>
			) : (
				<p className='font-medium text-sm'>{value}</p>
			)}
		</div>
	);
}
