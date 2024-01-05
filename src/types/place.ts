import { Category, ProductCategory } from "./category";
import { CreatePlaceDto } from "./dtos/places";
import { Special } from "./specials";

type placeBaseType = Omit<CreatePlaceDto, "logo" | "category" | "mainImage">;

export interface Place extends placeBaseType {
	productCategory: ProductCategory[];
	id: string;
	logo: string;
	mainImage: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	category: Category;
	visits: number;
}

export interface PlaceService {
	createdAt: string;
	updatedAt: string;
	id: string;
	description: string;
	photo: string;
	name: string;
	price: number;
	productCategory: ProductCategory;
}

export interface PlaceProducts {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	description: string;
	photo: string | null;
	name: string;
	price: number;
	offers: Special[];
}
