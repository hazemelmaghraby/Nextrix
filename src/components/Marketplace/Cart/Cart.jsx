import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement, removeItem, resetCart, loadCart } from '../../../constants/Redux/items/itemsSlice';
import { loadCartFromFirestore } from '../../../constants/Redux/items/itemsSlice';
import { auth } from '../../../constants/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useUserData from '../../../constants/data/useUserData';
import Loading from '../../../constants/components/Loading';


const Cart = () => {
    const { loading } = useUserData();
    const dispatch = useDispatch();
    const items = useSelector(state => state.itemsReducer.items);
    const navigate = useNavigate();

    // Load cart from Firestore when component mounts or user changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const cartItems = await loadCartFromFirestore();
                dispatch(loadCart(cartItems));
            } else {
                dispatch(loadCart([]));
            }
        });
        return () => unsubscribe();
    }, [dispatch]);

    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white py-25     px-4 overflow-hidden">
            {/* Subtle glowing orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-blue-500/10 blur-3xl rounded-full animate-pulse" />

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl font-bold mb-10 text-center bg-gradient-to-tr from-orange-400 via-amber-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg"
            >
                Your Cart
            </motion.h1>

            {items.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-6xl mx-auto bg-zinc-900/70 border border-zinc-800 rounded-2xl shadow-lg shadow-orange-500/5 backdrop-blur-xl p-8"
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-zinc-800">
                                    <th className="py-3 px-4 text-left text-zinc-400 font-medium uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="py-3 px-4 text-left text-zinc-400 font-medium uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="py-3 px-4 text-center text-zinc-400 font-medium uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="py-3 px-4 text-center text-zinc-400 font-medium uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="py-3 px-4 text-center text-zinc-400 font-medium uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="py-3 px-4 text-center text-zinc-400"></th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((item, i) => {
                                    const price = Number(item.price) || 0;
                                    const quantity = Number(item.quantity) || 1;
                                    const total = price * quantity;

                                    return (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b border-zinc-800 hover:bg-zinc-800/60 transition-all duration-200"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    {item.imageUrl ? (
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.title}
                                                            className="w-14 h-14 rounded-lg bg-zinc-800 object-cover ring-1 ring-zinc-700"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 text-xl font-bold ring-1 ring-zinc-700">
                                                            {item.title?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="font-semibold text-white text-lg">
                                                        {item.title}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 text-zinc-400 max-w-sm truncate">
                                                {item.desc}
                                            </td>

                                            <td className="py-4 px-4 text-center text-green-400 font-semibold">
                                                ${price}
                                            </td>

                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => dispatch(decrement(item.id))}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md bg-zinc-800 text-orange-400 border border-zinc-700 hover:bg-zinc-700 transition disabled:opacity-40"
                                                        disabled={quantity <= 1}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="min-w-[2.5rem] text-center bg-zinc-700 px-2 py-1 rounded text-white font-semibold">
                                                        {quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => dispatch(increment(item.id))}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md bg-zinc-800 text-green-400 border border-zinc-700 hover:bg-zinc-700 transition"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 text-center text-white font-semibold">
                                                ${total.toFixed(2)}
                                            </td>

                                            <td className="py-4 px-4 text-center">
                                                <button
                                                    className="text-red-400 hover:text-red-500 hover:underline text-sm transition"
                                                    onClick={() => dispatch(removeItem(item.id))}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Row */}
                    <div className="mt-10 flex flex-col md:flex-row items-center justify-between border-t border-zinc-800 pt-6">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:opacity-90 transition shadow-lg shadow-red-600/30"
                            onClick={() => dispatch(resetCart())}
                        >
                            Clear Cart
                        </motion.button>

                        <motion.span
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="text-2xl font-bold text-green-400 my-4 md:my-0"
                        >
                            Total: ${totalPrice.toFixed(2)}
                        </motion.span>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:opacity-90 transition shadow-lg shadow-green-600/30"
                            onClick={() => navigate("/checkout")}
                        >
                            Proceed to Checkout
                        </motion.button>
                    </div>
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[80vh] relative">
                    {/* Empty cart visual */}
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-600/30 to-blue-600/30 border-2 border-dashed border-orange-400/40 shadow-lg shadow-blue-500/10 mb-5 animate-pulse">
                        <svg
                            className="w-10 h-10 text-orange-400 opacity-80"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M6 6h15l-1.5 9H8.5L7 6zm0 0L5 4H2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="9" cy="19" r="1.5" />
                            <circle cx="18" cy="19" r="1.5" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-tr from-orange-400 via-red-500 to-amber-500 bg-clip-text text-transparent mb-2 text-center">
                        Your Cart Is Empty
                    </h2>
                    <p className="text-zinc-300 text-lg text-center mb-6">
                        Add some awesome items to your cart to see them here.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md hover:opacity-90 transition"
                    >
                        Browse Marketplace
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;
