import { useState } from "react";
import { scanCard } from "@/services/scanService";
import { ScanResult } from "@/types/card";
import { ApiError } from "@/services/api";

export function useScanCard() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ScanResult | null>(null);

    async function scan(photoUri: string) {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await scanCard(photoUri);
            setResult(data);
            return data;
        } catch (e) {
            const message = e instanceof ApiError ? e.message : "No se pudo conectar con el servidor. Comprueba que el backend está encendido."
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }

    function reset() {
        setResult(null);
        setError(null);
    }

    return { scan, loading, error, result, reset };
}