import { useState } from "react";
import { useLocalSearchParams, router, Sitemap } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { ScanResult } from "@/types/card";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { addToCollection } from "@/services/collectionService";

const CONDITIONS = [
    { value: "mint", label: "Mint" },
    { value: "near_mint", label: "Near Mint" },
    { value: "excellent", label: "Excellent" },
    { value: "good", label: "Good" },
    { value: "poor", label: "Poor" },
]

export default function ScanResultScreen() {
    const { data } = useLocalSearchParams<{ data: string }>();
    const result: ScanResult = JSON.parse(data);

    const [condition, setCondition] = useState("near_mint");
    const [quantity, setQuantity] = useState(1);
    const [saving, setSaving] = useState(false);

    async function handledAdd() {
        setSaving(true);
        try {
            await addToCollection({ ...result, condition, quantity });
            router.replace("/(tabs)");
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {result.image_url && (
                <Image source={{ uri: result.image_url }} style={styles.image} resizeMode="contain" />
            )}

            <Text style={styles.name}>{result.name}</Text>
            <Text style={styles.meta}>
                {result.set_name} {result.number ? `· #${result.number}` : ""}
            </Text>
            {result.rarity && <Text style={styles.meta}>{result.rarity}</Text>}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Precios actuales</Text>
                <PriceBreakdown prices={result.prices} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Estado de la carta</Text>
                <View style={styles.conditionRow}>
                    {CONDITIONS.map((c) => (
                        <Pressable
                        key={c.value}
                        style={[styles.conditionChip, condition === c.value && styles.conditionChipActive]}
                        onPress={() => setCondition(c.value)}
                        >
                            <Text
                            style={[styles.conditionLabel, condition === c.value && styles.conditionLabelActive]}
                            >
                                {c.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cantidad</Text>
                <View style={styles.quantityRow}>
                    <Pressable
                    style={styles.qtyButton}
                    onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                        <Text style={styles.qtyButtonText}>-</Text>
                    </Pressable>
                    <Text style={styles.qtyValue}>{quantity}</Text>
                    <Pressable style={styles.qtyButton} onPress={() => setQuantity((q) => q + 1)}>
                        <Text style={styles.qtyButtonText}>+</Text>
                    </Pressable>
                </View>
            </View>

            <Pressable style={styles.addButton} onPress={handledAdd} disabled={saving}>
                {saving ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.addButtonText}>Añadir a mi colección</Text>
                )}
            </Pressable> 

            <Pressable style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={styles.cancelButtonText}>Volver a escanear</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, paddingBottom: 40 },
    image: { width: "100%", height: 320, marginBottom: 16 },
    name: { fontSize: 22, fontWeight: "bold" },
    meta: { fontSize: 14, color: "#666", marginTop: 2},
    section: { marginTop: 20 },
    sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
    conditionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    conditionChip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    conditionChipActive: { backgroundColor: "#3b5bdb", borderColor: "#3b5bdb" },
    conditionLabel: { color: "#333" },
    conditionLabelActive: { color: "#fff", fontWeight: "600" },
    quantityRow: { flexDirection: "row", alignItems: "center", gap: 16 },
    qtyButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#eee",
        justifyContent: "center",
        alignItems: "center",
    },
    qtyButtonText: { fontSize: 18, fontWeight: "700" },
    qtyValue: { fontSize: 188, fontWeight: "600", minWidth: 24, textAlign: "center" },
    addButton: {
        backgroundColor: "#3b5bdb",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 28,
    },
    addButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    cancelButton: { alignItems: "center", marginTop: 12, padding: 8 },
    cancelButtonText: { color: "#888" },

});