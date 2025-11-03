import { createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';



const saveCartToFirestore = async (state) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const cartRef = doc(db, 'cart', user.uid);
            await setDoc(cartRef, { items: state.items });
        }
    } catch (e) {
        console.warn("Could not save cart to Firestore", e);
    }
};

const loadCartFromFirestore = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
            const cartRef = doc(db, 'cart', user.uid);
            const cartDoc = await getDoc(cartRef);
            if (cartDoc.exists()) {
                return cartDoc.data().items;
            }
        }
        return [];
    } catch (e) {
        console.warn("Could not load cart from Firestore", e);
        return [];
    }
};

const initialState = {
    items: [],
}

export const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        loadCart: (state, action) => {
            state.items = action.payload || [];
        },
        addToCart: (state, action) => {
            const item = state.items.find(p => p.id === action.payload.id)
            if (item) {
                // if it exsits add its count ( quantity )
                item.quantity += action.payload.quantity || 1;
            } else {
                // if not incart just add it with a default quantity 1
                state.items.push({
                    ...action.payload,
                    quantity: action.payload.quantity || 1,
                })
            }
            saveCartToFirestore(state);
        },
        increment: (state, action) => {
            const item = state.items.find(p => p.id === action.payload);
            if (item) {
                item.quantity++;
                saveCartToFirestore(state);
            }
        },

        decrement: (state, action) => {
            const item = state.items.find(p => p.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                saveCartToFirestore(state);
            }
        },

        removeItem: (state, action) => {
            state.items = state.items.filter(p => p.id !== action.payload);
            saveCartToFirestore(state);
        },

        resetCart: (state) => {
            state.items = []
            saveCartToFirestore(state);
        },
    }
})

export const { addToCart, increment, decrement, removeItem, resetCart, loadCart } = itemsSlice.actions;
export { loadCartFromFirestore };
export default itemsSlice.reducer;