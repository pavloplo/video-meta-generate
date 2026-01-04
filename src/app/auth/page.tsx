import { AuthTemplate } from "@/components/templates/AuthTemplate";
import {
  AUTH_MODES,
  AUTH_QUERY_KEYS,
  type AuthMode,
} from "@/constants/auth";

interface AuthPageProps {
  searchParams?:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
}

const resolveAuthMode = (mode: string | undefined): AuthMode => {
  if (mode === AUTH_MODES.SIGNUP) {
    return AUTH_MODES.SIGNUP;
  }

  return AUTH_MODES.LOGIN;
};

const getModeFromSearchParams = (
  searchParams: Record<string, string | string[] | undefined> | undefined
) => {
  if (!searchParams) {
    return undefined;
  }

  const rawValue = searchParams[AUTH_QUERY_KEYS.MODE];
  return typeof rawValue === "string" ? rawValue : undefined;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialMode = resolveAuthMode(
    getModeFromSearchParams(resolvedSearchParams)
  );

  return <AuthTemplate initialMode={initialMode} />;
}
