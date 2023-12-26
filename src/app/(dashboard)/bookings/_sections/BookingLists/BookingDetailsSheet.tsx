import HStack from "@/components/shared/layout/HStack";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { BookingStatus, DEFAULT_CURRENCY } from "@/config/constants";
import { Booking } from "@/types/booking";
import { cn, getInitials } from "@/utils/helpers";
import { Avatar } from "@nextui-org/react";
import { MapPinnedIcon, PhoneIcon } from "lucide-react";
import React from "react";

interface Props {
	open: boolean;
	onClose: () => void;
	booking: Booking | null;
}
export default function BookingDetailsSheet({ open, onClose, booking }: Props) {
	return (
		<Sheet open={open} onOpenChange={onClose}>
			<SheetContent size={"lg"}>
				<div className='border-b pl-5'>
					<h3 className='font-semibold text-primary text-lg uppercase'>
						Reservation Details
					</h3>
				</div>
				<div className='m-4 border rounded-md'>
					<HStack className='items-center gap-2 justify-between p-2'>
						<HStack className='items-center'>
							<Avatar
								radius='full'
								fallback={getInitials(booking?.user?.fullName)}
							/>
							<div>
								<p className='text-base capitalize mb-1'>
									{booking?.user?.fullName}
								</p>
								<HStack>
									<HStack className='gap-2 items-center'>
										<MapPinnedIcon className='text-gray-400' size={18} />
										<p className='text-gray-400'>
											{booking?.recipient_address}
										</p>
									</HStack>
									<HStack className='gap-2 items-center'>
										<PhoneIcon className='text-gray-400' size={18} />
										<p className='text-gray-400'>{booking?.recipient_phone}</p>
									</HStack>
								</HStack>
							</div>
						</HStack>
					</HStack>
					<HStack className='divide-x border-t'>
						<div className='p-2'>
							<h3 className='text-sm text-gray-500'>Amount paid</h3>
							<p>
								{DEFAULT_CURRENCY.symbol}
								{booking?.total_amount}
							</p>
						</div>
						<div className='p-2'>
							<h3 className='text-sm text-gray-500'>Reference</h3>
							<p>{booking?.reference_code}</p>
						</div>
						<div className='p-2'>
							<h3 className='text-sm text-gray-500'>Reserved at</h3>
							{booking?.createdAt && (
								<p>{new Date(booking?.createdAt).toDateString()}</p>
							)}
						</div>
					</HStack>
				</div>
				<HStack className='gap-2 flex-wrap mx-4'>
					{Object.values(BookingStatus).map((status) => (
						<div
							key={status}
							className={cn(
								"py-[2px] px-3 bg-gray-100 capitalize text-sm",
								status === booking?.status?.label && "bg-primary text-white",
							)}
						>
							{status}
						</div>
					))}
				</HStack>

				<section className='m-4 mt-5'>
					<HStack className='items-center mb-2'>
						<h3 className='text-base'>Booked Places</h3>
						<div className='bg-primary text-white py-1 px-3 w-5 h-5 rounded-md flex items-center justify-center'>
							{booking?.place?.length}
						</div>
					</HStack>
					<div className='border p-3 rounded-md flex flex-col gap-2 divide-y'>
						{booking?.place?.map((place) => (
							<HStack key={place?.id} className='py-1'>
								<Avatar src={place?.logo} size='sm' radius='full' />
								<div>
									<h3 className='text-base font-bold'>{place?.name}</h3>
									<p className='text-sm text-gray-400'>
										Address: {place?.address} <span className='mx-2'>|</span>
										<span>
											Average price: {DEFAULT_CURRENCY.symbol}
											{place?.averagePrice}
										</span>{" "}
									</p>
								</div>
							</HStack>
						))}
					</div>
				</section>
				<section className='m-4 mt-5'>
					<HStack className='items-center mb-2'>
						<h3 className='text-base'>Booked Services</h3>
						<div className='bg-primary text-white py-1 px-3 w-5 h-5 rounded-md flex items-center justify-center'>
							{booking?.services?.length}
						</div>
					</HStack>
					<div className='border p-3 rounded-md flex flex-col gap-2 divide-y'>
						{booking?.services && booking?.services?.length > 0 ? (
							booking?.services?.map((service) => (
								<HStack key={service?.id} className='py-1'>
									<Avatar
										src={service?.photo}
										fallback={getInitials(service?.name)}
										size='sm'
										radius='full'
									/>
									<div>
										<h3 className='text-base font-bold'>{service?.name}</h3>
										<p className='text-sm text-gray-400'>
											Price: {DEFAULT_CURRENCY.symbol}
											{service?.price}
										</p>
									</div>
								</HStack>
							))
						) : (
							<p className='py-3 text-gray-400'>Booking has no service</p>
						)}
					</div>
				</section>
			</SheetContent>
		</Sheet>
	);
}
