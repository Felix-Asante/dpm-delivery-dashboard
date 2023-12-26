import { Category, ProductCategory } from "./category";
import { CreatePlaceDto } from "./dtos/places";

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
