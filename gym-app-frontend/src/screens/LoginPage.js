import {
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
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
  setLogin,
} from "../redux/userSlice";
import Layout from "../components/Layout";

const LoginPage = ({ navigation }) => {
  const { email, password, isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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
              handleValue={email}
              handlePlaceholder="E-mail adresinizi girin"
            />

            <CustomTextInput
              title="Şifre"
              isSecureText={true}
              handleonChangeText={(text) => dispatch(setPassword(text))}
              handleValue={password}
              handlePlaceholder="Şifrenizi girin"
            />

            <View style={styles.buttonContainer}>
              <CustomButton
                buttonText="GİRİŞ YAP"
                setWidth="100%"
                handleOnPress={() => dispatch(setLogin())}
                buttonColor="#FFA040"
                pressedButtonColor="#f89028ff"
              />

              <CustomButton
                buttonText="KAYIT OL"
                setWidth="100%"
                handleOnPress={() => navigation.navigate("Signup")}
                buttonColor="#FFA040"
                pressedButtonColor="#f89028ff"
              />
            </View>
          </View>

          {isLoading ? (
            <Loading changeIsLoading={() => dispatch(setIsLoading(false))} />
          ) : null}
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
