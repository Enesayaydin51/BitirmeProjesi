import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { CustomButton, CustomTextInput } from "../components";
import Layout from "../components/Layout";

const SignupPage = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
                title="Name"
                isSecureText={false}
                handleonChangeText={setName}
                handleValue={name}
                handlePlaceholder="İsminiz"
              />

              <CustomTextInput
                title="E-mail"
                isSecureText={false}
                handleonChangeText={setEmail}
                handleValue={email}
                handlePlaceholder="E-mail adresiniz"
              />

              <CustomTextInput
                title="Password"
                isSecureText={true}
                handleonChangeText={setPassword}
                handleValue={password}
                handlePlaceholder="Şifreniz"
              />
            </View>

            <View style={styles.signupOptions}>
              <CustomButton
                buttonText="KAYIT OL"
                setWidth="60%"
                handleOnPress={() =>
                  console.log(name, "", email, "", password)
                }
                buttonColor="#FFA040"
                pressedButtonColor="#f89028ff"
              />

              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>
                  Hesabın var mı? <Text style={styles.link}>Giriş yap</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
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
