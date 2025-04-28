import VStack from "../layout/VStack";
import { FileIcon } from "lucide-react";
import FormControl from "./FormControl";
import { ChangeHandler, Controller, useController } from "react-hook-form";
import { forwardRef, useState } from "react";
import { isValidUrl } from "@/utils/helpers";
import Image from "next/image";
import HStack from "../layout/HStack";
import { Button } from "@nextui-org/react";

interface FileUploadProp {
  label?: string;
  multiple?: boolean;
  onChange?: ChangeHandler;
  name: string;
  errorMessage?: string;
  defaultValue?: string;
}

const getFilePreview = (file: File): string | null => {
  if (file.type.startsWith("image/")) {
    return URL.createObjectURL(file);
  }
  return null;
};

export default forwardRef(function FileUpload(props: FileUploadProp, ref: any) {
  const {
    label,
    multiple = false,
    errorMessage,
    defaultValue,
    onChange,
    ...prop
  } = props;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      setPreviewUrl(getFilePreview(e.target?.files?.[0]));
    }
    setSelectedFile(e?.target?.files?.[0] ?? null);
    onChange?.(e);
  };

  return (
    <div>
      <FormControl.Label>{label}</FormControl.Label>
      {defaultValue && !editMode ? (
        <Image
          src={defaultValue}
          alt=""
          width={250}
          height={250}
          className="rounded-md object-cover"
        />
      ) : (
        <div className="mt-2 border-2 border-dashed border-gray-200 p-3 rounded-md relative">
          <input
            type="file"
            multiple={multiple}
            onChange={onFileUpload}
            className="absolute top-0 left-0 h-full w-full opacity-0"
            {...prop}
            ref={ref}
          />
          <VStack className="items-center gap-2 pointer-event-none">
            <FileIcon className="text-primary" size={20} />
            <p className="text-sm">
              {selectedFile ? (
                <span className="text-primary">{selectedFile?.name}</span>
              ) : (
                "Drag n drop some files here, or click to select files"
              )}
            </p>
          </VStack>
        </div>
      )}

      {previewUrl && (
        <div className="mt-4">
          <Image
            src={previewUrl}
            alt=""
            width={250}
            height={250}
            className="rounded-md object-cover"
          />
        </div>
      )}

      {defaultValue && (
        <Button
          size="sm"
          radius="sm"
          variant="light"
          color="primary"
          className="mt-1"
          onClick={() => setEditMode((mode) => !mode)}
        >
          {editMode ? "Cancel" : "Modify"}
        </Button>
      )}
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </div>
  );
});
