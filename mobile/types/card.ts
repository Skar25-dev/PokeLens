export interface CardPrices {
    cardmarket?: {
        low: number | null;
        trend: number | null;
        avg30: number | null;
        currency: string;
    };
    tcgplayer?: {
        low: number | null;
        mid: number | null;
        market: number | null;
        currency: string;
    };
}

export interface ScanResult {
    name: string;
    set_name: string | null;
    number: string | null;
    rarity: string | null;
    image_url: string | null;
    pokemontcg_id: string | null;
    prices: CardPrices | null;
}

export interface CardOut {
    id: number;
    pokemontcg_id: string | null;
    name: string;
    set_name: string | null;
    number: string | null;
    rarity: string | null;
    image_url: string | null;
}

export interface UserCardOut {
    id: number;
    quantity: number;
    condition: string;
    language: string;
    is_foil: boolean;
    purchase_price: number | null;
    notes: string | null;
    card: CardOut;
    current_price: CardPrices | null;
    estimated_value: number | null;
}

export interface CollectionSummary {
    total_cards: number;
    total_value_eur: number;
    by_rarity: Record<string, { count: number; value: number }>;
    items: UserCardOut[];
}