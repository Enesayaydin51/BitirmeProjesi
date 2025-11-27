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
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Layout from "../components/Layout";

// 📌 ELİNDEKİ GIF VİDEOLAR
const LOCAL_VIDEOS = {
  "Cable Biceps Curl": require("../../assets/videos/CableBicepsCurl.gif"),
  "Cable Cross Over": require("../../assets/videos/CableCrossOver.gif"),
  "Pec Deck Fly": require("../../assets/videos/PecDeckFly.gif"),
  "Seated Dumbbell Shoulder Press": require("../../assets/videos/SeatedDumbellShoulderPress.gif"),
  "Seated Lateral Raise": require("../../assets/videos/SeatedLateralRaise.gif"),
  "Single Arm Cable Curl": require("../../assets/videos/SingleArmCableCurl.gif"),
  "Bench Press": require("../../assets/videos/BenchPress.gif"),
  "Legs Up Push Up": require("../../assets/videos/LegsUpPushUp.gif"),
};

// 📌 Günler
const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

// 📌 Egzersiz kütüphanesi (artık video yerine `gif` kullanıyoruz)
const EXERCISE_LIBRARY = {
  Göğüs: [
    { name: "Bench Press", gif: LOCAL_VIDEOS["Bench Press"], desc: "Bench Press göğüs kaslarını hedefleyen temel bir egzersizdir." },
    { name: "Incline Dumbbell Press",  gif: LOCAL_VIDEOS["Bench Press"], desc: "Üst göğüs kaslarına odaklanır." },
    { name: "Legs Up Push Up",  gif: LOCAL_VIDEOS["Legs Up Push Up"], desc: "Vücut ağırlığıyla yapılan temel göğüs hareketi." },
    { name: "Cable Cross Over",  gif: LOCAL_VIDEOS["Cable Cross Over"], desc: "Göğüs kaslarını izole eder." },
  ],
  Sırt: [
    { name: "Pull Up", video: "https://www.youtube.com/embed/eGo4IYlbE5g", desc: "Sırt genişliği için temel bir vücut ağırlığı egzersizi." },
    { name: "Barbell Row", video: "https://www.youtube.com/embed/vT2GjY_Umpw", desc: "Orta sırtı hedefler. Postür önemlidir." },
    { name: "Lat Pulldown", video: "https://www.youtube.com/embed/CAwf7n6Luuc", desc: "Sırt genişliğini artıran makine egzersizi." },
    { name: "Deadlift", video: "https://www.youtube.com/embed/op9kVnSso6Q", desc: "Bel ve sırt dahil birçok kası aktif eden temel hareket." },
  ],
  Bacak: [
    { name: "Squat", video: "https://www.youtube.com/embed/YaXPRqUwItQ", desc: "En temel bacak egzersizlerinden biridir." },
    { name: "Leg Press", video: "https://www.youtube.com/embed/sfBS6iAJCOg", desc: "Quadriceps ve kalça kaslarını hedefler." },
    { name: "Lunge", video: "https://www.youtube.com/embed/D7KaRcUTQeE", desc: "Denge ve bacak gücünü artırır." },
    { name: "Leg Curl", video: "https://www.youtube.com/embed/1Tq3QdYUuHs", desc: "Hamstring kaslarını güçlendirir." },
  ],
  Kalça: [
    { name: "Hip Thrust", video: "https://www.youtube.com/embed/LM8XHLYJoYs", desc: "Kalça kaslarını hedefleyen en etkili egzersizdir." },
    { name: "Glute Bridge", video: "https://www.youtube.com/embed/wPM8icPu6H8", desc: "Vücut ağırlığıyla yapılan temel kalça egzersizi." },
    { name: "Kickback", video: "https://www.youtube.com/embed/Cn4n4EY5qEA", desc: "Kalçayı izole eden hareket." },
  ],
  Deltoidler: [
    { name: "Overhead Press", video: "https://www.youtube.com/embed/F3QY5vMz_6I", desc: "Omuzların ön ve orta başını geliştirir." },
    { name: "Lateral Raise", video: "https://www.youtube.com/embed/3VcKaXpzqRo", desc: "Omuz genişliğini artırır." },
    { name: "Front Raise", video: "https://www.youtube.com/embed/X3Y1pdzarat", desc: "Ön omuz kaslarını çalıştırır." },
    { name: "Arnold Press", video: "https://www.youtube.com/embed/6Z15_WdXmVw", desc: "Omuzlara farklı açı kazandırır." },
  ],
  Biceps: [
    { name: "Bicep Curl", video: "https://www.youtube.com/embed/ykJmrZ5v0Oo", desc: "Biceps kaslarını geliştirir." },
    { name: "Hammer Curl", video: "https://www.youtube.com/embed/zC3nLlEvin4", desc: "Önkol ve brachialis kaslarını aktif eder." },
    { name: "Cable Curl", video: "https://www.youtube.com/embed/sAq_ocpRh_I", desc: "Tansiyon altında sürekli kas çalışması sağlar." },
  ],
  Triceps: [
    { name: "Triceps Pushdown", video: "https://www.youtube.com/embed/2-LAMcpzODU", desc: "Triceps izole egzersizidir." },
    { name: "Skull Crusher", video: "https://www.youtube.com/embed/d_KZxkY_0cM", desc: "Uzun triceps başını çalıştırır." },
    { name: "Dips", video: "https://www.youtube.com/embed/2z8JmcrW-As", desc: "Triceps ve göğüsü aktif eder." },
  ],
};

