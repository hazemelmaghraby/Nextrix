import { configureStore } from "@reduxjs/toolkit";
import itemsReducer from "./items/itemsSlice";

export const store = configureStore({
    reducer: {
        itemsReducer,
    },
});

export default store;