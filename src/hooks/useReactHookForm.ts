import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";

export function useReactHookForm<T extends object>(
	validationSchema: any,
	defaultValue?: DefaultValues<T> | undefined,
) {
	const form = useForm<T>({
		resolver: zodResolver(validationSchema),
		defaultValues: defaultValue,
	});

	return form;
}
