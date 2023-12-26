"use server";

import { UserRoles } from "@/config/constants";
import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { checkUserRole } from "@/lib/auth";
import { ResponseMeta, SeverActionResponse } from "@/types";
import { Booking } from "@/types/booking";
import { Query } from "@/types/url";
import { getErrorMessage } from "@/utils/helpers";
import { Tags } from "@/utils/tags";
import { revalidateTag } from "next/cache";

interface GetBookingResponse {
	meta: ResponseMeta;
	items: Booking[];
}
export async function getBookings(
	query: Query,
): Promise<SeverActionResponse<GetBookingResponse>> {
	try {
		const isAdmin = await checkUserRole(UserRoles.ADMIN);
		const endpoint = isAdmin
			? apiConfig.bookings.list(query)
			: apiConfig.bookings.place_booking(query);
		const results = await apiHandler<GetBookingResponse>({
			endpoint,
			method: "GET",
			next: { tags: [Tags.bookings] },
		});
		return { results };
	} catch (error) {
		return {
			error: getErrorMessage(error),
		};
	}
}

export async function confirmBooking(bookingId: string) {
	try {
		const endpoint = apiConfig.bookings.confirm(bookingId);
		await apiHandler({ endpoint, method: "PUT" });
		revalidateTag(Tags.bookings);
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
export async function cancelBooking(bookingId: string) {
	try {
		const endpoint = apiConfig.bookings.cancel(bookingId);
		await apiHandler({ endpoint, method: "PUT" });
		revalidateTag(Tags.bookings);
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
export async function deliverBooking(bookingId: string) {
	try {
		const endpoint = apiConfig.bookings.delivered(bookingId);
		await apiHandler({ endpoint, method: "PUT" });
		revalidateTag(Tags.bookings);
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
