import { Select, SelectItem } from "@heroui/select";
import { Avatar } from "@heroui/avatar";
import { useController } from "react-hook-form";

interface Options {
  label: string;
  value: string;
  key?: string;
  image?: string;
  onClick?: () => void;
}
interface SelectInputProps {
  options: Options[];
  control: any;
  defaultValue?: string;
  name: string;
  label?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
}
export default function SelectInput(props: SelectInputProps) {
  const {
    options,
    control,
    defaultValue,
    name,
    label,
    placeholder,
    size = "md",
  } = props;

  const { field, fieldState } = useController({
    name,
    defaultValue,
    control,
  });
  return (
    <Select
      items={options}
      label={label}
      placeholder={placeholder || "Select an option"}
      labelPlacement="outside"
      //   className="max-w-xs"
      errorMessage={fieldState?.error?.message}
      variant="bordered"
      radius="sm"
      size={size}
      defaultSelectedKeys={defaultValue ? [defaultValue] : undefined}
      {...field}
    >
      {(option) => (
        <SelectItem
          key={option?.key ?? option.label}
          textValue={option.value}
          onClick={option.onClick ? option.onClick : undefined}
        >
          <div className="flex gap-2 items-center">
            {option?.image && (
              <Avatar
                alt={option.label}
                className="shrink-0"
                size="sm"
                src={option.image}
              />
            )}
            <div className="flex flex-col">
              <span className="text-small">{option.label}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
}
