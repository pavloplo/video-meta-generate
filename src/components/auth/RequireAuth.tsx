"use client";

import { useEffect, ReactNode } from "react";
import { redirectToAuthWithReturnUrl } from "@/lib/auth/redirect-to-auth";

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * Client component that checks authentication and redirects to auth page
 * if user is not authenticated. Stores the current URL in sessionStorage
 * before redirecting.
 */
export const RequireAuth = ({ children }: RequireAuthProps) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        if (!response.ok) {
          // Store current URL and redirect to auth
          const currentUrl = `${window.location.pathname}${window.location.search}`;
          redirectToAuthWithReturnUrl(currentUrl);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // On error, redirect to auth anyway
        const currentUrl = `${window.location.pathname}${window.location.search}`;
        redirectToAuthWithReturnUrl(currentUrl);
      }
    };

    checkAuth();
  }, []);

  return <>{children}</>;
};
