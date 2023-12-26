import { Query } from "@/types/url";
import { toQuery } from "@/utils/helpers";

export const apiConfig = {
	baseUrl: process.env.API_URL,
	auth: {
		login: () => "auth/login",
	},
	users: {
		list: () => "users",
		likes: (userId: string) => `users/likes/${userId}`,
		bookings: (userId: string) => `users/likes/${userId}`,
		delete: (userId: string) => `users/${userId}`,
		count: () => `users/count`,
	},
	places: {
		create: () => `places`,
		list: ({ search, ...rest }: Query) =>
			`places${toQuery({ query: search, ...rest })}`,
		update: (placeId: string) => `places/${placeId}`,
		get_by_id: (placeId: string) => `places/${placeId}`,
		get_by_slug: (slug: string) => `places/${slug}/slug`,
		delete: (placeId: string) => `places/${placeId}`,
		get_admin: (placeId: string) => `places/admin/${placeId}`,
		search: (query: Query) => `places/search${toQuery(query)}`,
		count: () => `places/count`,
	},
	categories: {
		create: () => `categories`,
		list: () => `categories`,
		update: (categoryId: string) => `categories/${categoryId}`,
		get_by_id: (categoryId: string) => `categories/${categoryId}`,
		get_by_slug: (slug: string) => `categories/${slug}/slug`,
		delete: (categoryId: string) => `categories/${categoryId}`,
		places: (slug: string) => `categories/${slug}/places`,
	},
	products: {
		create: () => `products`,
		update: (productId: string) => `products/${productId}`,
		get_by_id: (productId: string) => `products/${productId}`,
		delete: (productId: string) => `products/${productId}`,
		count: () => `products/count`,
	},
	special_offers: {
		create_offer_types: () => `offers/types`,
		list_offer_types: () => `offers/types`,
		update_type: (typeId: string) => `offers/${typeId}/types/`,
		delete_type: (typeId: string) => `offers/${typeId}/types`,
		get_offer_by_type: (typeId: string) => `offers/types/${typeId}/offers`,
		create: () => `offers`,
		list: () => `offers`,
		places: () => `place-offers`,
		products: () => `product-offers`,
		delete: (offerId: string) => `offers/${offerId}`,
		count: () => `offers/count`,
	},
	bookings: {
		list: (query?: Query) => `bookings${toQuery(query ?? {})}`,
		place_booking: (query?: Query) => `bookings/ours${toQuery(query ?? {})}`,
		delete: (bookingId: string) => `bookings/${bookingId}`,
		cancel: (bookingId: string) => `bookings/${bookingId}/cancel-booking`,
		confirm: (bookingId: string) => `bookings/${bookingId}/confirm-booking`,
		delivered: (bookingId: string) => `bookings/${bookingId}/deliver-booking`,
		reject: (bookingId: string) => `bookings/${bookingId}/reject-booking`,
		count: () => `bookings/count`,
	},
};
