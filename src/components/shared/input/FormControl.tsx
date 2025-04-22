import { cn } from "@/utils/helpers";
import React from "react";

interface FormControlProps {
  children: React.ReactNode;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
}
function FormControl({
  children,
  isReadOnly,
  isRequired,
  isInvalid,
}: FormControlProps) {
  return (
    <div className="w-full">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          let additionalClassName = "";
          if (isInvalid) {
            additionalClassName =
              "ring-destructive text-destructive  placeholder:text-destructive focus:ring-destructive";
          }
          return React.cloneElement(
            child as any,
            {
              disabled: isReadOnly,
              required: isRequired,
              className: cn(
                (child as any).props.className,
                additionalClassName
              ),
              // isInvalid,
            } as any
          );
        }
      })}
    </div>
  );
}

function Label({ children, isRequired, className, htmlFor = "" }: any) {
  const classes = cn(
    "text-left block text-sm font-medium leading-6 text-black",
    className
  );
  return (
    <label className={classes} htmlFor={htmlFor}>
      {children}
      {isRequired && <span className="mt-2 text-sm text-primary">*</span>}
    </label>
  );
}

interface ErrorMessageProps {
  children: React.ReactNode;
  LeftIcon?: React.ReactNode;
  RightIcon?: React.ReactNode;
  className?: string;
}
function ErrorMessage({
  children,
  LeftIcon,
  RightIcon,
  className,
}: ErrorMessageProps) {
  const classes = cn(className, "mt-2 text-sm text-red-600");
  return (
    <p className={classes}>
      {LeftIcon && LeftIcon}
      {children}
      {RightIcon && RightIcon}
    </p>
  );
}

interface HelperTextProps {
  children: React.ReactNode;
}
function HelperText({ children }: HelperTextProps) {
  return <p className="mt-2 text-sm text-gray-500">{children}</p>;
}

FormControl.Label = Label;
FormControl.ErrorMessage = ErrorMessage;
FormControl.HelperText = HelperText;

export default FormControl;
