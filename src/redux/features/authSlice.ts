import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user : {first_name:"",last_name:"",user_id:"",city:"",email:"",gender:"",phone:""},
  isLoggedIn: false,
  email: null,
  userName: null,
  password: null,
  user_id: null,
  previousURL: null,
  product: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.isLoggedIn = true;
      state.user  = payload
      state.email = payload.email;
      state.userName = payload.userName;
      state.user_id = payload.user_id;
    },
    removeUser: (state) => {
      state.user = {first_name:"",last_name:"",user_id:"",city:"",email:"",gender:"",phone:""},
      state.isLoggedIn = false;
      state.email = null;
      state.userName = null;
      state.user_id = null;
    },
    addPrevURL: (state, { payload }) => {
      state.previousURL = payload.url;
      state.product = payload.product;
    },
    removePrevURL: (state) => {
      state.previousURL = null;
      state.product = null;
    },
  },
});

export const { setUser, removeUser, addPrevURL, removePrevURL } =
  authSlice.actions;
export default authSlice.reducer;
