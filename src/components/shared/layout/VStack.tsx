import { StackProps } from "@/types/layouts";
import { cn } from "@/utils/helpers";
import React from "react";

export default function VStack({ children, className = "" }: StackProps) {
	return <div className={cn("flex flex-col", className)}>{children}</div>;
}
