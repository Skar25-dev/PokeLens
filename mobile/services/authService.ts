import * as SecureStore from "expo-secure-store";
import { apiFetch } from "./api";

const TOKEN_KEY = "pokelens_token";

interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface UserOut {
    id: number;
    email: string;
    name: string | null;
}

export async function register(email: string, password: string, name?: string) {
    const res = await apiFetch<TokenResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
    });
    await SecureStore.setItemAsync(TOKEN_KEY, res.access_token)
}

export async function login(email: string, password: string) {
    const res = await apiFetch<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
    await SecureStore.setItemAsync(TOKEN_KEY, res.access_token);
}

export async function logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getMe(): Promise<UserOut> {
    return apiFetch<UserOut>("/auth/me");
}