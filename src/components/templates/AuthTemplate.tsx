"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";
import { AuthModeToggle } from "@/components/molecules/AuthModeToggle";
import { AuthForm, type AuthFormValues } from "@/components/organisms/AuthForm";
import {
  AUTH_MODES,
  AUTH_STORAGE_KEYS,
  AUTH_STRINGS,
  type AuthMode,
} from "@/constants/auth";
import { ROUTES } from "@/constants/navigation";
import {
  RETURN_URL_ALLOWLIST,
  validateReturnUrl,
} from "@/lib/auth/return-url";

export interface AuthTemplateProps {
  initialMode: AuthMode;
  returnTo?: string;
}

export const AuthTemplate = ({ initialMode, returnTo }: AuthTemplateProps) => {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [values, setValues] = useState<AuthFormValues>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!returnTo) {
      return;
    }

    const validatedReturnUrl = validateReturnUrl(returnTo, {
      allowlist: RETURN_URL_ALLOWLIST,
    });

    if (validatedReturnUrl) {
      sessionStorage.setItem(
        AUTH_STORAGE_KEYS.RETURN_URL,
        validatedReturnUrl
      );
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.RETURN_URL);
    }
  }, [returnTo]);

  const consumeReturnUrl = () => {
    const storedValue = sessionStorage.getItem(AUTH_STORAGE_KEYS.RETURN_URL);
    const validatedReturnUrl = validateReturnUrl(storedValue, {
      allowlist: RETURN_URL_ALLOWLIST,
    });

    sessionStorage.removeItem(AUTH_STORAGE_KEYS.RETURN_URL);

    return validatedReturnUrl ?? ROUTES.HOME;
  };

  const handleModeChange = (nextMode: AuthMode) => {
    if (nextMode === mode) {
      return;
    }

    setIsTransitioning(true);

    // Start transition
    setTimeout(() => {
      setMode(nextMode);
      setValues((current) => ({
        ...current,
        password: "",
        confirmPassword: "",
      }));

      // End transition after content has changed
      setTimeout(() => {
        setIsTransitioning(false);
        window.requestAnimationFrame(() => {
          emailRef.current?.focus();
        });
      }, 150);
    }, 150);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const destination = consumeReturnUrl();
    router.replace(destination);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50/80 px-4 py-12 text-slate-900">
      <Card className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader className="space-y-3 p-0 pb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-500">
            {AUTH_STRINGS.toggle.label}
          </p>
          <CardTitle
            className={`text-2xl font-semibold text-slate-950 transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 transform translate-y-1' : 'opacity-100 transform translate-y-0'
              }`}
          >
            {AUTH_STRINGS.title[mode]}
          </CardTitle>
          <Typography
            className={`text-sm text-slate-600 transition-all duration-300 ease-in-out delay-75 ${isTransitioning ? 'opacity-0 transform translate-y-1' : 'opacity-100 transform translate-y-0'
              }`}
          >
            {AUTH_STRINGS.subtitle[mode]}
          </Typography>
        </CardHeader>
        <CardContent
          className={`space-y-6 p-0 transition-all duration-300 ease-in-out delay-100 ${isTransitioning ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
            }`}
        >
          <AuthModeToggle mode={mode} onModeChange={handleModeChange} />
          <AuthForm
            key={mode}
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
