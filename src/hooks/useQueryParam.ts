import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

export interface QueryProps {
	[key: string]: string;
}

interface QueryParamsPropsReturn {
	query: QueryProps | null;
	add: (key: string, value: string) => void;
	remove: (key: string) => void;
	addMultiple: (queryParams: QueryProps) => void;
	isInQuery: (key: string) => boolean;
}
export default function useQueryParams(): QueryParamsPropsReturn {
	const [query, setQuery] = useState<QueryProps | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams],
	);

	const removeQueryString = useCallback(
		(name: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.delete(name);

			return params.toString();
		},
		[searchParams],
	);

	useEffect(() => {
		searchParams.forEach((value, key) => {
			setQuery((prev) => {
				return {
					...prev,
					[key]: value,
				};
			});
		});
	}, [searchParams.toString()]);

	const addMultiple = (queryParams: QueryProps) => {
		const params = new URLSearchParams(searchParams.toString());

		for (const key in queryParams) {
			params.set(key, queryParams[key]);
		}

		router.push(pathname + "?" + params.toString());
	};

	const remove = (key: string) => {
		router.push(pathname + "?" + removeQueryString(key));
		if (!query) return;
		setQuery((prev) => {
			const { [key]: _, ...rest } = prev!;
			return rest;
		});
	};

	const add = (key: string, value: string) => {
		if (!value || value === "") return remove(key);
		router.push(pathname + "?" + createQueryString(key, value));
	};

	const isInQuery = (formInput: string) => {
		return query ? Object.keys(query).some((q) => q === formInput) : false;
	};

	return {
		query,
		add,
		addMultiple,
		remove,
		isInQuery,
	};
}

export function useRevalidateQueryValues<T extends {}>(
	setValue: any,
	fields: T,
) {
	const { query, isInQuery } = useQueryParams();
	const [pending, startTransition] = useTransition();

	useEffect(() => {
		startTransition(() => {
			setTimeout(() => {
				Object.keys(fields).forEach(async (formInput) => {
					if (isInQuery(formInput)) {
						const inputValue = query?.[formInput];
						setValue(formInput, inputValue, {
							shouldDirty: true,
							shouldValidate: true,
						});
					}
				});
			}, 1000);
		});
	}, [query, setValue, fields]);
	return { validating: pending };
}
