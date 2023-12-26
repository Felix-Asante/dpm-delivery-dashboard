import React, { PropsWithChildren } from "react";
import EmptyContent from "../shared/EmptyContent";
import HStack from "../shared/layout/HStack";

type WithServerErrorProps = PropsWithChildren<{
	error?: string;
}>;
export default function WithServerError({
	error,
	children,
}: WithServerErrorProps) {
	if (error) {
		return (
			<HStack className='items-center justify-center'>
				<EmptyContent title='Something went wrong' description={error} />
			</HStack>
		);
	}
	return <>{children}</>;
}
