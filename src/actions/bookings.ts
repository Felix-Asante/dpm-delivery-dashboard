"use server";

import { UserRoles } from "@/config/constants";
import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { checkUserRole } from "@/lib/auth";
import { CountResponse, ResponseMeta, SeverActionResponse } from "@/types";
import { Booking, Sales } from "@/types/booking";
import { Query } from "@/types/url";
import { getErrorMessage } from "@/utils/helpers";
import { Tags } from "@/utils/tags";
import { revalidateTag } from "next/cache";
import { ServerActionAction } from "next/dist/client/components/router-reducer/router-reducer-types";

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

export async function getBookingsCount(): Promise<
	SeverActionResponse<CountResponse>
> {
	try {
		const endpoint = apiConfig.bookings.count();
		const results = await apiHandler<CountResponse>({
			endpoint,
			method: "GET",
		});
		return { results };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}

export async function getSales(
	year: string,
): Promise<SeverActionResponse<Sales[]>> {
	try {
		const endpoint = apiConfig.bookings.sales(year);
		const results = await apiHandler<Sales[]>({
			endpoint,
			method: "GET",
		});
		return { results };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
