export interface CreateProductDto {
	description?: string;
	photo?: File;
	productCategory: string;
	name: string;
	price: number;
}
