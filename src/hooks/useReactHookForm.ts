import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function useReactHookForm<T extends object>(validationSchema: any) {
	const form = useForm<T>({
		resolver: zodResolver(validationSchema),
	});

	return form;
}
