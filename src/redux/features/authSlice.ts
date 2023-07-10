import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  email: null,
  userName:null,
  password: null,
  userId: null,
  previousURL:null,
  product:null,
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
    addPrevURL:(state, {payload}) => {
      state.previousURL = payload.url
      state.product = payload.product
    },
    removePrevURL:(state) => {
      state.previousURL = null
      state.product = null
    }
  },
});

export const { setUser, removeUser, addPrevURL,removePrevURL } = authSlice.actions;
export default authSlice.reducer;
