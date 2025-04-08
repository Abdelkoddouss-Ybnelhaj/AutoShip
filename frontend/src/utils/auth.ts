import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  sub: string;
  username: string;
  login: string;
  role: string;
  "access-token": string;
  exp: number;
  iat: number;
}

const TOKEN_KEY = "auth_token";

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUserFromToken = (token?: string): DecodedToken | null => {
  const tokenToDecode = token || getToken();
  if (!tokenToDecode) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(tokenToDecode);

    if (decoded.exp * 1000 < Date.now()) {
      removeToken();
      return null;
    }

    return decoded;
  } catch (e) {
    console.error("Failed to decode token:", e);
    removeToken();
    return null;
  }
};
