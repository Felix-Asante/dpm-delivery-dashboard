export interface CreateCategoryDto {
	name: string;
	picture: File;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;
