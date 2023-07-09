import { createSlice } from "@reduxjs/toolkit";
import { ICart, IProducts } from "../../types";
import { toast } from "react-toastify";

const initialState: ICart = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems")!)
    : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  previousUrl: "",
  isFavourite: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggle_favourite: (state, { payload }) => {
      const { product } = payload;
      const productIndex = state.cartItems.findIndex(
        (item) => item.id === product.id
      );

      if (productIndex >= 0) {
        const newCartItems = state.cartItems.filter(
          (item) => item.id !== product.id
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
    add_to_cart: (state, { payload }) => {
      const { product } = payload;
      const productIndex = state.cartItems.findIndex(
        (item) => item.id === product.id
      );

      console.log(productIndex)

      if (productIndex >= 0) {
        // if product already exist in cart so productIndex will be -1

        state.cartItems[productIndex].cartQuantiy! += 1;
        toast.info(`${product.name} increased by one`, {
          position: "top-left",
        });
      } else {
        // if product doesnt exist in cart

        const tempProduct = { ...product, cartQuantiy: 1 };
        state.cartItems.push(tempProduct);
        toast.success(`${product.name} added to cart`, {
          position: "top-left",
        });
      }
      //save cart to local storage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    decrease_cart: (state, { payload }) => {
      const { product } = payload;
      const productIndex = state.cartItems.findIndex(
        (item) => item.id === product.id
      );
      if (state.cartItems[productIndex].cartQuantiy! > 1) {
        state.cartItems[productIndex].cartQuantiy! -= 1;
        toast.info(`${product.name} decreased by one`, {
          position: "top-left",
        });
      } else if (state.cartItems[productIndex].cartQuantiy! === 1) {
        const newCartItems = state.cartItems.filter(
          (item) => item.id !== product.id
        );
        state.cartItems = newCartItems;
        toast.success(`${product.name} removed from cart`, {
          position: "top-left",
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    remove_from_cart: (state, { payload }) => {
      const { product } = payload;
      const newCartItems = state.cartItems.filter(
        (item) => item.id !== product.id
      );
      state.cartItems = newCartItems;
      toast.success(`${product.name} removed from cart`, {
        position: "top-left",
      });
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clear_cart: (state) => {
      state.cartItems = [];

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    calculate_cartTotalAmount: (state) => {
      let tempCartTotalAmount = 0;
      for (let i = 0; i < state.cartItems.length; i++) {
        tempCartTotalAmount +=
          state.cartItems[i].price! * state.cartItems[i].cartQuantiy!;
      }
      state.cartTotalAmount = tempCartTotalAmount;
    },
    calculate_CartTotalQuantity: (state) => {
      let tempCartTotalQuantity = 0;
      for (let i = 0; i < state.cartItems.length; i++) {
        tempCartTotalQuantity += state.cartItems[i].cartQuantiy!;
      }
      state.cartTotalQuantity = tempCartTotalQuantity;
    },
    save_url: (state, { payload }) => {
      state.previousUrl = payload;
    },
  },
});

export const {
  toggle_favourite,
  add_to_cart,
  decrease_cart,
  remove_from_cart,
  clear_cart,
  calculate_cartTotalAmount,
  calculate_CartTotalQuantity,
  save_url,
} = cartSlice.actions;

export default cartSlice.reducer;
