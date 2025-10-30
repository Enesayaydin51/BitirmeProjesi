import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import Layout from "../components/Layout";

const foodDatabase = [
  { name: "Tavuk Göğsü (100g)", calories: 165, protein: 31, carb: 0, fat: 3.6 },
  { name: "Yulaf (100g)", calories: 389, protein: 17, carb: 66, fat: 7 },
  { name: "Muz (1 adet)", calories: 89, protein: 1.1, carb: 23, fat: 0.3 },
  { name: "Yumurta (1 adet)", calories: 78, protein: 6, carb: 0.6, fat: 5.3 },
  { name: "Pirinç (100g)", calories: 360, protein: 7, carb: 80, fat: 0.5 },
  { name: "Kırmızı Et (100g)", calories: 250, protein: 26, carb: 0, fat: 15 },
  { name: "Badem (30g)", calories: 180, protein: 6, carb: 6, fat: 15 },
  { name: "Yoğurt (200g)", calories: 120, protein: 8, carb: 10, fat: 4 },
  { name: "Somon (100g)", calories: 208, protein: 20, carb: 0, fat: 13 },
  { name: "Elma (1 adet)", calories: 52, protein: 0.3, carb: 14, fat: 0.2 },
];

const DietPage = () => {
  const [activeTab, setActiveTab] = useState("Önerilen");
  const [goal, setGoal] = useState("Kilo Verme");

  const [customFoods, setCustomFoods] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carb, setCarb] = useState("");
  const [fat, setFat] = useState("");
  const [foodModalVisible, setFoodModalVisible] = useState(false);

  const dietPlans = {
    "Kilo Verme": {
      calories: 1800,
      protein: "150g",
      carb: "150g",
      fat: "50g",
      meals: [
        { title: "Kahvaltı", items: ["2 yumurta", "1 dilim tam buğday ekmeği"] },
        { title: "Öğle", items: ["150g tavuk göğsü", "Bol salata"] },
        { title: "Akşam", items: ["200g balık", "Sebze çorbası"] },
      ],
    },
    "Kilo Alma": {
      calories: 2800,
      protein: "160g",
      carb: "350g",
      fat: "90g",
      meals: [
        { title: "Kahvaltı", items: ["3 yumurta", "100g yulaf", "1 muz"] },
        { title: "Öğle", items: ["200g kırmızı et", "1 tabak pilav"] },
        { title: "Akşam", items: ["200g tavuk", "1 porsiyon makarna"] },
      ],
    },
    "Kilo Koruma": {
      calories: 2200,
      protein: "140g",
      carb: "200g",
      fat: "70g",
      meals: [
        { title: "Kahvaltı", items: ["2 yumurta", "1 bardak süt"] },
        { title: "Öğle", items: ["150g tavuk", "1 tabak bulgur"] },
        { title: "Akşam", items: ["150g balık", "Sebze çorbası"] },
      ],
    },
  };

  const plan = dietPlans[goal];

  const addFood = () => {
    if (!foodName || !calories) return;
    const newFood = {
      name: foodName,
      calories: parseFloat(calories),
      protein: parseFloat(protein) || 0,
      carb: parseFloat(carb) || 0,
      fat: parseFloat(fat) || 0,
    };
    setCustomFoods([...customFoods, newFood]);
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarb("");
    setFat("");
  };

  const total = customFoods.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carb: acc.carb + f.carb,
      fat: acc.fat + f.fat,
    }),
    { calories: 0, protein: 0, carb: 0, fat: 0 }
  );

  const selectFood = (item) => {
    setFoodName(item.name);
    setCalories(item.calories.toString());
    setProtein(item.protein.toString());
    setCarb(item.carb.toString());
    setFat(item.fat.toString());
    setFoodModalVisible(false);
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerSpace} />

        <Text style={styles.mainTitle}>Beslenme Planı</Text>

        {/* Sekmeler */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === "Önerilen" && styles.activeTab]}
            onPress={() => setActiveTab("Önerilen")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Önerilen" && styles.activeTabText,
              ]}
            >
              Önerilen Programlar
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === "Kendi" && styles.activeTab]}
            onPress={() => setActiveTab("Kendi")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Kendi" && styles.activeTabText,
              ]}
            >
              Kendi Programım
            </Text>
          </Pressable>
        </View>

        {/* Önerilen Planlar */}
        {activeTab === "Önerilen" && (
          <>
            <Text style={styles.sectionTitle}>{goal} Planı</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.cardTitle}>Günlük Makrolar</Text>
              <Text style={styles.macroText}>Kalori: {plan.calories} kcal</Text>
              <Text style={styles.macroText}>Protein: {plan.protein}</Text>
              <Text style={styles.macroText}>Karb: {plan.carb}</Text>
              <Text style={styles.macroText}>Yağ: {plan.fat}</Text>
            </View>

            {plan.meals.map((m, i) => (
              <View key={i} style={styles.mealCard}>
                <Text style={styles.mealTitle}>{m.title}</Text>
                {m.items.map((it, idx) => (
                  <Text key={idx} style={styles.mealItem}>
                    • {it}
                  </Text>
                ))}
              </View>
            ))}
          </>
        )}

        {/* Kendi Programım */}
        {activeTab === "Kendi" && (
          <>
            <Text style={styles.sectionTitle}>Kendi Beslenme Programım</Text>

            <View style={styles.inputContainer}>
              <Pressable
                style={styles.selectButton}
                onPress={() => setFoodModalVisible(true)}
              >
                <Text style={styles.selectButtonText}>Besin Seç</Text>
              </Pressable>

              <TextInput
                placeholder="Besin adı"
                placeholderTextColor="#aaa"
                value={foodName}
                onChangeText={setFoodName}
                style={styles.input}
              />
              <TextInput
                placeholder="Kalori (kcal)"
                placeholderTextColor="#aaa"
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
                style={styles.input}
              />
              <View style={styles.macroInputs}>
                <TextInput
                  placeholder="Protein (g)"
                  placeholderTextColor="#aaa"
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                  style={[styles.input, { flex: 1, marginRight: 5 }]}
                />
                <TextInput
                  placeholder="Karb (g)"
                  placeholderTextColor="#aaa"
                  value={carb}
                  onChangeText={setCarb}
                  keyboardType="numeric"
                  style={[styles.input, { flex: 1, marginRight: 5 }]}
                />
                <TextInput
                  placeholder="Yağ (g)"
                  placeholderTextColor="#aaa"
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="numeric"
                  style={[styles.input, { flex: 1 }]}
                />
              </View>

              <Pressable style={styles.addButton} onPress={addFood}>
                <Text style={styles.addButtonText}>Besin Ekle</Text>
              </Pressable>
            </View>

            {customFoods.map((f, i) => (
              <View key={i} style={styles.foodCard}>
                <Text style={styles.foodName}>{f.name}</Text>
                <Text style={styles.foodDetail}>
                  {f.calories} kcal | P:{f.protein}g C:{f.carb}g Y:{f.fat}g
                </Text>
              </View>
            ))}

            {customFoods.length > 0 && (
              <View style={styles.totalCard}>
                <Text style={styles.totalTitle}>Toplam Günlük</Text>
                <Text style={styles.totalText}>
                  {total.calories.toFixed(0)} kcal
                </Text>
                <Text style={styles.totalText}>
                  Protein: {total.protein.toFixed(1)}g | Karb:{" "}
                  {total.carb.toFixed(1)}g | Yağ: {total.fat.toFixed(1)}g
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Besin Seç Modal */}
      <Modal visible={foodModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Besin Seç</Text>
            <FlatList
              data={foodDatabase}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.foodOption}
                  onPress={() => selectFood(item)}
                >
                  <Text style={styles.foodOptionText}>{item.name}</Text>
                  <Text style={styles.foodOptionSub}>
                    {item.calories} kcal | P:{item.protein} C:{item.carb} Y:
                    {item.fat}
                  </Text>
                </Pressable>
              )}
            />
            <Pressable
              onPress={() => setFoodModalVisible(false)}
              style={styles.closeModalBtn}
            >
              <Text style={styles.closeText}>Kapat</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

export default DietPage;

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 120,
  },
  headerSpace: { height: 60 },
  mainTitle: {
    color: "#FFA040",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    marginBottom: 15,
  },
  tab: { flex: 1, paddingVertical: 10 },
  tabText: { color: "#ccc", fontSize: 16, textAlign: "center" },
  activeTab: { backgroundColor: "#FFA040", borderRadius: 10 },
  activeTabText: { color: "#000", fontWeight: "bold" },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  summaryCard: {
    width: "90%",
    backgroundColor: "rgba(26,26,26,0.85)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FFA040",
  },
  cardTitle: {
    color: "#FFA040",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  macroText: { color: "#fff", marginBottom: 3 },
  mealCard: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  mealTitle: { color: "#FFA040", fontSize: 18, fontWeight: "bold" },
  mealItem: { color: "#fff", fontSize: 15 },
  inputContainer: { width: "90%", marginBottom: 15 },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  macroInputs: { flexDirection: "row", justifyContent: "space-between" },
  addButton: {
    backgroundColor: "#FFA040",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  selectButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "#FFA040",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectButtonText: {
    color: "#FFA040",
    textAlign: "center",
    fontWeight: "bold",
  },
  foodCard: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  foodName: { color: "#FFA040", fontWeight: "bold", fontSize: 16 },
  foodDetail: { color: "#fff", fontSize: 14 },
  totalCard: {
    width: "90%",
    backgroundColor: "rgba(26,26,26,0.85)",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    borderColor: "#FFA040",
    borderWidth: 1,
    alignItems: "center",
  },
  totalTitle: { color: "#FFA040", fontSize: 18, fontWeight: "bold" },
  totalText: { color: "white", fontSize: 15 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  modalContent: {
    width: "95%",
    maxHeight: "80%",
    backgroundColor: "rgba(26,26,26,0.95)",
    borderRadius: 12,
    padding: 15,
  },
  modalTitle: {
    color: "#FFA040",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  foodOption: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  foodOptionText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  foodOptionSub: { color: "#aaa", fontSize: 13 },
  closeModalBtn: {
    marginTop: 10,
    backgroundColor: "#FFA040",
    borderRadius: 8,
    paddingVertical: 8,
  },
  closeText: { color: "#000", textAlign: "center", fontWeight: "bold" },
});
