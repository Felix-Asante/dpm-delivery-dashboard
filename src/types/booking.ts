import { Status } from ".";
import { User } from "./auth";
import { ProductCategory } from "./category";
import { Place } from "./place";

export interface BookedService {
	createdAt: string;
	updatedAt: string;
	id: string;
	description: string;
	photo: string;
	name: string;
	price: number;
	productCategory: ProductCategory;
}
export interface Booking {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: any;
	total_amount: number;
	quantity: number;
	price: number;
	rider_tip: number;
	delivery_fee: number;
	recipient_address: string;
	recipient_phone: string;
	transaction_id: string;
	reference_code: string;
	status: BookingStatus;
	user: User;
	place: Place[];
	services: BookedService[];
}

interface BookingStatus {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: any;
	label: Status;
}

export interface Sales {
	month: string;
	totalamount: string;
}
