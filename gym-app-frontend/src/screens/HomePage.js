import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ImageBackground,
} from "react-native";
import Layout from "../components/Layout";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 📌 Steppage entegrasyonu için

const HomePage = ({ navigation }) => {
  const [stepCount, setStepCount] = useState(0);

  // 📌 Steppage ile entegre – adım sayısını storage’dan çekiyoruz
  useEffect(() => {
    const getSteps = async () => {
      const savedSteps = await AsyncStorage.getItem("stepCount");
      if (savedSteps) setStepCount(Number(savedSteps));
    };
    getSteps();
  }, []);

  const bigCards = [
    {
      title: "Egzersizler",
      route: "Exercises",
      image: require("../../assets/images/homepageicons/exercises.png"),
    },
    {
      title: "Beslenme",
      route: "Diet",
      image: require("../../assets/images/homepageicons/beslenme.png"),
    },
  ];

  // 📌 Yarı boyutlu kartlar (yan yana)
  const smallCards = [
    {
      title: `Adım Sayısı: ${stepCount}`,
      route: "Steppage",
    },
    {
      title: "Formunu Yapay Zekaya Yorumlat\n(YAKINDA)",
      route: null, // Henüz aktif değil
    },
  ];

  return (
    <Layout>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Ana Sayfa</Text>

          {/* 📌 Büyük kartlar */}
          {bigCards.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => navigation.navigate(item.route)}
              style={({ pressed }) => [
                styles.cardWrapper,
                pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
              ]}
            >
              <ImageBackground
                source={item.image}
                style={styles.card}
                imageStyle={{ borderRadius: 16 }}
              >
                <View style={styles.overlay} />
                <Text style={styles.cardText}>{item.title}</Text>
              </ImageBackground>
            </Pressable>
          ))}

          {/* 📌 Yarı boyutlu küçük kartlar (YAN YANA) */}
          <View style={styles.smallCardsContainer}>
            {smallCards.map((item, index) => (
              <Pressable
                key={index}
                disabled={!item.route}
                onPress={() => item.route && navigation.navigate(item.route)}
                style={({ pressed }) => [
                  styles.smallCardWrapper,
                  pressed && item.route && { opacity: 0.8, transform: [{ scale: 0.97 }] },
                ]}
              >
                <View style={styles.smallCard}>
                  <Text style={styles.smallCardText}>{item.title}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

export default HomePage;

// 🎨 STYLES – Hiçbir şeyi bozmadan sadece ekleme yaptım
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 50,
    paddingTop: 20,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },
  cardWrapper: {
    width: "90%",
    marginBottom: 15,
  },
  card: {
    height: 150,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "flex-end",
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  cardText: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    zIndex: 2,
  },

  // 📌 Küçük kartlar (yarım boy ve yan yana)
  smallCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 10,
  },
  smallCardWrapper: {
    width: "48%", // Yan yana
  },
  smallCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    height: 170,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  smallCardText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
