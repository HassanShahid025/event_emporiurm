import { createSlice } from "@reduxjs/toolkit";
import { IFilter, IProducts } from "../../types";

const initialState: IFilter = {
  filteredProducts: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    filter_by_search: (state, { payload }) => {
      const { products, search } = payload;
      const tempProducts = products.filter((product: IProducts) =>
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.brand?.toLowerCase().includes(search.toLowerCase())||
        product.category?.toLowerCase().includes(search.toLowerCase())
      );
      state.filteredProducts = tempProducts
    },
    filter_by_sort: (state, { payload }) => {
      const { products, sort } = payload;
      let tempProducts:IProducts[] = []
      if(sort === "latest"){
        tempProducts = products
      }
      else if(sort === "lowest-price"){
         tempProducts = products.slice().sort((a:IProducts,b:IProducts) => {
          return a.price! - b.price!
         })
      }
      else if(sort === "highest-price"){
         tempProducts = products.slice().sort((a:IProducts,b:IProducts) => {
          return b.price!- a.price!
         })
      }
      else if(sort === "a-z"){
         tempProducts = products.slice().sort((a:IProducts,b:IProducts) => {
          return a.name!.localeCompare(b.name!)
         })
      }
      else if(sort === "z-a"){
         tempProducts = products.slice().sort((a:IProducts,b:IProducts) => {
          return b.name!.localeCompare(a.name!)
         })
      }
      
      state.filteredProducts = tempProducts
    },
    filter_by_category:(state, {payload}) => {
      const {products,category} = payload
      let tempProducts:IProducts[] = []
      if(category === "All"){
        tempProducts = products
      }else{
        tempProducts = products.filter((product:IProducts) => product.category === category)
      }
      state.filteredProducts = tempProducts
    },
    filter_by_brand:(state, {payload}) => {
      const {products,brand,category} = payload
      let tempProducts:IProducts[] = []
      if(brand === "All" && category === "All"){
        tempProducts = products
      }
      else if(category !== "All" && brand === "All"){
        tempProducts = products.filter((product:IProducts) => product.category === category)
      }
      else{
        tempProducts = products.filter((product:IProducts) => product.brand === brand)
      }
      state.filteredProducts = tempProducts
    },
    filter_by_price:(state, {payload}) => {
      const {price, products} = payload
      let tempProducts:IProducts[] = []
      tempProducts = products.filter((product:IProducts) => product.price! <= price)
      state.filteredProducts = tempProducts
    }
  },
});

export const { filter_by_search, filter_by_sort,filter_by_category, filter_by_brand,filter_by_price } = filterSlice.actions;

export default filterSlice.reducer;
