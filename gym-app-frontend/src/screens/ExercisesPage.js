import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import TrainingProgramService from "../services/trainingProgramService";

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
const DAYS = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

// 📌 Egzersiz kütüphanesi (map sekmesi için)
const EXERCISE_LIBRARY = {
  Göğüs: [
    {
      name: "Bench Press",
      gif: LOCAL_VIDEOS["Bench Press"],
      desc: "Bench Press göğüs kaslarını hedefleyen temel bir egzersizdir.",
    },
    {
      name: "Incline Dumbbell Press",
      gif: LOCAL_VIDEOS["Bench Press"],
      desc: "Üst göğüs kaslarına odaklanır.",
    },
    {
      name: "Legs Up Push Up",
      gif: LOCAL_VIDEOS["Legs Up Push Up"],
      desc: "Vücut ağırlığıyla yapılan temel göğüs hareketi.",
    },
    {
      name: "Cable Cross Over",
      gif: LOCAL_VIDEOS["Cable Cross Over"],
      desc: "Göğüs kaslarını izole eder.",
    },
  ],
  Sırt: [
    {
      name: "Pull Up",
      desc: "Sırt genişliği için temel bir vücut ağırlığı egzersizi.",
    },
    {
      name: "Barbell Row",
      desc: "Orta sırtı hedefler. Postür önemlidir.",
    },
    {
      name: "Lat Pulldown",
      desc: "Sırt genişliğini artıran makine egzersizi.",
    },
    {
      name: "Deadlift",
      desc: "Bel ve sırt dahil birçok kası aktif eden temel hareket.",
    },
  ],
  Bacak: [
    {
      name: "Squat",
      desc: "En temel bacak egzersizlerinden biridir.",
    },
    {
      name: "Leg Press",
      desc: "Quadriceps ve kalça kaslarını hedefler.",
    },
    {
      name: "Lunge",
      desc: "Denge ve bacak gücünü artırır.",
    },
    {
      name: "Leg Curl",
      desc: "Hamstring kaslarını güçlendirir.",
    },
  ],
  Kalça: [
    {
      name: "Hip Thrust",
      desc: "Kalça kaslarını hedefleyen en etkili egzersizdir.",
    },
    {
      name: "Glute Bridge",
      desc: "Vücut ağırlığıyla yapılan temel kalça egzersizi.",
    },
    {
      name: "Kickback",
      desc: "Kalçayı izole eden hareket.",
    },
  ],
  Deltoidler: [
    {
      name: "Overhead Press",
      desc: "Omuzların ön ve orta başını geliştirir.",
    },
    {
      name: "Lateral Raise",
      desc: "Omuz genişliğini artırır.",
    },
    {
      name: "Front Raise",
      desc: "Ön omuz kaslarını çalıştırır.",
    },
    {
      name: "Arnold Press",
      desc: "Omuzlara farklı açı kazandırır.",
    },
  ],
  Biceps: [
    {
      name: "Bicep Curl",
      desc: "Biceps kaslarını geliştirir.",
    },
    {
      name: "Hammer Curl",
      desc: "Önkol ve brachialis kaslarını aktif eder.",
    },
    {
      name: "Cable Curl",
      desc: "Tansiyon altında sürekli kas çalışması sağlar.",
    },
  ],
  Triceps: [
    {
      name: "Triceps Pushdown",
      desc: "Triceps izole egzersizidir.",
    },
    {
      name: "Skull Crusher",
      desc: "Uzun triceps başını çalıştırır.",
    },
    {
      name: "Dips",
      desc: "Triceps ve göğüsü aktif eder.",
    },
  ],
};

// 📌 Kas resimleri
const IMAGE_MAP = {
  Göğüs: require("../../assets/images/exercisesicons/chest.jpg"),
  Sırt: require("../../assets/images/exercisesicons/back.jpg"),
  Bacak: require("../../assets/images/exercisesicons/leg.jpg"),
  Kalça: require("../../assets/images/exercisesicons/glutes.jpg"),
  Deltoidler: require("../../assets/images/exercisesicons/omuz.jpg"),
  Biceps: require("../../assets/images/exercisesicons/biceps.jpg"),
  Triceps: require("../../assets/images/exercisesicons/triceps.jpg"),
};

