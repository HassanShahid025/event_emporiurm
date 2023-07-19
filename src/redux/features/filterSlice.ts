import { createSlice } from "@reduxjs/toolkit";
import { IFilter, IProducts } from "../../types";
import { configConsumerProps } from "antd/es/config-provider";

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
        product.location?.toLowerCase().includes(search.toLowerCase())||
        product.venue_category?.toLowerCase().includes(search.toLowerCase())||
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
      console.log(products)
      console.log(category)
      let tempProducts:IProducts[] = []
      if(category === "All"){
        tempProducts = products
      }else{
        tempProducts = products.filter((product:IProducts) => product.category === category)
      }
      state.filteredProducts = tempProducts
      console.log(state.filteredProducts)
    },
    filter_by_city:(state, {payload}) => {
      const {products,city,category} = payload
      let tempProducts:IProducts[] = []
      if(city === "All" && category === "All"){
        tempProducts = products
      }
      else if(category !== "All" && city === "All"){
        tempProducts = products.filter((product:IProducts) => product.category === category)
      }
      else{
        tempProducts = products.filter((product:IProducts) => product.city === city)
      }
      state.filteredProducts = tempProducts
    },
    filter_by_price:(state, {payload}) => {
      const {price, products} = payload
      const intPrice = parseInt(price, 10);
      let tempProducts:IProducts[] = []
      tempProducts = products.filter((product:IProducts) => product.price! >= intPrice)
      state.filteredProducts = tempProducts
    }
  },
});

export const { filter_by_search, filter_by_sort,filter_by_category, filter_by_price, filter_by_city } = filterSlice.actions;

export default filterSlice.reducer;
