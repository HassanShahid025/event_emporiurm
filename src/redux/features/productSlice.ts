import { createSlice } from "@reduxjs/toolkit";
import { IProduct, IProducts } from "../../types";

const initialState:IProduct = {
  products: [],
  minPrice:null,
  maxPrice:null
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    Store_Products : (state, {payload}) => {
        const {products} = payload;
        state.products = products
    },
    get_price_range:(state,{payload}) => {
      const {products} = payload 
      let priceArray:number[] = []
      products.map((product:IProducts) => {
        const price = product.price
       return priceArray.push(price!)
      })
      const max = Math.max(...priceArray) 
      const min = Math.min(...priceArray) 

      state.minPrice = min
      state.maxPrice = max
    },
  },
});

export const {Store_Products,get_price_range} = productSlice.actions;

export default productSlice.reducer;
