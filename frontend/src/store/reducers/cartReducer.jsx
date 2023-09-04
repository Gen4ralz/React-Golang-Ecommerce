import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const cartReducer = createSlice({
  name: 'cartReducer',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cartItems.push(action.payload);
    },
    updateCart: (state, action) => {
      state.cartItems = action.payload;
    },
    emptyCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, updateCart, emptyCart } = cartReducer.actions;
export default cartReducer.reducer;
