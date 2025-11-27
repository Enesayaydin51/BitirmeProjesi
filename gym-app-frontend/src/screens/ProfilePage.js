import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  Modal,
  TextInput
} from "react-native";
import Layout from "../components/Layout";
import { CustomButton } from "../components";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfilePage = () => {
  const [modalType, setModalType] = useState(null); // "goal", "health", "personal"
  const [illnesses, setIllnesses] = useState({
    belFitigi: false,
    dizSakatligi: false,
    yuksekTansiyon: false,
  });
  const [goal, setGoal] = useState("Kilo Alma");
  const [userData, setUserData] = useState({
    name: "Efe Şahin",
    email: "efe.sahin@example.com",
    age: 22,
    height: 178,
    weight: 70,
  });
  const [weeks, setWeeks] = useState(0);

  // ⏱ Uygulama yüklenme tarihine göre antrenman süresini hesapla
  useEffect(() => {
    AsyncStorage.getItem("installDate").then((date) => {
      if (!date) {
        const today = new Date().toISOString();
        AsyncStorage.setItem("installDate", today);
        return setWeeks(0);
      }
      const start = new Date(date);
      const now = new Date();
      const diffWeeks = Math.floor((now - start) / (1000 * 60 * 60 * 24 * 7));
      setWeeks(diffWeeks);
    });
  }, []);

  // Sağlık durumu metni
  const getHealthStatus = () => {
    const list = [];
    if (illnesses.belFitigi) list.push("Bel Fıtığı");
    if (illnesses.dizSakatligi) list.push("Diz Sakatlığı");
    if (illnesses.yuksekTansiyon) list.push("Yüksek Tansiyon");
    return list.length ? list.join(", ") : "Yok";
  };

  // Kişisel bilgi değişiklikleri
  const updatePersonalInfo = (key, value) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Image
            style={styles.profileImage}
            source={require("../../assets/images/profiletabicon.png")}
          />
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>

          {/* Kişisel Bilgiler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            {["Yaş", "Boy", "Kilo"].map((item, i) => (
              <View key={i} style={styles.infoRow}>
                <Text style={styles.label}>{item}</Text>
                <Text style={styles.value}>
                  {item === "Yaş" && userData.age}
                  {item === "Boy" && userData.height + " cm"}
                  {item === "Kilo" && userData.weight + " kg"}
                </Text>
              </View>
            ))}
            <Pressable
              style={styles.smallButton}
              onPress={() => setModalType("personal")}
            >
              <Text style={styles.buttonText}>Düzenle</Text>
            </Pressable>
          </View>

          {/* Fitness Hedefi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fitness Hedefi</Text>
            <Text style={styles.subText}>
              {goal} seçildi
            </Text>
            <Pressable
              style={styles.smallButton}
              onPress={() => setModalType("goal")}
            >
              <Text style={styles.buttonText}>Hedef Seç</Text>
            </Pressable>
          </View>

          {/* Sağlık Durumu */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sağlık Durumu</Text>
            <Text style={styles.subText}>Durum: {getHealthStatus()}</Text>
            <Pressable
              style={styles.smallButton}
              onPress={() => setModalType("health")}
            >
              <Text style={styles.buttonText}>Sağlığı Ayarla</Text>
            </Pressable>
          </View>

          {/* Antrenman Süresi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Antrenman Süresi</Text>
            <Text style={styles.trainingText}>
              {weeks} haftadır aktif 💪
            </Text>
          </View>

          <CustomButton
            buttonText="Profili Kaydet"
            setWidth="80%"
            handleOnPress={() => console.log({ goal, illnesses, weeks })}
            buttonColor="#D6B982"
            pressedButtonColor="#c89b65"
            textColor="#000"
          />
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={!!modalType} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {modalType === "goal"
                ? "Fitness Hedefi Seç"
                : modalType === "health"
                ? "Sağlık Durumunu Ayarla"
                : "Kişisel Bilgileri Düzenle"}
            </Text>

            {/* Hedef Seçme */}
            {modalType === "goal" &&
              ["Kilo Alma", "Kilo Verme", "Kilo Koruma"].map((item) => (
                <Pressable
                  key={item}
                  style={[styles.option, goal === item && styles.optionSelected]}
                  onPress={() => {
                    setGoal(item);
                    setModalType(null);
                  }}
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

            {/* Sağlık Durumu */}
            {modalType === "health" &&
              Object.entries(illnesses).map(([key, value]) => (
                <Pressable
                  key={key}
                  style={[styles.option, value && styles.optionSelected]}
                  onPress={() => setIllnesses((prev) => ({ ...prev, [key]: !prev[key] }))}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value && styles.optionTextSelected,
                    ]}
                  >
                    {key === "belFitigi" && "Bel Fıtığı"}
                    {key === "dizSakatligi" && "Diz Sakatlığı"}
                    {key === "yuksekTansiyon" && "Yüksek Tansiyon"}
                  </Text>
                </Pressable>
              ))}

            {/* Kişisel Bilgi Düzenleme */}
            {modalType === "personal" &&
              ["Yaş", "Boy", "Kilo"].map((key) => (
                <TextInput
                  key={key}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder={key + ""}
                  placeholderTextColor="#aaa"
                  onChangeText={(text) => updatePersonalInfo(key, text)}
                />
              ))}

            <Pressable
              style={[styles.smallButton, { marginTop: 15 }]}
              onPress={() => setModalType(null)}
            >
              <Text style={styles.buttonText}>Kapat</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

export default ProfilePage;


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 30,
  },
  card: {
    backgroundColor: "rgba(15,15,15,0.9)",
    width: "88%",
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    shadowColor: "#D6B982",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 12,
  },
  profileImage: {
    width: 115,
    height: 115,
    borderRadius: 60,
    borderWidth: 2.2,
    borderColor: "#D6B982",
    marginBottom: 15,
  },
  name: {
    color: "white",
    fontSize: 23,
    fontWeight: "700",
  },
  email: {
    color: "#999",
    fontSize: 14,
    marginBottom: 25,
  },
  section: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#D6B982",
    textAlign: "center",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  label: { color: "#ccc", fontSize: 15 },
  value: { color: "#fff", fontSize: 15, fontWeight: "600" },
  option: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,  
    marginVertical: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
    transition: "0.2s",
  },
  optionSelected: {
    backgroundColor: "#D6B982",
    borderColor: "#c89b65",
  },
  optionText: { color: "white", fontSize: 16 },
  optionTextSelected: { color: "black", fontWeight: "700" },
  subText: { color: "#aaa", marginTop: 12, fontSize: 14, textAlign: "center" },
  highlight: { color: "#D6B982", fontWeight: "bold" },
  trainingText: { color: "white", fontSize: 16, textAlign: "center" },

  smallButton: {
  backgroundColor: "#D6B982",
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 8,
  marginTop: 10,
  alignItems: "center",
},

buttonText: { color: "black", fontSize: 15, fontWeight: "600" ,  },
modalBackground: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.7)",
},
modalContainer: {
  width: "85%",
  backgroundColor: "#222",
  padding: 20,
  borderRadius: 16,
  alignItems: "center",
},
modalTitle: {
  fontSize: 18,
  color: "#D6B982",
  fontWeight: "700",
  marginBottom: 15,
},
input: {
  width: "100%",
  backgroundColor: "#333",
  borderRadius: 10,
  padding: 10,
  color: "white",
  marginTop: 6,
},

});
