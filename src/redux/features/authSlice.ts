import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  email: null,
  userName:null,
  password: null,
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.isLoggedIn = true;
      state.email = payload.email;
      state.userName= payload.userName;
      state.userId = payload.userId;
    },
    removeUser: (state) => {
      state.isLoggedIn = false;
      state.email = null;
      state.userName= null;
      state.userId = null;
    },
  },
});

export const { setUser, removeUser } = authSlice.actions;
export default authSlice.reducer;
