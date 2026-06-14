import { apiFetch } from "./api";
import { ScanResult } from "@/types/card";

/**
 * Envía una foto (uri local del dispositivo) al backend para identificarla.
 */
export async function scanCard(photoUri: string): Promise<ScanResult> {
    const formData = new FormData();

    formData.append("file", {
        uri: photoUri,
        name: "card.jpg",
        type: "image/jpeg",
    } as any);

    return apiFetch<ScanResult>("/scan", {
        method: "POST",
        body: formData,
    });
}