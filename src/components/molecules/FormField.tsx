import * as React from "react";

import { Input } from "@/components/atoms/Input";
import { cn } from "@/lib/utils";

export interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
  inputClassName?: string;
  error?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({
    label,
    id,
    containerClassName,
    inputClassName,
    className,
    error,
    ...props
  }, ref) => {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        <label className="text-sm font-medium text-slate-700" htmlFor={id}>
          {label}
        </label>
        <Input
          ref={ref}
          id={id}
          className={cn(
            inputClassName,
            error && "border-red-300 focus-visible:ring-red-500/40",
            className
          )}
          {...props}
        />
        <p
          className={cn(
            "text-xs leading-tight transition-opacity duration-200 min-h-[1.125rem]",
            error ? "text-red-600 opacity-100" : "opacity-0"
          )}
          role={error ? "alert" : undefined}
        >
          {error || "\u00A0"}
        </p>
      </div>
    );
  }
);

FormField.displayName = "FormField";
