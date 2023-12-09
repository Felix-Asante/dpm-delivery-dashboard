import { useState, useTransition } from "react";

interface ServerActionResponse<T> {
	loading: boolean;
	error: any;
	data: T | undefined;
}

type DefaultAction = (...args: any[]) => Promise<any>;

/**
 * A custom React hook for handling server actions.
 *
 * @template T - The type of data returned by the server action.
 * @template A - The type of the server action function (default: DefaultAction).
 *
 * @param {A} action - The server action function to be executed.
 *
 * @returns {[Function, ServerActionResponse<T>]} - A tuple containing a function to execute the server action
 * and an object representing the state of the action (loading, error, and data).
 */
export function useServerAction<T, A extends DefaultAction = DefaultAction>(
	action: A = (() => Promise.resolve()) as A,
): [
	(...args: Parameters<A>) => Promise<ReturnType<A>>,
	ServerActionResponse<T>,
] {
	const [loading, startTransition] = useTransition();
	const [error, setError] = useState<unknown>();
	const [data, setData] = useState<T | undefined>();

	const run = (...args: Parameters<A>) => {
		return new Promise<ReturnType<A>>((resolve, reject) => {
			startTransition(async () => {
				try {
					setError(undefined);
					const result = await action(...args);
					resolve(result);
					setData(result);
				} catch (err: any) {
					setError(err);
					setData(undefined);
					reject(err);
				}
			});
		});
	};

	return [run, { loading, error, data }];
}
