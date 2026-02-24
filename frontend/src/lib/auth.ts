import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  userId: number;
  email: string;
  role: "ADMIN" | "USER";
  exp: number;
}

//cookie helper
const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];

  return value || null;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};

//auth
export const saveAuth = (accessToken: string) => {
  if (typeof window === "undefined") return;

  const decoded = jwtDecode<TokenPayload>(accessToken);

  //simpan token ke cookie (1 hari)
  setCookie("accessToken", accessToken, 60 * 60 * 24);

  //simpan role ke cookie (optional, biar cepat akses)
  setCookie("role", decoded.role, 60 * 60 * 24);
};

export const getToken = (): string | null => {
  const token = getCookie("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    //cek expired
    if (decoded.exp * 1000 < Date.now()) {
      logout();
      return null;
    }

    return token;
  } catch {
    logout();
    return null;
  }
};

export const getRole = (): "ADMIN" | "USER" | null => {
  return getCookie("role") as "ADMIN" | "USER" | null;
};

export const logout = () => {
  removeCookie("accessToken");
  removeCookie("role");
};
