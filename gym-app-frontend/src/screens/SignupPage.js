import { StyleSheet, Text, View, Image, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { CustomButton, CustomTextInput, Loading } from "../components";
import Layout from "../components/Layout";
import apiService from "../services/api";

const SignupPage = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Validasyon
    if (!firstName.trim()) {
      Alert.alert("Hata", "Lütfen adınızı girin");
      return;
    }
    if (!lastName.trim()) {
      Alert.alert("Hata", "Lütfen soyadınızı girin");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Hata", "Lütfen e-mail adresinizi girin");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Hata", "Lütfen şifrenizi girin");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Hata", "Şifre en az 8 karakter olmalıdır");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (response.success) {
        Alert.alert(
          "Başarılı",
          "Kayıt işlemi başarıyla tamamlandı! Giriş yapabilirsiniz.",
          [
            {
              text: "Tamam",
              onPress: () => navigation.navigate("Login"),
            },
          ]
        );
      } else {
        Alert.alert("Hata", response.message || "Kayıt işlemi başarısız oldu");
      }
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert(
        "Hata",
        error.message || "Kayıt işlemi sırasında bir hata oluştu"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* SafeAreaView sadece üst kenarı koruyor, aşağıyı bozmaz */}
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.container}>
          <View style={styles.loginBox}>
            <View style={styles.title}>
              <Image
                style={styles.image}
                source={require("../../assets/images/logo.png")}
              />
              <Text style={styles.signUp}>KAYIT OL</Text>
            </View>

            <View style={styles.TextInputContainer}>
              <CustomTextInput
                title="Ad"
                isSecureText={false}
                handleonChangeText={setFirstName}
                handleValue={firstName}
                handlePlaceholder="Adınız"
              />

              <CustomTextInput
                title="Soyad"
                isSecureText={false}
                handleonChangeText={setLastName}
                handleValue={lastName}
                handlePlaceholder="Soyadınız"
              />

              <CustomTextInput
                title="E-mail"
                isSecureText={false}
                handleonChangeText={setEmail}
                handleValue={email}
                handlePlaceholder="E-mail adresiniz"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <CustomTextInput
                title="Şifre"
                isSecureText={true}
                handleonChangeText={setPassword}
                handleValue={password}
                handlePlaceholder="Şifreniz (min. 8 karakter)"
              />
            </View>

            <View style={styles.signupOptions}>
              <CustomButton
                buttonText="KAYIT OL"
                setWidth="60%"
                handleOnPress={handleRegister}
                buttonColor="#FFA040"
                pressedButtonColor="#f89028ff"
                disabled={isLoading}
              />

              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>
                  Hesabın var mı? <Text style={styles.link}>Giriş yap</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {isLoading && (
          <Loading changeIsLoading={() => setIsLoading(false)} />
        )}
      </SafeAreaView>
    </Layout>
  );
};

export default SignupPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signUp: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  TextInputContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  signupOptions: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  image: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  loginBox: {
    width: "80%",
    backgroundColor: "rgba(26, 26, 26, 0.85)",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  linkText: {
    color: "white",
    fontWeight: "500",
    marginTop: 8,
  },
  link: {
    color: "#FFA040",
    fontWeight: "bold",
  },
});
