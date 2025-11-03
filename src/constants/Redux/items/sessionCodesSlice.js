import { createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Generate unique access code
const generateAccessCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const saveSessionCodeAccess = async (state) => {
    const user = auth.currentUser;
    if (user) {
        await setDoc(doc(db, 'sessionCodesAccess', user.uid), { sessions: state.sessions });
    }
};

export const sessionCodeSlice = createSlice({
    name: 'sessions',
    initialState: { sessions: [] },
    reducers: {
        addSessionToCart: (state, action) => {
            const newSession = { ...action.payload, accessCode: generateAccessCode() };
            state.sessions.push(newSession);
            saveSessionCodeAccess(state);
        },
        verifyCode: (state, action) => {
            const code = action.payload;
            return state.sessions.find(s => s.accessCode === code) || null;
        },
    },
});

export const { addSessionToCart, verifyCode } = sessionSlice.actions;
export default sessionCodeSlice.reducer;
