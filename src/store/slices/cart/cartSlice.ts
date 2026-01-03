import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  qty: number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICartSlice {
  cartData: IGrocery[] | null;
  subTotal: number;
  deliveryFee: number;
  finalTotal: number;
}

const initialState: ICartSlice = {
  cartData: [],
  subTotal: 0,
  deliveryFee: 40,
  finalTotal: 40,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IGrocery>) => {
      state.cartData?.push(action.payload);

      cartSlice.caseReducers.calculateTotal(state);
    },

    increaseQty: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
      const item = state.cartData?.find((item) => item._id === action.payload);

      if (!item) return;

      item.qty = item.qty + 1;
      cartSlice.caseReducers.calculateTotal(state);
    },
    decreaseQty: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
      const item = state.cartData?.find((item) => item._id === action.payload);

      if (!item) return;

      if (item.qty && item.qty > 1) item.qty = item.qty - 1;
      else {
        state.cartData = state.cartData?.filter(
          (i) => i._id !== action.payload
        );
      }
      cartSlice.caseReducers.calculateTotal(state);
    },

    removeFromCart: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
      state.cartData = state.cartData?.filter((i) => i._id !== action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },

    calculateTotal: (state) => {
      state.subTotal = state.cartData?.reduce(
        (sum, item) => sum + Number(item.price) * item.qty,
        0
      );
      state.deliveryFee = state.subTotal > 100 ? 0 : 40;
      state.finalTotal = state.subTotal + state.deliveryFee;
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  calculateTotal,
} = cartSlice.actions;
export default cartSlice.reducer;
