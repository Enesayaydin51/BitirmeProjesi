import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  password: null,
  isLoading: false,
  isAuth: false,
  user: null,
  token: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload?.toLowerCase();
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    // 🔥 Backend success sonrası direkt login yap
    setAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    // 🔥 Backend’den gelen kullanıcıyı kaydet
    setUser: (state, action) => {
      state.user = action.payload;
    },
    // 🔥 Token kaydı
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setEmail, setPassword, setIsLoading, setAuth, setUser, setToken } =
  userSlice.actions;

export default userSlice.reducer;
