import { AUTH_STORAGE_KEYS } from "@/constants/auth";
import { ROUTES } from "@/constants/navigation";

/**
 * Redirects to auth page while storing the current return URL in sessionStorage.
 * This avoids exposing return URLs in query parameters.
 */
export const redirectToAuthWithReturnUrl = (returnUrl?: string) => {
  // Store return URL in sessionStorage if provided
  if (returnUrl) {
    sessionStorage.setItem(AUTH_STORAGE_KEYS.RETURN_URL, returnUrl);
  }

  // Redirect to auth without any query parameters
  window.location.href = ROUTES.AUTH;
};
