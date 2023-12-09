import { Category, ProductCategory } from "./category";
import { CreatePlaceDto } from "./dtos/places";

type placeBaseType = Omit<CreatePlaceDto, "logo" | "category">;

export interface Place extends placeBaseType {
	productCategory: ProductCategory[];
	id: string;
	logo: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	category: Category;
}
