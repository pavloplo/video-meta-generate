"use client";

import { useRef, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";
import { AuthModeToggle } from "@/components/molecules/AuthModeToggle";
import { AuthForm, type AuthFormValues } from "@/components/organisms/AuthForm";
import {
  AUTH_MODES,
  AUTH_STRINGS,
  type AuthMode,
} from "@/constants/auth";

export interface AuthTemplateProps {
  initialMode: AuthMode;
}

export const AuthTemplate = ({ initialMode }: AuthTemplateProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [values, setValues] = useState<AuthFormValues>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const emailRef = useRef<HTMLInputElement>(null);

  const handleModeChange = (nextMode: AuthMode) => {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    setValues((current) => ({
      ...current,
      password: "",
      confirmPassword: "",
    }));

    window.requestAnimationFrame(() => {
      emailRef.current?.focus();
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle>{AUTH_STRINGS.title[mode]}</CardTitle>
          <Typography className="text-sm text-muted-foreground">
            {AUTH_STRINGS.subtitle[mode]}
          </Typography>
        </CardHeader>
        <CardContent className="space-y-6">
          <AuthModeToggle mode={mode} onModeChange={handleModeChange} />
          <AuthForm
            mode={mode}
            values={values}
            emailRef={emailRef}
            onEmailChange={(email) =>
              setValues((current) => ({ ...current, email }))
            }
            onPasswordChange={(password) =>
              setValues((current) => ({ ...current, password }))
            }
            onConfirmPasswordChange={(confirmPassword) =>
              setValues((current) => ({ ...current, confirmPassword }))
            }
            onSubmit={handleSubmit}
          />
          <div className="text-center text-sm text-muted-foreground">
            {AUTH_STRINGS.toggle.helper[mode]}{" "}
            <button
              className="font-medium text-primary hover:underline"
              type="button"
              onClick={() =>
                handleModeChange(
                  mode === AUTH_MODES.LOGIN
                    ? AUTH_MODES.SIGNUP
                    : AUTH_MODES.LOGIN
                )
              }
            >
              {AUTH_STRINGS.toggle.action[mode]}
            </button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};
