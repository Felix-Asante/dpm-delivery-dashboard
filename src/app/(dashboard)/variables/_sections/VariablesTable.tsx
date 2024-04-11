"use client";
import EmptyContent from "@/components/shared/EmptyContent";
import HStack from "@/components/shared/layout/HStack";
import { Variables } from "@/types";
import { pluralize } from "@/utils/helpers";
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	useDisclosure,
} from "@nextui-org/react";
import { PencilIcon, Trash2Icon } from "lucide-react";
import React, { useState } from "react";

interface Props {
	variables: Variables[];
	onEdit: (variable: Variables) => void;
}
export default function VariablesTable({ variables, onEdit }: Props) {
	const [selectedVariable, setSelectedVariable] = useState<Variables | null>(
		null,
	);
	const { onOpen, isOpen, onClose } = useDisclosure();

	return (
		<div className='border p-3 rounded-md'>
			<Table aria-label='list of variables' shadow='none' radius='none'>
				<TableHeader>
					<TableColumn className='w-1/2'>Name</TableColumn>
					<TableColumn>Value</TableColumn>
					<TableColumn>{null}</TableColumn>
				</TableHeader>
				<TableBody
					emptyContent={
						<EmptyContent
							// img={illustration_empty_content}
							title=''
							description='No Variables added'
						/>
					}
				>
					{variables.map((variable) => (
						<TableRow key={variable?.id}>
							<TableCell>{variable?.label}</TableCell>
							<TableCell>{variable?.value}</TableCell>
							<TableCell>
								<HStack className='items-center justify-end'>
									<Button
										radius='sm'
										size='sm'
										disableRipple
										color='danger'
										onClick={() => setSelectedVariable(variable)}
										isIconOnly
										disabled
									>
										<Trash2Icon className='text-white' size={15} />
									</Button>
									<Button
										radius='sm'
										size='sm'
										disableRipple
										color='success'
										onClick={() => onEdit(variable)}
										isIconOnly
									>
										<PencilIcon className='text-white' size={20} />
									</Button>
								</HStack>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
