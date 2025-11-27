import { StyleSheet} from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './AuthStack'
import UserStack from './UserStack'
import { useSelector, useDispatch } from 'react-redux'
import { setAuth, setUser } from '../redux/userSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import app from '../../firebaseConfig'

const rootNavigation = () => {
  const { isAuth } = useSelector((state)=>state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // Uygulama açıldığında kullanıcı bilgilerini yükle
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const userString = await AsyncStorage.getItem('user');
        
        if (token && userString) {
          const user = JSON.parse(userString);
          dispatch(setAuth(true));
          dispatch(setUser(user));
        }
      } catch (error) {
        console.error('Kullanıcı bilgileri yüklenirken hata:', error);
      }
    };

    loadUserData();
  }, []);

  return (
   <NavigationContainer>

        { 
        !isAuth 
        ? <AuthStack/> 
        : <UserStack/> 
        }

   </NavigationContainer>
  )
}

export default rootNavigation

const styles = StyleSheet.create({})