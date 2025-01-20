import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userToken: localStorage.getItem('token'),
  loading: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.userToken = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearAuth: (state) => {
      state.userToken = null;
      localStorage.removeItem('token');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setAuth, clearAuth, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;