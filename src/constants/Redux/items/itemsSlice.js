import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
}

export const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = state.items.find(p => p.id === action.payload.id)
            if (item) {
                item.quantity += action.payload.quantity
            } else {
                state.items.push(action.payload);
            }
        },
        increment: (state, action) => {
            const item = state.items.find(p => p.id === action.payload)
            if (item) {
                item.quantity++
            } else {
                return null;
            }
        },
        decrement: (state, action) => {
            const item = state.items.find(p => p.id === action.payload)
            if (item) {
                item.quantity--
            } else {
                return null;
            }
        },

        removeItem: (state, action) => {
            state.items = state.items.filter(p => p.id !== action.payload);
        },

        resetCart: (state) => {
            state.items = []
        },
    }
})

export const { addToCart, increment, decrement, removeItem, resetCart } = itemsSlice.actions;
export default itemsSlice.reducer;