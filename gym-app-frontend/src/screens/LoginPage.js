import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import {
  Loading,
  CustomTextInput,
  CustomButton,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmail,
  setPassword,
  setIsLoading,
  setAuth,
  setUser,
} from "../redux/userSlice";
import Layout from "../components/Layout";
import apiService from "../services/api";

const LoginPage = ({ navigation }) => {
  const { email, password } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validasyon
    if (!email || !email.trim()) {
      Alert.alert("Hata", "Lütfen e-mail adresinizi girin");
      return;
    }
    if (!password || !password.trim()) {
      Alert.alert("Hata", "Lütfen şifrenizi girin");
      return;
    }

    console.log("Login başlatılıyor...");
    console.log("Email:", email.trim().toLowerCase());
    console.log("API Service:", apiService);
    console.log("API Service login fonksiyonu:", typeof apiService?.login);
    console.log("API BaseURL:", apiService?.baseURL);

    if (!apiService || typeof apiService.login !== 'function') {
      console.error("API servisi yüklenemedi!");
      Alert.alert("Hata", "API servisi yüklenemedi. Lütfen uygulamayı yeniden başlatın.");
      return;
    }

    console.log("Loading state ayarlanıyor...");
    try {
      setIsLoading(true);
      console.log("setIsLoading(true) çağrıldı");
    } catch (e) {
      console.error("setIsLoading hatası:", e);
    }
    
    try {
      dispatch(setIsLoading(true));
      console.log("dispatch(setIsLoading(true)) çağrıldı");
    } catch (e) {
      console.error("dispatch hatası:", e);
    }
    
    console.log("Loading state ayarlandı, try bloğuna giriliyor...");

    try {
      console.log("Try bloğu başladı");
      
      // Health check'i atlayalım, direkt login yapalım
      console.log("Login API çağrısı yapılıyor...");
      const loginData = {
        email: email.trim().toLowerCase(),
        password: password,
      };
      console.log("Login data hazırlandı:", { ...loginData, password: '***' });
      console.log("apiService.login çağrılıyor...");
      console.log("apiService object:", apiService);
      console.log("apiService.login type:", typeof apiService.login);
      
      const response = await apiService.login(loginData);
      console.log("apiService.login çağrısı tamamlandı, yanıt alındı");

      console.log("API yanıtı alındı:", response);

      if (response.success && response.data) {
        // Redux state'ini güncelle
        dispatch(setAuth(true));
        dispatch(setEmail(email.trim().toLowerCase()));
        dispatch(setUser(response.data.user)); // Kullanıcı bilgilerini Redux'a kaydet
        
        console.log("Login başarılı, token kaydedildi");
        
        Alert.alert("Başarılı", "Giriş yapıldı!", [
          {
            text: "Tamam",
            onPress: () => {
              // Navigation otomatik olarak rootNavigation'dan isAuth state'ine göre yapılacak
            },
          },
        ]);
      } else {
        console.log("Login başarısız:", response);
        Alert.alert("Hata", response.message || "Giriş başarısız oldu");
      }
    } catch (error) {
      console.error("Login error detayları:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      let errorMessage = "Giriş işlemi sırasında bir hata oluştu";
      
      if (error.message?.includes("Network Error") || error.message?.includes("Cannot connect")) {
        errorMessage = "Backend'e bağlanılamıyor. Backend'in çalıştığından emin olun.";
      } else if (error.response?.status === 401) {
        errorMessage = "E-mail veya şifre hatalı";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Hata", errorMessage);
    } finally {
      console.log("Login işlemi tamamlandı");
      setIsLoading(false);
      dispatch(setIsLoading(false));
    }
  };

  return (
    <Layout>
      {/* edges=['top'] sadece üstteki çentiği korur */}
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.outerContainer}>
          <View style={styles.loginBox}>
            <Image
              style={styles.logo}
              source={require("../../assets/images/logo.png")}
            />

            <Text style={styles.welcome}>GYM APP'E HOŞGELDİN!</Text>

            <CustomTextInput
              title="E-mail"
              isSecureText={false}
              handleonChangeText={(text) => dispatch(setEmail(text))}
              handleValue={email || ""}
              handlePlaceholder="E-mail adresinizi girin"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CustomTextInput
              title="Şifre"
              isSecureText={true}
              handleonChangeText={(text) => dispatch(setPassword(text))}
              handleValue={password || ""}
              handlePlaceholder="Şifrenizi girin"
            />

            <View style={styles.buttonContainer}>
              <CustomButton
                buttonText="GİRİŞ YAP"
                setWidth="100%"
                handleOnPress={handleLogin}
                buttonColor="#FFA040"
                pressedButtonColor="#f89028ff"
                disabled={isLoading}
              />

              <CustomButton
                buttonText="KAYIT OL"
                setWidth="100%"
                handleOnPress={() => navigation.navigate("Signup")}
                buttonColor="#FFA040"
                pressedButtonColor="#f89028ff"
                disabled={isLoading}
              />
            </View>
          </View>

          {isLoading && (
            <Loading changeIsLoading={() => setIsLoading(false)} />
          )}
        </View>
      </SafeAreaView>
    </Layout>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  outerContainer: {
    flex: 1,
    justifyContent: "center", // dikeyde ortalama
    alignItems: "center", // yatayda ortalama
    backgroundColor: "transparent",
    paddingVertical: 20, // azıcık tampon alan (SafeArea için)
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: "contain",
    backgroundColor: "transparent",
  },
  welcome: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 10,
    textAlign: "center",
  },
  loginBox: {
    width: "80%",
    backgroundColor: "rgba(26, 26, 26, 0.85)",
    paddingVertical: 30, // eskisi gibi daha dikey sıkı duruş
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
});
