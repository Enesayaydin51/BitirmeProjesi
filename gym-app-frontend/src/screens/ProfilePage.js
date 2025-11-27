import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import Layout from "../components/Layout";
import { CustomButton } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails, clearUser } from "../redux/userSlice";
import apiService from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, userDetails } = useSelector((state) => state.user);
  
  const [illnesses, setIllnesses] = useState({
    belFitigi: false,
    dizSakatligi: false,
    yuksekTansiyon: false,
  });

  const [goal, setGoal] = useState("Kilo Alma"); // Varsayılan hedef
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    loadUserData();
    loadUserDetails();
  }, [user, userDetails]);

  const loadUserData = async () => {
    try {
      // Önce Redux'tan kontrol et
      if (user) {
        setUserData(user);
        return;
      }
      
      // Redux'ta yoksa AsyncStorage'dan yükle
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const parsedUser = JSON.parse(userString);
        setUserData(parsedUser);
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenirken hata:', error);
    }
  };

  const loadUserDetails = async () => {
    try {
      // Önce Redux'tan kontrol et
      if (userDetails) {
        setHeight(userDetails.height?.toString() || "");
        setWeight(userDetails.weight?.toString() || "");
        setGoal(userDetails.goal || "Kilo Alma");
        if (userDetails.injuries) {
          const injuriesArray = Array.isArray(userDetails.injuries) 
            ? userDetails.injuries 
            : [];
          setIllnesses({
            belFitigi: injuriesArray.includes("Bel Fıtığı"),
            dizSakatligi: injuriesArray.includes("Diz Sakatlığı"),
            yuksekTansiyon: injuriesArray.includes("Yüksek Tansiyon"),
          });
        }
        return;
      }

      // Backend'den user details çek
      const response = await apiService.getUserDetails();
      console.log('User details response:', response);
      if (response.success && response.data) {
        console.log('User details data:', response.data);
        console.log('Goal from backend:', response.data.goal);
        dispatch(setUserDetails(response.data));
        setHeight(response.data.height?.toString() || "");
        setWeight(response.data.weight?.toString() || "");
        setGoal(response.data.goal || "Kilo Alma");
        console.log('Goal set to:', response.data.goal || "Kilo Alma");
        if (response.data.injuries) {
          const injuriesArray = Array.isArray(response.data.injuries) 
            ? response.data.injuries 
            : [];
          setIllnesses({
            belFitigi: injuriesArray.includes("Bel Fıtığı"),
            dizSakatligi: injuriesArray.includes("Diz Sakatlığı"),
            yuksekTansiyon: injuriesArray.includes("Yüksek Tansiyon"),
          });
        }
      }
    } catch (error) {
      console.error('User details yüklenirken hata:', error);
      // İlk kez açılıyorsa hata normal, detaylar henüz kaydedilmemiş olabilir
    }
  };

  const getUserFullName = () => {
    if (userData) {
      if (userData.firstName && userData.lastName) {
        return `${userData.firstName} ${userData.lastName}`;
      }
      return userData.email?.split('@')[0] || "Kullanıcı";
    }
    return "Kullanıcı";
  };

  const getUserEmail = () => {
    return userData?.email || "";
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

  const getTrainingDays = () => {
    // Kullanıcının kayıt tarihini al
    const registrationDate = userData?.createdAt || user?.createdAt;
    
    if (!registrationDate) {
      return 1; // Tarih yoksa varsayılan olarak 1 gün göster
    }

    // Tarih string'ini Date objesine çevir
    const registration = new Date(registrationDate);
    const today = new Date();
    
    // Bugünün başlangıcını al (saat, dakika, saniye sıfırla)
    today.setHours(0, 0, 0, 0);
    registration.setHours(0, 0, 0, 0);
    
    // Gün farkını hesapla
    const diffTime = today - registration;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // En az 1 gün göster (bugün kayıt olanlar için de 1 gün)
    return Math.max(1, diffDays);
  };

  const getInjuriesArray = () => {
    const { belFitigi, dizSakatligi, yuksekTansiyon } = illnesses;
    let list = [];
    if (belFitigi) list.push("Bel Fıtığı");
    if (dizSakatligi) list.push("Diz Sakatlığı");
    if (yuksekTansiyon) list.push("Yüksek Tansiyon");
    return list;
  };

  const handleSaveProfile = async () => {
    console.log('=== HANDLE SAVE PROFILE ===');
    console.log('Current goal state:', goal);
    console.log('Goal type:', typeof goal);
    console.log('Goal value:', goal);
    console.log('Is goal empty?', !goal);
    
    if (!height || !weight) {
      Alert.alert("Hata", "Lütfen boy ve kilo bilgilerini girin");
      return;
    }

    if (!goal || goal.trim() === '') {
      Alert.alert("Hata", "Lütfen bir fitness hedefi seçin");
      return;
    }

    setIsLoading(true);
    try {
      const detailsData = {
        height: parseInt(height),
        weight: parseFloat(weight),
        injuries: getInjuriesArray(),
        goal: goal.trim(), // Fitness hedefini ekle ve trim et
      };

      console.log('Saving profile with data:', JSON.stringify(detailsData, null, 2));
      console.log('Goal in detailsData:', detailsData.goal);
      const response = await apiService.updateUserDetails(detailsData);
      console.log('Update response:', response);
      
      if (response.success) {
        console.log('Response data:', response.data);
        console.log('Goal in response:', response.data?.goal);
        dispatch(setUserDetails(response.data));
        Alert.alert("Başarılı", "Profil bilgileriniz kaydedildi");
      } else {
        Alert.alert("Hata", response.message || "Profil kaydedilirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Profil kaydetme hatası:", error);
      Alert.alert("Hata", error.message || "Profil kaydedilirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Çıkış yapmak istediğinize emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            try {
              // AsyncStorage'dan token ve user bilgilerini temizle
              await apiService.logout();
              
              // Redux state'ini temizle
              dispatch(clearUser());
              
              console.log("Çıkış yapıldı");
            } catch (error) {
              console.error("Çıkış yapma hatası:", error);
              // Hata olsa bile Redux state'ini temizle
              dispatch(clearUser());
            }
          }
        }
      ]
    );
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            style={styles.profileImage}
            source={require("../../assets/images/profiletabicon.png")}
          />
          <Text style={styles.name}>{getUserFullName()}</Text>
          <Text style={styles.email}>{getUserEmail()}</Text>

          {/* Kişisel Bilgiler */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Kişisel Bilgiler</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Boy (cm):</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="Boy"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Kilo (kg):</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="Kilo"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
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
                onPress={() => {
                  console.log('Goal seçildi:', item);
                  setGoal(item);
                  console.log('Goal state güncellendi:', item);
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
              {getTrainingDays()} gündür gym app ile antrenman yapıyorsunuz 💪
            </Text>
          </View>

          {/* Kaydet Butonu */}
          <CustomButton
            buttonText="Profili Kaydet"
            setWidth="80%"
            handleOnPress={handleSaveProfile}
            buttonColor="#FFA040"
            pressedButtonColor="#f89028ff"
            disabled={isLoading}
          />

          {/* Çıkış Yap Butonu */}
          <CustomButton
            buttonText="Çıkış Yap"
            setWidth="80%"
            handleOnPress={handleLogout}
            buttonColor="#ff4444"
            pressedButtonColor="#cc0000"
            disabled={isLoading}
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
  input: {
    color: "white",
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#FFA040",
    paddingVertical: 5,
    paddingHorizontal: 10,
    minWidth: 80,
    textAlign: "right",
  },
});
