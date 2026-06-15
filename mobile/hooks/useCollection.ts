import { useCallback, useEffect, useState } from "react";
import { getCollection, removeFromCollection } from "@/services/collectionService";
import { CollectionSummary } from "@/types/card";

export function useCollection() {
    const [data, setData] = useState<CollectionSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const summary = await getCollection();
            setData(summary);
        } catch (e) {
            setError("No se pudo cargar la colección");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    async function remove(userCardId: number) {
        await removeFromCollection(userCardId);
        await refresh();
    }

    return { data, loading, error, refresh, remove };
}