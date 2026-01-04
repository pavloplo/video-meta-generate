import { ROUTES } from "@/constants/navigation";

export interface ReturnUrlValidationOptions {
  allowlist?: readonly string[];
  origin?: string;
}

export const RETURN_URL_ALLOWLIST = Object.values(ROUTES);

const DEFAULT_ORIGIN = "http://localhost";

const resolveOrigin = (origin?: string) => {
  if (origin) {
    return origin;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return DEFAULT_ORIGIN;
};

const normalizeReturnUrl = (
  rawValue: string | null | undefined,
  origin: string
): string | null => {
  if (!rawValue) {
    return null;
  }

  const trimmed = rawValue.trim();
  if (!trimmed) {
    return null;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmed, origin);
  } catch {
    return null;
  }

  if (parsedUrl.origin !== new URL(origin).origin) {
    return null;
  }

  const normalizedPath = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;

  if (!normalizedPath.startsWith("/")) {
    return null;
  }

  return normalizedPath;
};

const isAllowedPath = (path: string, allowlist: readonly string[]) =>
  allowlist.some((allowed) => {
    if (allowed === "/") {
      return (
        path === "/" ||
        path.startsWith("/?") ||
        path.startsWith("/#")
      );
    }

    return (
      path === allowed ||
      path.startsWith(`${allowed}/`) ||
      path.startsWith(`${allowed}?`) ||
      path.startsWith(`${allowed}#`)
    );
  });

export const validateReturnUrl = (
  rawValue: string | null | undefined,
  options: ReturnUrlValidationOptions = {}
): string | null => {
  const origin = resolveOrigin(options.origin);
  const normalized = normalizeReturnUrl(rawValue, origin);

  if (!normalized) {
    return null;
  }

  if (options.allowlist && !isAllowedPath(normalized, options.allowlist)) {
    return null;
  }

  return normalized;
};
