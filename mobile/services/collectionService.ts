import { apiFetch } from "./api";
import { CollectionSummary, ScanResult, UserCardOut } from "@/types/card";

export interface AddToCollectionInput extends ScanResult {
    quantity?: number;
    condition?: string;
    language?: string;
    is_foil?: boolean;
    purchase_price?: number | null;
    notes?: string | null;
}

export async function addToCollection(data: AddToCollectionInput): Promise<UserCardOut> {
    return apiFetch<UserCardOut>("/collection", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function getCollection(): Promise<CollectionSummary> {
    return apiFetch<CollectionSummary>("/collection");
}

export async function removeFromCollection(userCardId: number): Promise<void> {
    await apiFetch(`/collection/${userCardId}`, { method: "DELETE" });
}