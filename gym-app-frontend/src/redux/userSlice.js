import { createSlice , createAsyncThunk} from '@reduxjs/toolkit'
import { use } from 'react'
import {getAuth , signInWithEmailAndPassword} from 'firebase/auth'

// "export const login = createAsyncThunk('user/login',async({username , passsword})=>{
//     try {
//         const auth = getAuth();
//         const userCredential = await signInWithEmailAndPassword(auth , username , passsword);
//         const user = userCredential.user;
//         const token = user.stsTokenManager.accessToken;

//         const userData ={
//             token,
//             user: user,
//         }
//         return userData
//     } catch (error) {
//         console.log("userSlice 21 line", error);
//         throw error;
//     }


// })"



const initialState = {
  email: null,
  password: null,
  isLoading: false,
  isAuth: false,
  user: null, // Kullanıcı bilgileri burada tutulacak
  userDetails: null, // Kullanıcı detayları (height, weight, injuries)
  users:{
    userEmail: "test@test.com",
    userPassword:"123456",
  }
}


export const userSlice = createSlice({
  name: 'user',
  initialState,
    reducers:{
        setEmail: (state , action )=>{
            const lowerCaseEmail = action.payload.toLowerCase();
            state.email = lowerCaseEmail;
        },
        setPassword: (state , action )=>{
            state.password = action.payload
        },
        setIsLoading: (state , action )=>{
            state.isLoading = action.payload
        },
        setLogin: (state)=>{
            if(state.email === state.users.userEmail && state.password === state.users.userPassword){  
                state.isAuth = true;
            }
            else {
                state.isAuth = false;
            }
        },
        setAuth: (state, action) => {
            state.isAuth = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setUserDetails: (state, action) => {
            state.userDetails = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
            state.userDetails = null;
            state.isAuth = false;
            state.email = null;
            state.password = null;
        }
    },
    // extraReducers:(builder)=>{
    //     builder
    //     .addCase(login.pending,(state)=>{})
    //     .addCase(login.fulfilled,(state)=>{})
    //     .addCase(login.fulfilled,(state)=>{})


    // }


})


export const {  setEmail , setPassword , setIsLoading , setLogin , setAuth , setUser , setUserDetails , clearUser } = userSlice.actions;
export default userSlice.reducer;