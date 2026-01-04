import * as React from "react";

import { Input } from "@/components/atoms/Input";
import { cn } from "@/lib/utils";

export interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
  inputClassName?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({
    label,
    id,
    containerClassName,
    inputClassName,
    className,
    ...props
  }, ref) => {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        <label
          className="text-sm font-medium text-foreground"
          htmlFor={id}
        >
          {label}
        </label>
        <Input
          ref={ref}
          id={id}
          className={cn(inputClassName, className)}
          {...props}
        />
      </div>
    );
  }
);

FormField.displayName = "FormField";
