import { View, Text, StyleSheet } from "react-native";
import { CardPrices } from "@/types/card";

export function PriceBreakdown({ prices }: { prices: CardPrices | null }) {
    if (!prices || (!prices.cardmarket && !prices.tcgplayer)) {
        return <Text style={styles.empty}>No hay datos de precio disponibles para esta carta</Text>
    }

    return(
        <View style={styles.container}>
            {prices.cardmarket && (
                <View style={styles.block}>
                    <Text style={styles.source}>Cardmarket</Text>
                    <Row label="Precio mínimo" value={prices.cardmarket.low} currency="€" />
                    <Row label="Precio tendencia" value={prices.cardmarket.trend} currency="€" />
                    <Row label="Media de 30 días" value={prices.cardmarket.avg30} currency="€" />
                </View>
            )}

            {prices.tcgplayer && (
                <View style={styles.block}>
                    <Text style={styles.source}>TCGPlayer</Text>
                    <Row label="Precio mínimo" value={prices.tcgplayer.low} currency="€" />
                    <Row label="Precio medio" value={prices.tcgplayer.mid} currency="€" />
                    <Row label="Precio mercado" value={prices.tcgplayer.market} currency="€" />
                </View>
            )}
        </View>
        
    );
}

function Row({ label, value, currency }: { label: string; value: number | null | undefined; currency: string }) {
    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value != null ? `${value.toFixed(2)} ${currency}` : "-"}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 12 },
    block: { backgroundColor: "#f7f7f9", borderRadius: 10, padding: 12 },
    source: { fontWeight: "700", marginBottom: 6 },
    row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
    label: { color: "#555" },
    value: { fontWeight: "600" },
    empty: { color: "#888", fontStyle: "italic" },
});