import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.itemCount = state.items.reduce((sum, item) => sum + item.qty, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
