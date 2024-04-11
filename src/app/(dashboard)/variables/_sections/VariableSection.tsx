"use client";
import HStack from "@/components/shared/layout/HStack";
import { Variables } from "@/types";
import { pluralize } from "@/utils/helpers";
import { Button, useDisclosure } from "@nextui-org/react";
import VariablesTable from "./VariablesTable";
import { useState } from "react";
import AddVariableForm from "./AddVariableForm";

interface Props {
	variables: Variables[];
}
export default function VariableSection({ variables }: Props) {
	const [selectedVariable, setSelectedVariable] = useState<Variables | null>(
		null,
	);
	const { onOpen, isOpen, onClose } = useDisclosure();
	const totalVariables = variables?.length;
	return (
		<div>
			<HStack className='items-center justify-between mb-3'>
				<h3 className='font-semibold text-xl'>
					{totalVariables} {pluralize("Variable", totalVariables)}
				</h3>
				<Button
					radius='sm'
					size='md'
					color='primary'
					disableRipple
					className='font-semibold'
					onClick={() => {
						setSelectedVariable(null);
						onOpen();
					}}
				>
					Add Variable
				</Button>
			</HStack>
			<VariablesTable
				variables={variables}
				onEdit={(variable) => {
					setSelectedVariable(variable);
					onOpen();
				}}
			/>
			<AddVariableForm
				isOpen={isOpen}
				onClose={() => {
					onClose();
				}}
				variable={selectedVariable}
			/>
		</div>
	);
}
