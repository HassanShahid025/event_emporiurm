import { createSlice } from "@reduxjs/toolkit";
import { ICart, IProducts } from "../../types";
import { toast } from "react-toastify";

const initialState: ICart = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems")!)
    : [],
  isFavourite: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggle_favourite: (state, { payload }) => {
      const { product } = payload;
      console.log(product)
      const productIndex = state.cartItems.findIndex(
        (item) => item.ad_id === product.id
      );

      if (productIndex >= 0) {
        const newCartItems = state.cartItems.filter(
          (item) => item.ad_id !== product.id
        );
        state.cartItems = newCartItems;
        toast.success(`${product.name} removed from favourites`, {
          position: "top-left",
        });
        
      }

      else{
        const tempProduct = { ...product };
        state.cartItems.push(tempProduct);
        toast.success(`${product.name} added to favourite`, {
          position: "top-left",
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    
    clear_cart: (state) => {
      state.cartItems = [];

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
 
  },
});

export const {
  toggle_favourite,
  clear_cart
} = cartSlice.actions;

export default cartSlice.reducer;
