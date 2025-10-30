import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { User } from '../types';
import apiService from '../services/api';

interface ProfileScreenProps {
  user?: User | null;
  onLogout?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user: propUser, onLogout }) => {
  const [user, setUser] = useState<User | null>(propUser || null);
  const [isLoading, setIsLoading] = useState(!propUser);
  const [isEditing, setIsEditing] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [injuries, setInjuries] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const injuryOptions = ['Diz Ağrısı', 'Bel Ağrısı', 'Boyun Ağrısı'];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = await apiService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      } else {
        const response = await apiService.getProfile();
        if (response.success && response.data) {
          setUser(response.data);
        }
      }

      // Load user details
      try {
        const detailsResponse = await apiService.getUserDetails();
        if (detailsResponse.success && detailsResponse.data) {
          setHeight(detailsResponse.data.height?.toString() || '');
          setWeight(detailsResponse.data.weight?.toString() || '');
          setInjuries(detailsResponse.data.injuries || []);
        }
      } catch (error) {
        console.log('No user details found, using defaults');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await apiService.logout();
            if (onLogout) {
              onLogout();
            }
          },
        },
      ]
    );
  };

  const toggleInjury = (injury: string) => {
    if (injuries.includes(injury)) {
      setInjuries(injuries.filter(i => i !== injury));
    } else {
      setInjuries([...injuries, injury]);
    }
  };

  const handleSave = async () => {
    if (!height.trim() || !weight.trim()) {
      Alert.alert('Hata', 'Lütfen boy ve kilo bilgilerini girin');
      return;
    }

    setIsSaving(true);
    try {
      const response = await apiService.updateUserDetails({
        height: parseInt(height),
        weight: parseFloat(weight),
        injuries: injuries
      });
      
      if (response.success) {
        Alert.alert('Başarılı', 'Bilgileriniz kaydedildi');
        setIsEditing(false);
      } else {
        Alert.alert('Hata', response.message || 'Bilgiler kaydedilemedi');
      }
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Bilgiler kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Icon name="person" size={60} color="#007AFF" />
          </View>
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setIsEditing(!isEditing)}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'İptal' : 'Düzenle'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Boy (cm)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="Örn: 175"
                keyboardType="numeric"
                editable={isEditing}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kilo (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="Örn: 70"
                keyboardType="numeric"
                editable={isEditing}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rahatsızlıklar</Text>
              <View style={styles.injuryContainer}>
                {injuryOptions.map((injury) => (
                  <TouchableOpacity
                    key={injury}
                    style={[
                      styles.injuryOption,
                      injuries.includes(injury) && styles.injurySelected
                    ]}
                    onPress={() => isEditing && toggleInjury(injury)}
                    disabled={!isEditing}
                  >
                    <Text style={[
                      styles.injuryText,
                      injuries.includes(injury) && styles.injuryTextSelected
                    ]}>
                      {injury}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {isEditing && (
              <TouchableOpacity 
                style={[styles.saveButton, isSaving && styles.disabledButton]} 
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text style={styles.saveButtonText}>
                  {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="#fff" />
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  form: {
    gap: 15,
  },
  inputGroup: {
    gap: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  injuryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  injuryOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  injurySelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  injuryText: {
    fontSize: 14,
    color: '#666',
  },
  injuryTextSelected: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;