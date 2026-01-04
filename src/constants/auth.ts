export const AUTH_MODES = {
  LOGIN: "login",
  SIGNUP: "signup",
} as const;

export type AuthMode = (typeof AUTH_MODES)[keyof typeof AUTH_MODES];

export const AUTH_MODE_OPTIONS = [
  { value: AUTH_MODES.LOGIN, label: "Log in" },
  { value: AUTH_MODES.SIGNUP, label: "Sign up" },
] as const;

export const AUTH_STRINGS = {
  title: {
    [AUTH_MODES.LOGIN]: "Welcome back",
    [AUTH_MODES.SIGNUP]: "Create your account",
  },
  subtitle: {
    [AUTH_MODES.LOGIN]: "Log in to continue generating video metadata.",
    [AUTH_MODES.SIGNUP]: "Sign up to start generating video metadata.",
  },
  fields: {
    email: {
      label: "Email address",
      placeholder: "name@example.com",
    },
    password: {
      label: "Password",
      placeholder: "Enter your password",
    },
    confirmPassword: {
      label: "Confirm password",
      placeholder: "Re-enter your password",
    },
  },
  actions: {
    [AUTH_MODES.LOGIN]: "Log in",
    [AUTH_MODES.SIGNUP]: "Create account",
  },
  toggle: {
    label: "Authentication mode",
    helper: {
      [AUTH_MODES.LOGIN]: "Need an account?",
      [AUTH_MODES.SIGNUP]: "Already have an account?",
    },
    action: {
      [AUTH_MODES.LOGIN]: "Sign up",
      [AUTH_MODES.SIGNUP]: "Log in",
    },
  },
} as const;

export const AUTH_INPUT_IDS = {
  EMAIL: "auth-email",
  PASSWORD: "auth-password",
  CONFIRM_PASSWORD: "auth-confirm-password",
} as const;

export const AUTH_QUERY_KEYS = {
  MODE: "mode",
  TYPE: "type",
  RETURN_TO: "returnTo",
} as const;

export const AUTH_STORAGE_KEYS = {
  RETURN_URL: "auth-return-url",
} as const;

export const AUTH_VALIDATION = {
  email: {
    required: "Email address is required",
    invalid: "Please enter a valid email address",
  },
  password: {
    required: "Password is required",
    minLength: "Password must be at least 8 characters long",
    maxLength: "Password must be less than 128 characters",
  },
  confirmPassword: {
    required: "Please confirm your password",
    mismatch: "Passwords do not match",
  },
} as const;
