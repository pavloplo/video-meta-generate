import { useState } from "react";

import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import {
  AUTH_INPUT_IDS,
  AUTH_MODES,
  AUTH_STRINGS,
  AUTH_VALIDATION,
  type AuthMode,
} from "@/constants/auth";

export interface AuthFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthFormProps {
  mode: AuthMode;
  values: AuthFormValues;
  emailRef?: React.Ref<HTMLInputElement>;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export interface AuthFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const AuthForm = ({
  mode,
  values,
  emailRef,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: AuthFormProps) => {
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const inputStyles =
    "border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500/40";

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return AUTH_VALIDATION.email.required;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return AUTH_VALIDATION.email.invalid;
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return AUTH_VALIDATION.password.required;
    }
    if (password.length < 8) {
      return AUTH_VALIDATION.password.minLength;
    }
    if (password.length >= 128) {
      return AUTH_VALIDATION.password.maxLength;
    }
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (!confirmPassword) {
      return AUTH_VALIDATION.confirmPassword.required;
    }
    if (confirmPassword !== password) {
      return AUTH_VALIDATION.confirmPassword.mismatch;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: AuthFormErrors = {};

    newErrors.email = validateEmail(values.email);
    newErrors.password = validatePassword(values.password);

    if (mode === AUTH_MODES.SIGNUP) {
      newErrors.confirmPassword = validateConfirmPassword(values.confirmPassword, values.password);
    }

    setErrors(newErrors);

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Return true if no errors
    return Object.values(newErrors).every(error => !error);
  };

  const handleEmailChange = (value: string) => {
    onEmailChange(value);
    if (touched.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (value: string) => {
    onPasswordChange(value);
    if (touched.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    }
    // Also validate confirm password if in signup mode and it's been touched
    if (mode === AUTH_MODES.SIGNUP && touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: validateConfirmPassword(values.confirmPassword, value)
      }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    onConfirmPasswordChange(value);
    if (touched.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(value, values.password) }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      onSubmit(event);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <FormField
        ref={emailRef}
        id={AUTH_INPUT_IDS.EMAIL}
        label={AUTH_STRINGS.fields.email.label}
        type="email"
        autoComplete="email"
        placeholder={AUTH_STRINGS.fields.email.placeholder}
        value={values.email}
        inputClassName={inputStyles}
        error={errors.email}
        onChange={(event) => handleEmailChange(event.target.value)}
        onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
      />
      <FormField
        id={AUTH_INPUT_IDS.PASSWORD}
        label={AUTH_STRINGS.fields.password.label}
        type="password"
        autoComplete={
          mode === AUTH_MODES.LOGIN ? "current-password" : "new-password"
        }
        placeholder={AUTH_STRINGS.fields.password.placeholder}
        value={values.password}
        inputClassName={inputStyles}
        error={errors.password}
        onChange={(event) => handlePasswordChange(event.target.value)}
        onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
      />
      {mode === AUTH_MODES.SIGNUP && (
        <FormField
          id={AUTH_INPUT_IDS.CONFIRM_PASSWORD}
          label={AUTH_STRINGS.fields.confirmPassword.label}
          type="password"
          autoComplete="new-password"
          placeholder={AUTH_STRINGS.fields.confirmPassword.placeholder}
          value={values.confirmPassword}
          inputClassName={inputStyles}
          error={errors.confirmPassword}
          onChange={(event) => handleConfirmPasswordChange(event.target.value)}
          onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
        />
      )}
      <Button
        className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-[0_15px_35px_-20px_rgba(79,70,229,0.8)] transition hover:from-indigo-500 hover:to-sky-400"
        type="submit"
        variant="ghost"
      >
        {AUTH_STRINGS.actions[mode]}
      </Button>
    </form>
  );
};
