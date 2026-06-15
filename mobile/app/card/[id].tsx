import { useLocalSearchParams, router } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useCollection } from "@/hooks/useCollection";
import { PriceBreakdown } from "@/components/PriceBreakdown";

export default function CardDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data, remove } = useCollection();

    const item = data?.items.find((i) => String(i.id) === id);

    if (!item) {
        return (
            <View style={styles.center}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    function handleDelete() {
        Alert.alert("Eliminar carta", "¿Seguro que quieres eliminarla de tu colección?", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
              await remove(item!.id);
              router.back();
            },
          },
        ]);
      }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {item.card.image_url && (
                <Image source={{ uri: item.card.image_url }} style={styles.image} resizeMode="contain" />
            )}

            <Text style={styles.name}>{item.card.name}</Text>
            <Text style={styles.meta}>
                {item.card.set_name} {item.card.number ? `· #${item.card.number}` : ""}
            </Text>
            {item.card.rarity && <Text style={styles.meta}>{item.card.rarity}</Text>}

            <View style={styles.detailsBox}>
                <Detail label="Cantidad" value={String(item.quantity)} />
                <Detail label="Estado" value={item.condition} />
                <Detail label="Idioma" value={item.language} />
                {item.purchase_price != null && (
                    <Detail label="Precio de compra" value={`${item.purchase_price.toFixed(2)} €`} />
                )}
                <Detail
                    label="Valor estimado"
                    value={item.estimated_value != null ? `${item.estimated_value.toFixed(2)} €` : "-"}
                    highlight
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Precios de mercado</Text>
                <PriceBreakdown prices={item.current_price} />
            </View>

            {item.notes && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notas</Text>
                    <Text style={styles.notes}>{item.notes}</Text>
                </View>
            )}

            <Pressable style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Eliminar de mi colección</Text>
            </Pressable>
        </ScrollView>
    ); 
}

function Detail({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={[styles.detailValue, highlight && styles.detailValueHighlight]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, paddingBottom: 40 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    image: { width: "100%", height: 320, marginBottom: 16 },
    name: { fontSize: 22, fontWeight: "bold" },
    meta: { fontSize: 14, color: "#666", marginTop: 2 },
    detailsBox: { marginTop: 16, backgroundColor: "#f7f7f9", borderRadius: 10, padding: 12 },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 4,
    },
    detailLabel: { color: "#555" },
    detailValue: { fontWeight: "600" },
    detailValueHighlight: { color: "#3b5bdb", fontSize: 16 },
    section: { marginTop: 20 },
    sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
    notes: { color: "#444" },
    deleteButton: {
      marginTop: 28,
      alignItems: "center",
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#d63939",
    },
    deleteButtonText: { color: "#d63939", fontWeight: "600" },
});