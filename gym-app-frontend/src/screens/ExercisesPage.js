import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Layout from "../components/Layout";

const DAYS = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

const EXERCISE_LIBRARY = {
  Göğüs: ["Bench Press", "Incline Dumbbell Press", "Push Up", "Cable Fly"],
  Sırt: ["Pull Up", "Barbell Row", "Lat Pulldown", "Seated Row", "Deadlift"],
  Bacak: ["Squat", "Leg Press", "Lunge", "Leg Curl", "Calf Raise"],
  Omuz: ["Overhead Press", "Lateral Raise", "Front Raise", "Arnold Press"],
  Kol: ["Bicep Curl", "Triceps Pushdown", "Hammer Curl", "Skull Crusher"],
  Karın: ["Crunch", "Leg Raise", "Plank", "Cable Crunch"],
  Kardiyo: ["Koşu Bandı", "Bisiklet", "Jump Rope", "Rowing Machine"],
};

const ExercisesPage = () => {
  const [tab, setTab] = useState("map");
  const [view, setView] = useState("front");
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [program, setProgram] = useState({});
  const [selectedDay, setSelectedDay] = useState("Pazartesi");
  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState("");

  useEffect(() => {
    loadProgram();
  }, []);

  const loadProgram = async () => {
    try {
      const saved = await AsyncStorage.getItem("trainingProgram");
      if (saved) setProgram(JSON.parse(saved));
    } catch (e) {
      console.log("Program yüklenemedi:", e);
    }
  };

  const saveProgram = async (updated) => {
    try {
      await AsyncStorage.setItem("trainingProgram", JSON.stringify(updated));
      setProgram(updated);
    } catch (e) {
      console.log("Program kaydedilemedi:", e);
    }
  };

  const handleSaveManual = () => {
    Alert.alert("✅ Kaydedildi", "Antrenman programı başarıyla kaydedildi!");
    saveProgram(program);
  };

  const addExercise = () => {
    if (!name.trim() || !sets || !reps) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurun!");
      return;
    }
    const newEx = { name, sets, reps, rpe };
    const updatedDay = program[selectedDay]
      ? [...program[selectedDay], newEx]
      : [newEx];
    const updated = { ...program, [selectedDay]: updatedDay };
    saveProgram(updated);
    setName("");
    setSets("");
    setReps("");
    setRpe("");
  };

  const addFromLibrary = (exercise) => {
    const newEx = { name: exercise, sets: 3, reps: 10, rpe: 7 };
    const updatedDay = program[selectedDay]
      ? [...program[selectedDay], newEx]
      : [newEx];
    const updated = { ...program, [selectedDay]: updatedDay };
    saveProgram(updated);
    Alert.alert("Eklendi ✅", `${exercise} ${selectedDay} gününe eklendi`);
  };

  const deleteExercise = (index) => {
    const updatedDay = [...program[selectedDay]];
    updatedDay.splice(index, 1);
    const updated = { ...program, [selectedDay]: updatedDay };
    saveProgram(updated);
  };

  const editExercise = (index, field, value) => {
    const updatedDay = [...program[selectedDay]];
    updatedDay[index][field] = value;
    const updated = { ...program, [selectedDay]: updatedDay };
    saveProgram(updated);
  };

  return (
    <Layout>
      <View style={styles.container}>
        {/* Sekmeler */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tabButton, tab === "map" && styles.activeTab]}
            onPress={() => setTab("map")}
          >
            <Text style={styles.tabText}>Kas Haritası</Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, tab === "program" && styles.activeTab]}
            onPress={() => setTab("program")}
          >
            <Text style={styles.tabText}>Program Oluştur</Text>
          </Pressable>
        </View>

        {/* KAS HARİTASI */}
        {tab === "map" && !selectedMuscle && (
          <>
            <Pressable
              style={styles.switchButton}
              onPress={() => setView(view === "front" ? "back" : "front")}
            >
              <Text style={styles.switchText}>
                {view === "front" ? "Arka Görünüm" : "Ön Görünüm"}
              </Text>
            </Pressable>

            <View style={styles.mapContainer}>
              <Image
                source={
                  view === "front"
                    ? require("../../assets/images/body_front.png")
                    : require("../../assets/images/body_back.png")
                }
                style={styles.bodyImage}
                resizeMode="contain"
              />

              {/* Görünmez Tıklama Alanları */}
              {view === "front" ? (
                <>
                  <Pressable
                    style={[styles.zone, { top: "38%", left: "40%", width: "20%", height: "12%" }]}
                    onPress={() => setSelectedMuscle("Göğüs")}
                  />
                  <Pressable
                    style={[styles.zone, { top: "50%", left: "43%", width: "14%", height: "18%" }]}
                    onPress={() => setSelectedMuscle("Karın")}
                  />
                  <Pressable
                    style={[styles.zone, { top: "67%", left: "43%", width: "14%", height: "25%" }]}
                    onPress={() => setSelectedMuscle("Bacak")}
                  />
                </>
              ) : (
                <>
                  <Pressable
                    style={[styles.zone, { top: "35%", left: "40%", width: "20%", height: "18%" }]}
                    onPress={() => setSelectedMuscle("Sırt")}
                  />
                  <Pressable
                    style={[styles.zone, { top: "68%", left: "43%", width: "14%", height: "25%" }]}
                    onPress={() => setSelectedMuscle("Bacak")}
                  />
                </>
              )}
            </View>
          </>
        )}

        {/* SEÇİLEN KAS DETAY SAYFASI */}
        {selectedMuscle && (
          <View style={styles.muscleDetail}>
            <Text style={styles.header}>{selectedMuscle} Egzersizleri</Text>
            <ScrollView style={{ width: "95%" }}>
              {EXERCISE_LIBRARY[selectedMuscle].map((exercise, i) => (
                <View key={i} style={styles.card}>
                  <View>
                    <Text style={styles.exerciseName}>{exercise}</Text>
                    <Text style={styles.muscleGroup}>{selectedMuscle}</Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <Pressable
                      style={styles.addButtonSmall}
                      onPress={() => addFromLibrary(exercise)}
                    >
                      <Text style={styles.videoText}>Ekle</Text>
                    </Pressable>
                    <Pressable
                      style={styles.videoButton}
                      onPress={() =>
                        Alert.alert("Bilgi", `"${exercise}" videosu yakında eklenecek 🎥`)
                      }
                    >
                      <Text style={styles.videoText}>Video</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>

            <Pressable style={styles.backButton} onPress={() => setSelectedMuscle(null)}>
              <Text style={styles.backText}>← Haritaya Dön</Text>
            </Pressable>
          </View>
        )}

        {/* PROGRAM OLUŞTUR */}
        {tab === "program" && (
          <ScrollView style={{ width: "95%" }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {DAYS.map((day) => (
                <Pressable
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  style={[styles.dayButton, selectedDay === day && styles.activeDayButton]}
                >
                  <Text style={[styles.dayText, selectedDay === day && styles.activeDayText]}>
                    {day}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Yeni Egzersiz Ekle</Text>
            <TextInput placeholder="Hareket Adı" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Set" value={sets} onChangeText={setSets} style={styles.input} keyboardType="numeric" />
            <TextInput placeholder="Tekrar" value={reps} onChangeText={setReps} style={styles.input} keyboardType="numeric" />
            <TextInput placeholder="RPE" value={rpe} onChangeText={setRpe} style={styles.input} keyboardType="numeric" />
            <Pressable style={styles.addButton} onPress={addExercise}>
              <Text style={styles.addText}>Ekle</Text>
            </Pressable>

            <Pressable style={styles.saveButton} onPress={handleSaveManual}>
              <Text style={styles.saveText}>Programı Kaydet</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>{selectedDay} Programı</Text>
            {(program[selectedDay] || []).map((ex, i) => (
              <View key={i} style={styles.customCard}>
                <TextInput style={styles.editInput} value={ex.name} onChangeText={(t) => editExercise(i, "name", t)} />
                <TextInput style={styles.editInput} value={String(ex.sets)} onChangeText={(t) => editExercise(i, "sets", t)} keyboardType="numeric" />
                <TextInput style={styles.editInput} value={String(ex.reps)} onChangeText={(t) => editExercise(i, "reps", t)} keyboardType="numeric" />
                <TextInput style={styles.editInput} value={String(ex.rpe)} onChangeText={(t) => editExercise(i, "rpe", t)} keyboardType="numeric" />
                <Pressable style={styles.deleteButton} onPress={() => deleteExercise(i)}>
                  <Text style={styles.deleteText}>Sil</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </Layout>
  );
};

export default ExercisesPage;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 30 },
  tabContainer: { flexDirection: "row", marginBottom: 10 },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#333",
    borderRadius: 10,
    marginHorizontal: 5,
  },
  activeTab: { backgroundColor: "#FFA040" },
  tabText: { color: "white", fontWeight: "bold" },
  switchButton: {
    backgroundColor: "#FFA040",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  switchText: { color: "white", fontWeight: "bold" },
  mapContainer: { width: "90%", alignItems: "center", position: "relative" },
  bodyImage: { width: "100%", height: 550 },
  zone: { position: "absolute", backgroundColor: "transparent" },
  muscleDetail: { flex: 1, alignItems: "center", width: "100%", paddingTop: 20 },
  header: { color: "#FFA040", fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.07)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  exerciseName: { color: "white", fontSize: 16, fontWeight: "bold" },
  muscleGroup: { color: "gray", fontSize: 13 },
  videoButton: { backgroundColor: "#FFA040", padding: 6, borderRadius: 8 },
  addButtonSmall: { backgroundColor: "#00b300", padding: 6, borderRadius: 8 },
  videoText: { color: "white", fontWeight: "bold" },
  backButton: { marginTop: 15, backgroundColor: "#444", padding: 10, borderRadius: 10 },
  backText: { color: "white", fontWeight: "bold" },
  dayButton: { backgroundColor: "#333", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 15, marginHorizontal: 5 },
  activeDayButton: { backgroundColor: "#FFA040" },
  dayText: { color: "white" },
  activeDayText: { color: "#000", fontWeight: "bold" },
  sectionTitle: { color: "#FFA040", fontWeight: "bold", fontSize: 18, marginVertical: 10, textAlign: "center" },
  input: { backgroundColor: "#222", color: "white", borderRadius: 8, padding: 8, marginVertical: 5 },
  addButton: { backgroundColor: "#FFA040", padding: 10, borderRadius: 10, alignItems: "center", marginVertical: 10 },
  addText: { color: "white", fontWeight: "bold" },
  saveButton: { backgroundColor: "#00b300", padding: 10, borderRadius: 10, alignItems: "center", marginVertical: 10 },
  saveText: { color: "white", fontWeight: "bold" },
  customCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#1c1c1c", borderRadius: 8, padding: 6, marginVertical: 5 },
  editInput: { backgroundColor: "#333", color: "white", borderRadius: 6, padding: 6, width: 60, marginHorizontal: 3, textAlign: "center" },
  deleteButton: { backgroundColor: "#ff4040", borderRadius: 8, padding: 6, marginLeft: 6 },
  deleteText: { color: "white", fontWeight: "bold" },
});
