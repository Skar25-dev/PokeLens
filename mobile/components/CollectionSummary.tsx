import { View, Text, StyleSheet } from "react-native";
import { CollectionSummary } from "@/types/card";

export function CollectionSummaryView({ summary } : { summary: CollectionSummary }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mi Colección</Text>
            <Text style={styles.subtitle}>{summary.total_cards} cartas</Text>

            <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Valor total estimado</Text>
                <Text style={styles.totalValue}>{summary.total_value_eur.toFixed(2)}</Text>
            </View>

            <Text style={styles.sectionTitle}>Desglose por rareza</Text>
            {Object.entries(summary.by_rarity).map(([rarity, info]) => (
                <View key={rarity} style={styles.rarityRow}>
                    <Text style={styles.rarityName}>{rarity}</Text>
                    <Text style={styles.rarityCount}>{info.count} cartas</Text>
                    <Text style={styles.rarityValue}>{info.value.toFixed(2)}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 24, fontWeight: "bold" },
    subtitle: { fontSize: 14, color: "#666", marginBottom: 12},
    totalBox: {
        backgroundColor: "#f0f4ff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    totalLabel: { fontSize: 14, color: "#555" },
    totalValue: { fontSize: 28, fontWeight: "bold", color: "#3b5bdb" },
    sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
    rarityRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    rarityName: { flex: 1, fontWeight: "500" },
    rarityCount: { color: "#666", marginRight: 12 },
    rarityValue: { fontWeight: "600" },
});