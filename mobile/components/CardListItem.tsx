import { View, Text, Image, StyleSheet, Pressable } from "react-native"
import { UserCardOut } from "@/types/card"
import { router } from "expo-router"

export function CardListItem({ item }: { item: UserCardOut}) {
    return (
        <Pressable
            style={styles.container}
            onPress={() => router.push(`/card/${item.id}`)}
        >
            {item.card.image_url ? (
                <Image source={{ uri: item.card.image_url }} style={styles.image} />
            ) : (
                <View style={[styles.image, styles.placeholder]} />
            )}

            <View style={styles.info}>
                <Text style={styles.name}>{item.card.name}</Text>
                <Text style={styles.meta}>
                    {item.card.set_name} {item.card.number ? `· #${item.card.number}` : ""}
                </Text>
                <Text style={styles.meta}>
                    Cantidad: {item.quantity}· {item.condition}
                </Text>
            </View>

            <Text style={styles.value}>
                {item.estimated_value != null ? `${item.estimated_value.toFixed(2)} €` : "-"} 
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    image: { width: 48, height: 67, borderRadius: 4, marginRight: 12 },
    placeholder: { backgroundColor: "#ddd" },
    info: { flex: 1},
    name: { fontWeight: "600", fontSize: 15 },
    meta: { fontSize: 12, color: "#777" },
    value: { fontWeight: "700", fontSize: 15, marginLeft: 8},
});