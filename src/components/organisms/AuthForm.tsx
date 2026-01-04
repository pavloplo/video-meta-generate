import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import {
  AUTH_INPUT_IDS,
  AUTH_MODES,
  AUTH_STRINGS,
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

export const AuthForm = ({
  mode,
  values,
  emailRef,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: AuthFormProps) => {
  const inputStyles =
    "border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500/40";

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormField
        ref={emailRef}
        id={AUTH_INPUT_IDS.EMAIL}
        label={AUTH_STRINGS.fields.email.label}
        type="email"
        autoComplete="email"
        required
        placeholder={AUTH_STRINGS.fields.email.placeholder}
        value={values.email}
        inputClassName={inputStyles}
        onChange={(event) => onEmailChange(event.target.value)}
      />
      <FormField
        id={AUTH_INPUT_IDS.PASSWORD}
        label={AUTH_STRINGS.fields.password.label}
        type="password"
        autoComplete={
          mode === AUTH_MODES.LOGIN ? "current-password" : "new-password"
        }
        required
        placeholder={AUTH_STRINGS.fields.password.placeholder}
        value={values.password}
        inputClassName={inputStyles}
        onChange={(event) => onPasswordChange(event.target.value)}
      />
      {mode === AUTH_MODES.SIGNUP && (
        <FormField
          id={AUTH_INPUT_IDS.CONFIRM_PASSWORD}
          label={AUTH_STRINGS.fields.confirmPassword.label}
          type="password"
          autoComplete="new-password"
          required
          placeholder={AUTH_STRINGS.fields.confirmPassword.placeholder}
          value={values.confirmPassword}
          inputClassName={inputStyles}
          onChange={(event) => onConfirmPasswordChange(event.target.value)}
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
