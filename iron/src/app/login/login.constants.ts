export type LoginType = {
  email: string;
  password: string;
} | null;

export const ERRORS = {
  INVALID_LOGIN: "auth/invalid-login-credential",
  INVALID_LOGIN_2: "auth/invalid-credential",
}