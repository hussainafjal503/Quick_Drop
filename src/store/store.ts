import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/user/reducer";
import cartSlice from "./slices/cart/cartSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
