
import React from 'react'
import { StyleSheet } from 'react-native'
import { HomePage , ProfilePage , ExercisesPage , DietPage } from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from "@expo/vector-icons/Ionicons";

import { FontAwesome6 } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';




const Tab = createBottomTabNavigator();

const UserStack = () => {
  return (
      <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
         tabBarStyle: {
          backgroundColor: '#000',
          height: 80,           // ✅ bar'ı büyüttük
          paddingBottom: 10,    // alt boşluk
        },
      tabBarIcon: ({ color, size }) => {
        if (route.name === "Exercises") {
          return <FontAwesome6 name="dumbbell" size={size} color={color} />;
        }
        else if (route.name === "Profile") {
          return <Ionicons name="person" size={size} color={color} />;
        }
        else if (route.name === "Home") {
          return <Ionicons name="home" size={size} color={color} />;
        }
        else if (route.name === "Diet") {
          return <MaterialCommunityIcons name="food-apple-outline" size={size} color={color}  />;
        }
      },
        tabBarActiveTintColor: "#FFA040",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#1a1a1a",
          borderTopColor: "#333",
          height: 80,
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{ title: "Ana Sayfa" }}
      />
    
      <Tab.Screen
        name="Exercises"
        component={ExercisesPage}
        options={{ title: "Egzersizler" }}
      />
      <Tab.Screen
        name="Diet"
        component={DietPage}
        options={{ title: "Beslenme" }}
      /> 
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{ title: "Profil" }}
      />
    </Tab.Navigator>
  )
}



export default UserStack

const styles = StyleSheet.create({
  navbar:{
    height:60,
  },
})