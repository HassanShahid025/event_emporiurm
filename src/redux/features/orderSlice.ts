import { createSlice } from '@reduxjs/toolkit'
import { IOrderHistory } from '../../types';
import { OrderHistory } from '../../pages/export';

const initialState:IOrderHistory = {
    orderHistory:[],
    totalOrderAmount:0
}

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    store_order:(state,{payload}) => {
        state.orderHistory = payload 
    },
    calc_total_orders_amount:(state) => {
      let tempOrdersTotalAmount = 0;
      for (let i = 0; i < state.orderHistory.length; i++) {
        tempOrdersTotalAmount +=
          state.orderHistory[i].orderAmount;
      }
      state.totalOrderAmount = tempOrdersTotalAmount;
    }
  }
});

export const {store_order,calc_total_orders_amount} = orderSlice.actions

export default orderSlice.reducer