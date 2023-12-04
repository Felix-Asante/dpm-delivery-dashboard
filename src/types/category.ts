export interface ProductCategory {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
	name: string;
	slug: string;
}
export interface Category {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
	name: string;
	image: string;
	slug: string;
}
