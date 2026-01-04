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
    <main className="flex min-h-screen items-center justify-center bg-slate-50/80 px-4 py-12 text-slate-900">
      <Card className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader className="space-y-3 p-0 pb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-500">
            {AUTH_STRINGS.toggle.label}
          </p>
          <CardTitle className="text-2xl font-semibold text-slate-950">
            {AUTH_STRINGS.title[mode]}
          </CardTitle>
          <Typography className="text-sm text-slate-600">
            {AUTH_STRINGS.subtitle[mode]}
          </Typography>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
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
          <div className="text-center text-sm text-slate-500">
            {AUTH_STRINGS.toggle.helper[mode]}{" "}
            <button
              className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
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