// 📌 Resim eşlemeleri (Senin eski kodunda nasılsa aynen duruyor)
const IMAGE_MAP = {
  Göğüs: require("../../assets/images/exercisesicons/chest.jpg"),
  Sırt: require("../../assets/images/exercisesicons/back.jpg"),
  Bacak: require("../../assets/images/exercisesicons/leg.jpg"),
  Kalça: require("../../assets/images/exercisesicons/glutes.jpg"),
  Deltoidler: require("../../assets/images/exercisesicons/omuz.jpg"),
  Biceps: require("../../assets/images/exercisesicons/biceps.jpg"),
  Triceps: require("../../assets/images/exercisesicons/triceps.jpg"),
};

const ExercisesPage = () => {
  const [tab, setTab] = useState("map");
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [program, setProgram] = useState({});
  const [selectedDay, setSelectedDay] = useState("Pazartesi");
  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState("");

  // 📌 Video Modal kontrolü
  const [videoModal, setVideoModal] = useState(false);
  const [selectedExerciseData, setSelectedExerciseData] = useState(null);

  useEffect(() => { loadProgram(); }, []);

  const loadProgram = async () => {
    const saved = await AsyncStorage.getItem("trainingProgram");
    if (saved) setProgram(JSON.parse(saved));
  };

  const saveProgram = async (updated) => {
    await AsyncStorage.setItem("trainingProgram", JSON.stringify(updated));
    setProgram(updated);
  };

  const addExercise = () => {
    if (!name.trim() || !sets || !reps) return Alert.alert("Uyarı", "Tüm alanları doldur!");
    const newEx = { name, sets, reps, rpe };
    saveProgram({ ...program, [selectedDay]: [...(program[selectedDay] || []), newEx] });
    setName(""); setSets(""); setReps(""); setRpe("");
  };

  const addFromLibrary = (exercise) => {
    const newEx = { name: exercise.name, sets: 3, reps: 10, rpe: 7 };
    saveProgram({ ...program, [selectedDay]: [...(program[selectedDay] || []), newEx] });
    Alert.alert("Eklendi", `${exercise.name} ${selectedDay} gününe eklendi`);
  };

  const deleteExercise = (i) => {
    const updatedDay = [...program[selectedDay]];
    updatedDay.splice(i, 1);
    saveProgram({ ...program, [selectedDay]: updatedDay });
  };

  return (
    <Layout>
      <SafeAreaView style={styles.safeContainer}>

        {/* TABLAR */}
        <View style={styles.tabContainer}>
          <Pressable style={[styles.tabButton, tab === "map" && styles.activeTab]} onPress={() => { setTab("map"); setSelectedMuscle(null); }}>
            <Text style={styles.tabText}>Kaslar</Text>
          </Pressable>
          <Pressable style={[styles.tabButton, tab === "program" && styles.activeTab]} onPress={() => setTab("program")}>
            <Text style={styles.tabText}>Program</Text>
          </Pressable>
        </View>

        {/* 📍 KAS KARTLARI */}
        {tab === "map" && !selectedMuscle && (
          <ScrollView style={{ width: "100%" }}>
            {Object.keys(IMAGE_MAP).map((muscle, i) => (
              <Pressable key={i} style={styles.fullCard} onPress={() => setSelectedMuscle(muscle)}>
                <Image source={IMAGE_MAP[muscle]} style={styles.cardImage} />
                <Text style={styles.cardText}>{muscle}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* 📍 EGZERSİZ DETAY */}
        {selectedMuscle && (
          <View style={styles.muscleDetail}>
            <Text style={styles.header}>{selectedMuscle} Egzersizleri</Text>
            <ScrollView style={{ width: "95%" }}>
              {(EXERCISE_LIBRARY[selectedMuscle] || []).map((ex, i) => (
                <View key={i} style={styles.exerciseCard}>
                  <Text style={styles.exerciseName}>{ex.name}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Pressable style={styles.videoButton} onPress={() => { setSelectedExerciseData(ex); setVideoModal(true); }}>
                      <Text style={{ color: "white" }}>Video 🎥</Text>
                    </Pressable>
                    <Pressable style={styles.addButton} onPress={() => addFromLibrary(ex)}>
                      <Text style={{ color: "black" }}>Ekle</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>

            <Pressable style={styles.backButton} onPress={() => setSelectedMuscle(null)}>
              <Text style={styles.backText}>← Geri</Text>
            </Pressable>
          </View>
        )}

        {/* 🎬 VİDEO MODAL */}
        <Modal visible={videoModal} animationType="slide" transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{selectedExerciseData?.name}</Text>
              <View style={styles.videoContainer}>
                <Image source={selectedExerciseData?.gif} style={{ width: "100%", height: 200, resizeMode: "contain" }} />
              </View>
              <Text style={styles.description}>{selectedExerciseData?.desc}</Text>

              <Pressable style={styles.addButtonFull} onPress={() => { addFromLibrary(selectedExerciseData); setVideoModal(false); }}>
                <Text style={{ color: "black" }}>Programa Ekle</Text>
              </Pressable>

              <Pressable style={styles.closeButton} onPress={() => setVideoModal(false)}>
                <Text style={{ color: "white" }}>Kapat</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* 📌 PROGRAM SEKMESİ → HİÇ DOKUNMADIM */}
        {tab === "program" && (
          <ScrollView style={{ width: "95%" }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {DAYS.map((day) => (
                <Pressable key={day} onPress={() => setSelectedDay(day)} style={[styles.dayButton, selectedDay === day && styles.activeDayButton]}>
                  <Text style={[styles.dayText, selectedDay === day && styles.activeDayText]}>{day}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Yeni Egzersiz Ekle</Text>
            <TextInput placeholder="Hareket Adı" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Set" value={sets} onChangeText={setSets} style={styles.input} keyboardType="numeric" />
            <TextInput placeholder="Tekrar" value={reps} onChangeText={setReps} style={styles.input} keyboardType="numeric" />
            <TextInput placeholder="RPE" value={rpe} onChangeText={setRpe} style={styles.input} keyboardType="numeric" />
            <Pressable style={styles.addButtonFull} onPress={addExercise}>
              <Text style={{ color: "black" }}>EKLE</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>{selectedDay} Programı</Text>
            {(program[selectedDay] || []).map((ex, i) => (
              <View key={i} style={styles.customCard}>
                <TextInput style={styles.editInput} value={ex.name} />
                <TextInput style={styles.editInput} value={String(ex.sets)} />
                <TextInput style={styles.editInput} value={String(ex.reps)} />
                <Pressable style={styles.deleteButton} onPress={() => deleteExercise(i)}>
                  <Text style={styles.deleteText}>Sil</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </Layout>
  );
};

export default ExercisesPage;

// 📌 STYLES – Aynen senin kodun
const styles = StyleSheet.create({
  safeContainer: { flex: 1, width: "100%", paddingTop: 10 },
  tabContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
  tabButton: { padding: 10, backgroundColor: "#222", marginHorizontal: 5, borderRadius: 10 },
  activeTab: { backgroundColor: "#D6B982" },
  tabText: { color: "white", fontWeight: "bold" },

  fullCard: {
    width: "100%",
    height: 110,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  cardImage: { width: 85, height: 85, borderRadius: 12, marginRight: 15 },
  cardText: { fontSize: 22, fontWeight: "600", color: "#D6B982" },

  muscleDetail: { flex: 1, alignItems: "center", width: "100%", paddingTop: 20 },
  header: { fontSize: 22, fontWeight: "700", color: "#D6B982", marginBottom: 10 },

  exerciseCard: {
    backgroundColor: "#1c1c1c",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  exerciseName: { color: "white", fontSize: 16 },
  videoButton: { backgroundColor: "#555", padding: 6, borderRadius: 10, marginRight: 6 },
  addButton: { backgroundColor: "#D6B982", padding: 6, borderRadius: 10 },

  backButton: { marginTop: 15, backgroundColor: "#333", padding: 10, borderRadius: 10 },
  backText: { color: "white", fontWeight: "bold" },

  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", alignItems: "center", justifyContent: "center" },
  modalCard: { width: "90%", backgroundColor: "#1c1c1c", padding: 20, borderRadius: 16, maxHeight: "90%" },
  modalTitle: { fontSize: 20, color: "#D6B982", fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  videoContainer: { height: 200, width: "100%", borderRadius: 10, overflow: "hidden", marginBottom: 15 },
  description: { color: "#aaa", marginBottom: 15 },
  addButtonFull: { backgroundColor: "#D6B982", padding: 12, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  closeButton: { backgroundColor: "#444", padding: 10, borderRadius: 10, alignItems: "center" },

  // Program kısmı → SENİN KODUN AYNEN
  dayButton: { backgroundColor: "#333", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 15, marginHorizontal: 5 },
  activeDayButton: { backgroundColor: "#D6B982" },
  dayText: { color: "#fff" },
  activeDayText: { color: "#000", fontWeight: "bold" },
  sectionTitle: { color: "#D6B982", fontWeight: "bold", fontSize: 18, marginVertical: 10, textAlign: "center" },
  input: { backgroundColor: "#222", color: "#fff", borderRadius: 8, padding: 8, marginVertical: 5 },
  customCard: { flexDirection: "row", backgroundColor: "#1c1c1c", borderRadius: 8, padding: 6, marginVertical: 5 },
  editInput: { backgroundColor: "#333", color: "white", borderRadius: 6 , padding: 6, marginHorizontal: 4, flex: 1 },
  deleteButton: { backgroundColor: "#ff4040", borderRadius: 8, padding: 6 },
  deleteText: { color: "#fff", fontWeight: "bold" },
});
