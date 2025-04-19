"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useController } from "react-hook-form";
import FormControl from "./FormControl";

interface DatePickerProps {
  control: any;
  defaultValue?: string;
  label?: string;
  mode?: "single" | "range" | "multiple";
  name: string;
  minDate?: Date;
  maxDate?: Date;
}
export function DatePicker(props: DatePickerProps) {
  const {
    control,
    defaultValue,
    label = "Pick a date",
    mode = "single",
    name,
    minDate,
    maxDate,
  } = props;
  const [date, setDate] = useState<Date>();

  const { field, fieldState } = useController({
    control: control,
    defaultValue,
    name,
  });

  return (
    <div>
      <FormControl.Label className="mb-1">{label}</FormControl.Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full border-border justify-start text-left font-normal rounded-sm py-1",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP")
            ) : (
              <span>{field?.value?.toLocaleDateString() || label}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white">
          <Calendar
            mode={mode}
            selected={field.value}
            onSelect={field.onChange}
            initialFocus
            fromDate={minDate}
            toDate={maxDate}
          />
        </PopoverContent>
      </Popover>

      <FormControl.ErrorMessage>
        {fieldState.error?.message}
      </FormControl.ErrorMessage>
    </div>
  );
}
