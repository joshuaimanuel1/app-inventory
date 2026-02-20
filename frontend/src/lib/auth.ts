import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  userId: number;
  email: string;
  role: "ADMIN" | "USER";
  exp: number;
}

export const saveAuth = (accessToken: string) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("token", accessToken);

  const decoded = jwtDecode<TokenPayload>(accessToken);
  localStorage.setItem("role", decoded.role);
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const getRole = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role");
};

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
