"use client";
import {
	cancelBooking,
	confirmBooking,
	deliverBooking,
} from "@/actions/bookings";
import EmptyContent from "@/components/shared/EmptyContent";
import HStack from "@/components/shared/layout/HStack";
import { BookingStatus } from "@/config/constants";
import { useServerAction } from "@/hooks/useServerAction";
import { Booking } from "@/types/booking";
import {
	cn,
	getErrorMessage,
	getInitials,
	getStyleByStatus,
} from "@/utils/helpers";
import {
	Avatar,
	Button,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";
import BookingDetailsSheet from "./BookingDetailsSheet";

interface Props {
	bookings: Booking[];
}

type Status = "cancel" | "confirm" | "deliver";
const columns = [
	{
		key: "Booked at",
		label: "Booked At",
	},
	{
		key: "User",
		label: "User",
	},

	{
		key: "Price",
		label: "Price",
	},
	{
		key: "Qty",
		label: "Qty",
	},
	{
		key: "Total",
		label: "Total",
	},
	{
		key: "Status",
		label: "Status",
	},
];

export default function BookingListTable({ bookings }: Props) {
	const [runConfirmBooking, { loading }] = useServerAction<
		any,
		typeof confirmBooking
	>(confirmBooking);
	const [runCancelBooking, { loading: cancelling }] = useServerAction<
		any,
		typeof cancelBooking
	>(cancelBooking);
	const [runDeliverBooking, { loading: delivering }] = useServerAction<
		any,
		typeof deliverBooking
	>(deliverBooking);
	const [activeRow, setActiveRow] = useState(-1);
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

	const changeBookingStatus = async (
		status: Status,
		bookingId: string,
		index: number,
	) => {
		setActiveRow(index);
		try {
			const actionHandler =
				status === "cancel"
					? runCancelBooking
					: status === "confirm"
					? runConfirmBooking
					: runDeliverBooking;
			await actionHandler(bookingId);
			toast.success("Booking status successfully changed");
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};
	return (
		<>
			<Table
				className='mt-4'
				aria-label='list of bookings'
				shadow='none'
				radius='none'
			>
				{/* @ts-ignore */}
				<TableHeader>
					{columns.map((column) => (
						<TableColumn key={column.key}>{column.label}</TableColumn>
					))}

					<TableColumn>{null}</TableColumn>
				</TableHeader>
				<TableBody
					emptyContent={
						<EmptyContent
							// img={illustration_empty_content}
							title=''
							description='There are no bookings yet'
						/>
					}
				>
					{bookings?.map((booking, index) => {
						const isPending = booking?.status?.label === BookingStatus.PENDING;
						const isConfirmed =
							booking?.status?.label === BookingStatus.CONFIRMED;
						const disabled =
							loading || cancelling || (delivering && index == activeRow);
						return (
							<TableRow key={booking?.id}>
								<TableCell>
									{new Date(booking.createdAt).toLocaleDateString()}
								</TableCell>
								<TableCell>
									<HStack>
										<Avatar
											radius='full'
											fallback={getInitials(booking?.user?.fullName)}
										/>
										<div>
											<h5 className='font-bold text-sm'>
												{booking?.user?.fullName}
											</h5>
											<p className='text-gray-400 text-xs'>
												{booking?.recipient_phone}
											</p>
										</div>
									</HStack>
								</TableCell>
								<TableCell>{booking?.price}</TableCell>
								<TableCell>{booking?.quantity}</TableCell>
								<TableCell>{booking?.total_amount}</TableCell>
								<TableCell>
									<Chip
										variant='dot'
										className={cn("capitalize")}
										classNames={getStyleByStatus(booking?.status?.label)}
									>
										{booking?.status?.label}
									</Chip>
								</TableCell>
								<TableCell>
									<HStack className='items-center gap-2 justify-end'>
										{isPending && (
											<>
												<Button
													radius='full'
													size='sm'
													disableRipple
													color='primary'
													isLoading={loading && index === activeRow}
													disabled={disabled}
													onClick={() =>
														changeBookingStatus("confirm", booking?.id, index)
													}
												>
													Confirm
												</Button>
												<Button
													radius='full'
													size='sm'
													disableRipple
													color='secondary'
													isLoading={cancelling && index === activeRow}
													disabled={disabled}
													onClick={() =>
														changeBookingStatus("cancel", booking?.id, index)
													}
												>
													Cancel
												</Button>
											</>
										)}
										{isConfirmed && (
											<Button
												radius='full'
												size='sm'
												disableRipple
												color='success'
												className='text-white'
												isLoading={delivering && index === activeRow}
												disabled={disabled}
												onClick={() =>
													changeBookingStatus("deliver", booking?.id, index)
												}
											>
												Delivered
											</Button>
										)}
										<Button
											radius='full'
											size='sm'
											disableRipple
											variant='bordered'
											onClick={() => setSelectedBooking(booking)}
										>
											View
										</Button>
									</HStack>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
			<BookingDetailsSheet
				open={selectedBooking !== null}
				onClose={() => setSelectedBooking(null)}
				booking={selectedBooking}
			/>
		</>
	);
}