const LEVEL_OPTIONS = [
  {
    key: "beginner",
    label: "Başlangıç",
    desc: "Haftada 2 kez kas grubu, daha temel yoğunluk.",
  },
  {
    key: "intermediate",
    label: "Orta Seviye",
    desc: "Haftada 2–3 kez kas grubu, orta hacim.",
  },
  {
    key: "advanced",
    label: "Pro",
    desc: "Haftada 3 kez kas grubu, yüksek hacim.",
  },
];

const DAYS_PER_WEEK_OPTIONS = [3, 4, 5, 6];

const ExercisesPage = () => {
  const [tab, setTab] = useState("map");
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  // 🔐 Kullanıcı + token
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  // 🎯 Program durumu
  const [program, setProgram] = useState(null); // null → henüz yok
  const [selectedDay, setSelectedDay] = useState("Pazartesi");
  const [loadingProgram, setLoadingProgram] = useState(false);
  const [programError, setProgramError] = useState(null);

  // 📌 Egzersiz kartı expand state
  const [expandedExercises, setExpandedExercises] = useState({});

  // ⚙️ Program oluşturma/yenileme modalı
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [selectedDaysPerWeek, setSelectedDaysPerWeek] = useState(3);

  // 🎬 Video Modal
  const [videoModal, setVideoModal] = useState(false);
  const [selectedExerciseData, setSelectedExerciseData] = useState(null);

  // İlk açılışta backend'den programı çek
  useEffect(() => {
    if (token) {
      fetchProgram();
    }
  }, [token]);

  const normalizeProgram = (raw) => {
    // Beklenen format: { Pazartesi: [...], Salı: [...], ... }
    const normalized = {};
    DAYS.forEach((day) => {
      normalized[day] =
        raw?.[day] ||
        raw?.[day.toLowerCase()] || // monday → pazartesi gibi değilse bile fallback
        [];
    });
    return normalized;
  };

  const fetchProgram = async () => {
    try {
      setLoadingProgram(true);
      setProgramError(null);
      const rawProgram = await TrainingProgramService.getProgram(token);
      const normalized = normalizeProgram(rawProgram);

      // Tüm günlerde egzersiz yoksa "boş" sayalım
      const hasAny =
        Object.values(normalized).flat().length > 0;

      setProgram(hasAny ? normalized : null);

      if (hasAny) {
        const firstDayWithEx =
          DAYS.find((d) => (normalized[d] || []).length > 0) || "Pazartesi";
        setSelectedDay(firstDayWithEx);
      }
    } catch (err) {
      // 404 vs için program yok sayabiliriz
      setProgram(null);
      setProgramError(err.message || "Program yüklenirken hata oluştu.");
    } finally {
      setLoadingProgram(false);
    }
  };

  const toggleExpand = (day, index) => {
    const key = `${day}-${index}`;
    setExpandedExercises((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isProfileComplete = () => {
    if (!user) return false;
    // Backend’de user_details ile tam çözeceksiniz, burada minimum kontrol:
    if (!user.height || !user.weight || !user.dateOfBirth) return false;
    return true;
  };

  const openConfigModal = () => {
    if (!isProfileComplete()) {
      Alert.alert(
        "Profil Eksik",
        "Lütfen profil sayfasından boy, kilo, doğum tarihi ve sağlık bilgilerinizi doldurun."
      );
      return;
    }
    setConfigModalVisible(true);
  };

  const handleSubmitProgramConfig = async () => {
    try {
      if (!token) {
        Alert.alert("Oturum Hatası", "Lütfen tekrar giriş yapın.");
        return;
      }

      setLoadingProgram(true);
      setProgramError(null);

      let rawProgram;
      rawProgram = await TrainingProgramService.generateProgram({
       token,
       level: selectedLevel,
        daysPerWeek: selectedDaysPerWeek,
         user: {
          height: user?.height,
          weight: user?.weight,
           age: user?.dateOfBirth
           ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()
            : null,
            goal: "Kilo Alma",       // Şimdilik sabit → sonra ProfilePage’den alırız
            illnesses: [],           // Şimdilik boş → health bilgilerini buraya taşıyacağız
  }
});


      const normalized = normalizeProgram(rawProgram);
      const hasAny =
        Object.values(normalized).flat().length > 0;
      setProgram(hasAny ? normalized : null);

      if (hasAny) {
        const firstDayWithEx =
          DAYS.find((d) => (normalized[d] || []).length > 0) || "Pazartesi";
        setSelectedDay(firstDayWithEx);
      }

      setConfigModalVisible(false);
      Alert.alert(
        "Başarılı",
        program ? "Programın yenilendi." : "Programın oluşturuldu."
      );
    } catch (err) {
      console.log("Program create/refresh error:", err);
      Alert.alert(
        "Hata",
        err.message || "Program oluşturulurken bir hata oluştu."
      );
    } finally {
      setLoadingProgram(false);
    }
  };

  return (
    <Layout>
      <SafeAreaView style={styles.safeContainer}>
        {/* TABLAR */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tabButton, tab === "map" && styles.activeTab]}
            onPress={() => {
              setTab("map");
              setSelectedMuscle(null);
            }}
          >
            <Text style={styles.tabText}>Kaslar</Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, tab === "program" && styles.activeTab]}
            onPress={() => setTab("program")}
          >
            <Text style={styles.tabText}>Program</Text>
          </Pressable>
        </View>

        {/* 📍 KAS KARTLARI */}
        {tab === "map" && !selectedMuscle && (
          <ScrollView style={{ width: "100%" }}>
            {Object.keys(IMAGE_MAP).map((muscle, i) => (
              <Pressable
                key={i}
                style={styles.fullCard}
                onPress={() => setSelectedMuscle(muscle)}
              >
                <Image source={IMAGE_MAP[muscle]} style={styles.cardImage} />
                <Text style={styles.cardText}>{muscle}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* 📍 EGZERSİZ DETAY (Kas seçili iken) */}
        {tab === "map" && selectedMuscle && (
          <View style={styles.muscleDetail}>
            <Text style={styles.header}>{selectedMuscle} Egzersizleri</Text>
            <ScrollView style={{ width: "95%" }}>
              {(EXERCISE_LIBRARY[selectedMuscle] || []).map((ex, i) => (
                <View key={i} style={styles.exerciseCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exerciseName}>{ex.name}</Text>
                    <Text style={styles.descriptionSmall}>{ex.desc}</Text>
                  </View>
                  {ex.gif && (
                    <Pressable
                      style={styles.videoButton}
                      onPress={() => {
                        setSelectedExerciseData(ex);
                        setVideoModal(true);
                      }}
                    >
                      <Text style={{ color: "white" }}>Gif 🎥</Text>
                    </Pressable>
                  )}
                </View>
              ))}
            </ScrollView>

            <Pressable
              style={styles.backButton}
              onPress={() => setSelectedMuscle(null)}
            >
              <Text style={styles.backText}>← Geri</Text>
            </Pressable>
          </View>
        )}

        {/* 🎬 VİDEO MODAL */}
        <Modal visible={videoModal} animationType="slide" transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {selectedExerciseData?.name}
              </Text>
              <View style={styles.videoContainer}>
                {selectedExerciseData?.gif ? (
                  <Image
                    source={selectedExerciseData.gif}
                    style={{
                      width: "100%",
                      height: 200,
                      resizeMode: "contain",
                    }}
                  />
                ) : (
                  <Text style={{ color: "white" }}>
                    Bu egzersiz için gif tanımlı değil.
                  </Text>
                )}
              </View>
              <Text style={styles.description}>
                {selectedExerciseData?.desc}
              </Text>

              <Pressable
                style={styles.closeButton}
                onPress={() => setVideoModal(false)}
              >
                <Text style={{ color: "white" }}>Kapat</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* 🧠 PROGRAM SEKME */}
        {tab === "program" && (
          <ScrollView
            style={{ width: "95%" }}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {loadingProgram && (
              <View style={{ alignItems: "center", marginVertical: 10 }}>
                <ActivityIndicator size="small" color="#D6B982" />
                <Text style={{ color: "#ccc", marginTop: 5 }}>
                  Program yükleniyor...
                </Text>
              </View>
            )}

            {programError && (
              <Text style={styles.errorText}>{programError}</Text>
            )}

            {!loadingProgram && !program && (
              <View style={styles.programEmptyBox}>
                <Text style={styles.programEmptyText}>
                  Henüz bir antrenman programın yok.
                </Text>
                <Text style={styles.programEmptySubText}>
                  Profil bilgilerin (boy, kilo, yaş, sağlık durumu) ve hedefin
                  dikkate alınarak otomatik bir program oluşturacağız.
                </Text>
                <Pressable
                  style={styles.primaryButton}
                  onPress={openConfigModal}
                >
                  <Text style={styles.primaryButtonText}>Program Oluştur</Text>
                </Pressable>
              </View>
            )}

            {!loadingProgram && program && (
              <>
                {/* Gün seçimi */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 10 }}
                >
                  {DAYS.map((day) => (
                    <Pressable
                      key={day}
                      onPress={() => setSelectedDay(day)}
                      style={[
                        styles.dayButton,
                        selectedDay === day && styles.activeDayButton,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          selectedDay === day && styles.activeDayText,
                        ]}
                      >
                        {day}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>

                <Text style={styles.sectionTitle}>
                  {selectedDay} Programı
                </Text>

                {(program[selectedDay] || []).length === 0 ? (
                  <Text style={styles.noExerciseText}>
                    Bu gün için egzersiz atanmamış.
                  </Text>
                ) : (
                  (program[selectedDay] || []).map((ex, index) => {
                    const key = `${selectedDay}-${index}`;
                    const expanded = expandedExercises[key];

                    return (
                      <Pressable
                        key={key}
                        style={styles.programExerciseCard}
                        onPress={() => toggleExpand(selectedDay, index)}
                      >
                        <View style={styles.programExerciseHeader}>
                          <Text style={styles.programExerciseName}>
                            {ex.name}
                          </Text>
                          <Text style={styles.expandIcon}>
                            {expanded ? "▲" : "▼"}
                          </Text>
                        </View>

                        {expanded && (
                          <View style={styles.programExerciseDetails}>
                            {ex.muscle_group && (
                              <Text style={styles.programDetailText}>
                                <Text style={styles.programDetailLabel}>
                                  Kas Grubu:{" "}
                                </Text>
                                {ex.muscle_group}
                              </Text>
                            )}
                            {(ex.sets || ex.reps) && (
                              <Text style={styles.programDetailText}>
                                <Text style={styles.programDetailLabel}>
                                  Set / Tekrar:{" "}
                                </Text>
                                {ex.sets ? `${ex.sets} set` : ""}{" "}
                                {ex.reps ? `x ${ex.reps}` : ""}
                              </Text>
                            )}
                            {ex.rest_time && (
                              <Text style={styles.programDetailText}>
                                <Text style={styles.programDetailLabel}>
                                  Dinlenme:{" "}
                                </Text>
                                {ex.rest_time} sn
                              </Text>
                            )}
                            {ex.notes && (
                              <Text style={styles.programDetailText}>
                                <Text style={styles.programDetailLabel}>
                                  Not:{" "}
                                </Text>
                                {ex.notes}
                              </Text>
                            )}
                          </View>
                        )}
                      </Pressable>
                    );
                  })
                )}

                <Pressable
                  style={[styles.primaryButton, { marginTop: 20 }]}
                  onPress={openConfigModal}
                >
                  <Text style={styles.primaryButtonText}>Programı Yenile</Text>
                </Pressable>
              </>
            )}
          </ScrollView>
        )}

        {/* ⚙️ PROGRAM OLUŞTUR / YENİLE MODALI */}
        <Modal
          visible={configModalVisible}
          transparent
          animationType="slide"
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {program ? "Programı Yenile" : "Program Oluştur"}
              </Text>

              <Text style={styles.modalSubtitle}>Seviyeni Seç</Text>
              {LEVEL_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.key}
                  style={[
                    styles.optionCard,
                    selectedLevel === opt.key && styles.optionSelected,
                  ]}
                  onPress={() => setSelectedLevel(opt.key)}
                >
                  <Text
                    style={[
                      styles.optionTitle,
                      selectedLevel === opt.key && styles.optionTitleSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text style={styles.optionDesc}>{opt.desc}</Text>
                </Pressable>
              ))}

              <Text style={[styles.modalSubtitle, { marginTop: 10 }]}>
                Haftalık Gün Sayısı
              </Text>
              <View style={styles.daysRow}>
                {DAYS_PER_WEEK_OPTIONS.map((d) => (
                  <Pressable
                    key={d}
                    style={[
                      styles.daysPill,
                      selectedDaysPerWeek === d && styles.daysPillActive,
                    ]}
                    onPress={() => setSelectedDaysPerWeek(d)}
                  >
                    <Text
                      style={[
                        styles.daysPillText,
                        selectedDaysPerWeek === d &&
                          styles.daysPillTextActive,
                      ]}
                    >
                      {d} gün
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.modalButtonsRow}>
                <Pressable
                  style={[styles.primaryButton, { flex: 1, marginRight: 8 }]}
                  onPress={handleSubmitProgramConfig}
                >
                  <Text style={styles.primaryButtonText}>
                    {program ? "Yenile" : "Oluştur"}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.closeButton, { flex: 1, marginLeft: 8 }]}
                  onPress={() => setConfigModalVisible(false)}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Kapat
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Layout>
  );
};

export default ExercisesPage;

// 📌 STYLES
const styles = StyleSheet.create({
  safeContainer: { flex: 1, width: "100%", paddingTop: 10 },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  tabButton: {
    padding: 10,
    backgroundColor: "#222",
    marginHorizontal: 5,
    borderRadius: 10,
  },
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

  muscleDetail: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#D6B982",
    marginBottom: 10,
  },

  exerciseCard: {
    backgroundColor: "#1c1c1c",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  exerciseName: { color: "white", fontSize: 16, marginBottom: 4 },
  videoButton: {
    backgroundColor: "#555",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: "center",
  },

  backButton: {
    marginTop: 15,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
  },
  backText: { color: "white", fontWeight: "bold" },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: "90%",
    backgroundColor: "#1c1c1c",
    padding: 20,
    borderRadius: 16,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    color: "#D6B982",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  videoContainer: {
    height: 200,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
  },
  description: { color: "#aaa", marginBottom: 15 },
  descriptionSmall: { color: "#aaa", fontSize: 12, marginTop: 4 },

  closeButton: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  // Program
  dayButton: {
    backgroundColor: "#333",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  activeDayButton: { backgroundColor: "#D6B982" },
  dayText: { color: "#fff" },
  activeDayText: { color: "#000", fontWeight: "bold" },

  sectionTitle: {
    color: "#D6B982",
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
  },
  errorText: {
    color: "#ff7070",
    textAlign: "center",
    marginVertical: 8,
  },
  programEmptyBox: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
  },
  programEmptyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
  },
  programEmptySubText: {
    color: "#aaa",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#D6B982",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 6,
  },
  primaryButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 15,
  },
  noExerciseText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 10,
  },

  programExerciseCard: {
    backgroundColor: "#1c1c1c",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  programExerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  programExerciseName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  expandIcon: {
    color: "#D6B982",
    fontSize: 14,
  },
  programExerciseDetails: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 6,
  },
  programDetailText: {
    color: "#ddd",
    fontSize: 13,
    marginTop: 2,
  },
  programDetailLabel: {
    color: "#D6B982",
    fontWeight: "600",
  },

  modalSubtitle: {
    color: "#D6B982",
    fontWeight: "600",
    fontSize: 15,
    marginTop: 8,
    marginBottom: 4,
  },
  optionCard: {
    backgroundColor: "#262626",
    borderRadius: 10,
    padding: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#444",
  },
  optionSelected: {
    borderColor: "#D6B982",
    backgroundColor: "#3a2f22",
  },
  optionTitle: { color: "#fff", fontSize: 15, fontWeight: "600" },
  optionTitleSelected: { color: "#D6B982" },
  optionDesc: { color: "#aaa", fontSize: 12, marginTop: 2 },

  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 8,
  },
  daysPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#333",
    marginHorizontal: 2,
  },
  daysPillActive: {
    backgroundColor: "#D6B982",
  },
  daysPillText: { color: "#fff", fontSize: 13 },
  daysPillTextActive: { color: "#000", fontWeight: "700" },

  modalButtonsRow: {
    flexDirection: "row",
    marginTop: 12,
  },
});
