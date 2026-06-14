export const API_URL = process.env.EXPO_PUBLIC_API_URL

export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export async function apiFetch <T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...(options.body && !(options.body instanceof FormData)
            ? { "Content-Type": "application/json" }
            : {}),
        ...options.headers,
        },
    });

    if (!res.ok) {
        let detail = res.statusText;
        try {
            const errBody = await res.json();
            detail = errBody.detail || detail;
        } catch {

        }
        throw new ApiError(res.status, detail);
    }

    return res.json() as Promise<T>;
}