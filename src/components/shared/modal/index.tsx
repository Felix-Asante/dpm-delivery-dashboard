import React, { ReactNode } from "react";
import {
	Modal as NextuiModal,
	ModalContent,
	ModalHeader,
	ModalBody,
} from "@nextui-org/react";

interface ModalProps {
	title: string;
	description?: string;
	content: ReactNode;
	size?: "sm" | "md" | "lg" | "xl" | "2xl";
	closeOnOutsideClick?: boolean;
	backdrop?: "opaque" | "blur" | "transparent";
	onClose: () => void;
	isOpen: boolean;
}
export default function Modal(props: ModalProps) {
	const {
		title,
		description,
		content,
		size = "sm",
		closeOnOutsideClick = false,
		backdrop = "opaque",
		onClose,
		isOpen,
	} = props;
	return (
		<NextuiModal
			isOpen={isOpen}
			isDismissable={closeOnOutsideClick}
			size={size}
			backdrop={backdrop}
			onClose={onClose}
		>
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalBody>
					{description && <p className='text-gray-500'>{description}</p>}
					{content && <div className='my-2'>{content}</div>}
				</ModalBody>
			</ModalContent>
		</NextuiModal>
	);
}
