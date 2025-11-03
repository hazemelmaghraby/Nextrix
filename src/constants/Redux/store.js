import { configureStore } from "@reduxjs/toolkit";
import itemsReducer from "./items/itemsSlice";
import { itemsApi } from "./items/fetchItems";
import { sessionsApi } from "./items/fetchSessionCodes"
import { coursesApi } from "./items/fetchCourses";

export const store = configureStore({
    reducer: {
        itemsReducer,
        [itemsApi.reducerPath]: itemsApi.reducer,
        [sessionsApi.reducerPath]: sessionsApi.reducer,
        [coursesApi.reducerPath]: coursesApi.reducer
    }, middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(itemsApi.middleware)
            .concat(sessionsApi.middleware)
            .concat(coursesApi.middleware),
});

export default store;