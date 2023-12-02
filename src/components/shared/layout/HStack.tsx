import { StackProps } from "@/types/layouts";
import { cn } from "@/utils/helpers";
import React from "react";

export default function HStack({ children, className = "" }: StackProps) {
	return <div className={cn("flex gap-4", className)}>{children}</div>;
}
