import { User } from "./auth";
import { Booking } from "./booking";

export interface Ratings {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	rating: number;
	comment: string;
	date: string;
	user: User;
	booking: Booking;
}
