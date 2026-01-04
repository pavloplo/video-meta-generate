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
          onChange={(event) => onConfirmPasswordChange(event.target.value)}
        />
      )}
      <Button className="w-full" type="submit">
        {AUTH_STRINGS.actions[mode]}
      </Button>
    </form>
  );
};
