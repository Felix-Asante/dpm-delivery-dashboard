import { createVariables, updateVariables } from "@/actions/variables";
import TextField from "@/components/shared/input/TextField";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { useServerAction } from "@/hooks/useServerAction";
import { CreateVariableDto, createVariableSchema } from "@/rules/validations";
import { Variables } from "@/types";
import { getErrorMessage } from "@/utils/helpers";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	variable: Variables | null;
}
export default function AddVariableForm(props: Props) {
	const { isOpen, onClose, variable } = props;

	const { control, handleSubmit, reset, setValue, clearErrors } =
		useReactHookForm<CreateVariableDto>(createVariableSchema);

	const [runCreateVariable, { loading }] = useServerAction<
		any,
		typeof createVariables
	>(createVariables);
	const [runUpdateVariable, { loading: updating }] = useServerAction<
		any,
		typeof updateVariables
	>(updateVariables);

	useEffect(() => {
		setValue("label", variable?.label ?? "");
		setValue("value", variable?.value ?? "");
	}, [variable]);

	const actionFunction = async (data: CreateVariableDto) =>
		variable
			? await runUpdateVariable(variable.id, data)
			: await runCreateVariable(data);

	const onSubmit = async (data: CreateVariableDto) => {
		try {
			const toastMessage = variable
				? "Variable updated"
				: "New variable created";

			const response = await actionFunction(data);
			if (response?.error) {
				toast.error(response.error);
				return;
			}
			toast.success(toastMessage);
			reset();
			onClose();
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	return (
		<Modal size={"md"} isOpen={isOpen} onClose={onClose} isDismissable={false}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className='flex flex-col gap-1'>Variables</ModalHeader>
						<ModalBody>
							<TextField
								control={control}
								name='label'
								defaultValue={variable?.label}
								label='Label'
								variant='bordered'
								labelPlacement='outside'
								radius='sm'
								placeholder='Label'
							/>
							<TextField
								control={control}
								name='value'
								defaultValue={variable?.value}
								label='Value'
								variant='bordered'
								labelPlacement='outside'
								radius='sm'
								placeholder='Value'
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								radius='sm'
								color='danger'
								variant='light'
								onPress={onClose}
								// isDisabled={loading || updating}
							>
								Cancel
							</Button>
							<Button
								onClick={handleSubmit(onSubmit)}
								radius='sm'
								color='primary'
								isLoading={loading || updating}
							>
								Proceed
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
