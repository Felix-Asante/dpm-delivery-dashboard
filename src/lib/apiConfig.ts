import { Query } from "@/types/url";
import { toQuery } from "@/utils/helpers";

export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  auth: {
    login: () => "auth/login",
    signup: () => "auth/signup",
  },
  users: {
    list: (query: Query) => `users${toQuery(query)}`,
    likes: (userId: string) => `users/likes/${userId}`,
    bookings: (userId: string) => `users/likes/${userId}`,
    delete: (userId: string) => `users/${userId}`,
    count: () => `users/count`,
    get: (userId: string) => `users/${userId}`,
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
    count: () => `places/all/count`,
    products: (placeId: string) => `places/${placeId}/products`,
    new: () => `places/new`,
    popular: () => `places/popular/locations`,
    ratings: (placeId: string, query: Query) =>
      `places/${placeId}/ratings${toQuery(query)}`,
    opening_hrs: (placeId: string) => `places/${placeId}/openingHours`,
  },
  categories: {
    create: () => `categories`,
    list: () => `categories`,
    update: (categoryId: string) => `categories/${categoryId}`,
    get_by_id: (categoryId: string) => `categories/${categoryId}`,
    get_by_slug: (slug: string) => `categories/${slug}/slug`,
    delete: (categoryId: string) => `categories/${categoryId}`,
    count: () => `categories/all/count`,
    places: (slug: string) => `categories/${slug}/places`,
  },
  productCategory: {
    root: () => `products-category`,
    get: (id: string) => `products-category/${id}`,
  },
  products: {
    create: () => `products`,
    get: (productId: string) => `products/${productId}`,
    count: () => `products/count`,
  },
  special_offers: {
    create_offer_types: () => `offers/types`,
    list_offer_types: () => `offers/types`,
    update_type: (typeId: string) => `offers/${typeId}/types/`,
    delete_type: (typeId: string) => `offers/${typeId}/types`,
    get_offer_by_type: (typeId: string) => `offers/types/${typeId}/offers`,
    create: () => `offers`,
    list: (query: Query) => `offers${toQuery(query)}`,
    places: () => `place-offers`,
    products: () => `product-offers`,
    delete: (offerId: string) => `offers/${offerId}`,
    count: () => `offers/count`,
    get_and_update: (offerId: string) => `offers/${offerId}`,
  },
  bookings: {
    list: (query?: Query) => `bookings${toQuery(query ?? {})}`,
    place_booking: (query?: Query) => `bookings/ours${toQuery(query ?? {})}`,
    delete: (bookingId: string) => `bookings/${bookingId}`,
    cancel: (bookingId: string) => `bookings/${bookingId}/cancel-booking`,
    confirm: (bookingId: string) => `bookings/${bookingId}/confirm-booking`,
    delivered: (bookingId: string) => `bookings/${bookingId}/deliver-booking`,
    reject: (bookingId: string) => `bookings/${bookingId}/reject-booking`,
    count: () => `bookings/all/count`,
    sales: (year: string) => `bookings/all/sales${toQuery({ year })}`,
  },
  ratings: {
    root: () => `reviews`,
    get: (ratingId: string) => `reviews/${ratingId}`,
  },
  variables: {
    root: () => `variables`,
    get: (variableId: string) => `variables/${variableId}`,
  },
  riders: {
    list: (query: Query) => `rider${toQuery(query)}`,
    root: () => `rider`,
    get: (riderId: string) => `rider/${riderId}`,
    stats: (riderId: string) => `rider/${riderId}/stats`,
  },
  shipments: {
    list: (query: Query) => `shipping${toQuery(query)}`,
    get: (shipmentId: string) => `shipping/${shipmentId}`,
    update_history: (shipmentId: string) =>
      `shipping/${shipmentId}/update-history`,
    assign_rider: (shipmentId: string, riderId: string) =>
      `shipping/${shipmentId}/assign-rider/${riderId}`,
    get_by_rider: (riderId: string, query: Query) =>
      `shipping/riders/${riderId}${toQuery(query)}`,
  },
};
