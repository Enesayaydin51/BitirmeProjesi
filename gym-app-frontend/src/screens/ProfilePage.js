import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import Layout from "../components/Layout";
import { CustomButton } from "../components";

const ProfilePage = () => {
  const [illnesses, setIllnesses] = useState({
    belFitigi: false,
    dizSakatligi: false,
    yuksekTansiyon: false,
  });

  const [goal, setGoal] = useState("Kilo Alma"); // Varsayılan hedef
  const [weeks, setWeeks] = useState(6); // Örnek: kullanıcı 6 haftadır antrenman yapıyor

  const userData = {
    name: "Efe Şahin",
    email: "efe.sahin@example.com",
    age: 22,
    height: 178,
    weight: 70,
  };

  const toggleIllness = (key) => {
    setIllnesses((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getHealthStatus = () => {
    const { belFitigi, dizSakatligi, yuksekTansiyon } = illnesses;
    let list = [];
    if (belFitigi) list.push("Bel Fıtığı");
    if (dizSakatligi) list.push("Diz Sakatlığı");
    if (yuksekTansiyon) list.push("Yüksek Tansiyon");
    return list.length > 0 ? list.join(", ") : "Yok";
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            style={styles.profileImage}
            source={require("../../assets/images/profiletabicon.png")}
          />
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>

          {/* Kişisel Bilgiler */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Kişisel Bilgiler</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Yaş:</Text>
              <Text style={styles.value}>{userData.age}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Boy:</Text>
              <Text style={styles.value}>{userData.height} cm</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Kilo:</Text>
              <Text style={styles.value}>{userData.weight} kg</Text>
            </View>
          </View>

          {/* Fitness Hedefi */}
          <View style={styles.goalBox}>
            <Text style={styles.infoTitle}>Fitness Hedefi</Text>
            {["Kilo Alma", "Kilo Verme", "Kilo Koruma"].map((item) => (
              <Pressable
                key={item}
                style={[
                  styles.option,
                  goal === item && styles.optionSelected,
                ]}
                onPress={() => setGoal(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    goal === item && styles.optionTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}

            <Text style={styles.selectedText}>
              Seçilen hedef: <Text style={styles.selectedValue}>{goal}</Text>
            </Text>
          </View>

          {/* Hastalık Durumu */}
          <View style={styles.illnessBox}>
            <Text style={styles.infoTitle}>Sağlık Durumu</Text>

            {[
              { key: "belFitigi", label: "Bel Fıtığı" },
              { key: "dizSakatligi", label: "Diz Sakatlığı" },
              { key: "yuksekTansiyon", label: "Yüksek Tansiyon" },
            ].map((item) => (
              <Pressable
                key={item.key}
                style={[
                  styles.option,
                  illnesses[item.key] && styles.optionSelected,
                ]}
                onPress={() => toggleIllness(item.key)}
              >
                <Text
                  style={[
                    styles.optionText,
                    illnesses[item.key] && styles.optionTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}

            <Text style={styles.selectedText}>
              Hastalık:{" "}
              <Text style={styles.selectedValue}>{getHealthStatus()}</Text>
            </Text>
          </View>

          {/* Antrenman Süresi */}
          <View style={styles.trainingBox}>
            <Text style={styles.infoTitle}>Antrenman Süresi</Text>
            <Text style={styles.trainingWeeks}>
              {weeks} haftadır aktif antrenman yapıyor 💪
            </Text>
          </View>

          {/* Kaydet Butonu */}
          <CustomButton
            buttonText="Profili Kaydet"
            setWidth="80%"
            handleOnPress={() =>
              console.log({
                goal,
                illnesses,
                weeks,
              })
            }
            buttonColor="#FFA040"
            pressedButtonColor="#f89028ff"
          />
        </View>
      </ScrollView>
    </Layout>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  container: {
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 26, 0.85)",
    width: "85%",
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 20,
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 10,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#FFA040",
    marginBottom: 15,
  },
  name: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    color: "gray",
    fontSize: 14,
    marginBottom: 20,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  infoTitle: {
    color: "#FFA040",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: {
    color: "#ccc",
    fontWeight: "600",
    fontSize: 15,
  },
  value: {
    color: "white",
    fontSize: 15,
  },
  goalBox: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  illnessBox: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  trainingBox: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
    alignItems: "center",
  },
  option: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingVertical: 10,
    marginVertical: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
  },
  optionSelected: {
    backgroundColor: "#FFA040",
    borderColor: "#f89028",
  },
  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "black",
    fontWeight: "bold",
  },
  selectedText: {
    color: "#ccc",
    marginTop: 15,
    fontSize: 14,
  },
  selectedValue: {
    color: "#FFA040",
    fontWeight: "bold",
  },
  trainingWeeks: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
