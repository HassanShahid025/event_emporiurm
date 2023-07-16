import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice'
import productReducer from "./features/productSlice";
import filterReducer from "./features/filterSlice";
import cartReducer from "./features/cartSlice";
import checkoutReducer from "./features/checkoutSlice";
import orderReducer from "./features/orderSlice";
import storage from 'redux-persist/lib/storage';
import {persistReducer} from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
    key : "root",
    version: 1,
    storage
}

const reducer = combineReducers({
    auth:authReducer,
})
const persistedReducer = persistReducer(persistConfig,reducer) 

export const store = configureStore({
    reducer:{
        auth:persistedReducer,
        product:productReducer,
        filter:filterReducer,
        cart:cartReducer,
        checkout:checkoutReducer,
        order:orderReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch