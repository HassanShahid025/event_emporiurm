import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    shippingAddress:{},
    billingAddress:{},
}

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    save_shippingAddress:(state, {payload}) => {
        state.shippingAddress = payload
    },
    save_billingAddress:(state, {payload}) => {
        state.billingAddress = payload
    },
  }
});

export const {save_shippingAddress,save_billingAddress} = checkoutSlice.actions

export default checkoutSlice.reducer