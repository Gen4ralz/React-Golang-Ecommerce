import { createSlice } from '@reduxjs/toolkit';

const userStorage = JSON.parse(localStorage.getItem('user-session'));
const authReducer = createSlice({
  name: 'authReducer',
  initialState: {
    userSession: userStorage ? userStorage : null,
  },
  reducers: {
    setUserSession: (state, action) => {
      state.userSession = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem('user-session');
      state.userSession = null;
    },
  },
});

export const { setUserSession, logout } = authReducer.actions;
export default authReducer.reducer;
