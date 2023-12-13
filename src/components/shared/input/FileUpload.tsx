import VStack from "../layout/VStack";
import { FileIcon } from "lucide-react";
import FormControl from "./FormControl";
import { ChangeHandler, Controller, useController } from "react-hook-form";
import { forwardRef, useState } from "react";

interface FileUploadProp {
	label?: string;
	multiple?: boolean;
	onChange?: ChangeHandler;
	name: string;
	errorMessage?: string;
}
export default forwardRef(function FileUpload(props: FileUploadProp, ref: any) {
	const { label, multiple = false, errorMessage, ...prop } = props;
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	return (
		<div>
			<FormControl.Label>{label}</FormControl.Label>

			<div className='mt-2 border-2 border-dashed border-gray-200 p-3 rounded-md relative'>
				<input
					type='file'
					multiple={multiple}
					onChange={(e) => {
						// onChange && onChange(e);
						setSelectedFile(e?.target?.files?.[0] ?? null);
					}}
					className='absolute top-0 left-0 h-full w-full opacity-0'
					{...prop}
					ref={ref}
				/>
				<VStack className='items-center gap-2 pointer-event-none'>
					<FileIcon className='text-primary' size={20} />
					<p className='text-sm'>
						{selectedFile ? (
							<span className='text-primary'>{selectedFile?.name}</span>
						) : (
							"Drag n drop some files here, or click to select files"
						)}
					</p>
				</VStack>
			</div>

			<FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
		</div>
	);
});
