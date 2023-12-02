import React, { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{}>;

export default function Container({ children }: ContainerProps) {
	return <div className='w-full  mx-auto h-full relative'>{children}</div>;
}
