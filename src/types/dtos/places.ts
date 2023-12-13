import { CreateUserDto } from "./users";

export interface CreatePlaceDto {
	name: string;
	email: string;
	phone: string;
	address: string;
	longitude: string;
	latitude: string;
	website?: string;
	logo: File;
	mainImage: File;
	category: string;
	averagePrice: number;
	deliveryFee?: number;
	minPrepTime?: number;
	maxPrepTime?: number;
	placeAdminFullName: string;
	placeAdminPhone: string;
	placeAdminPassword: string;
}
