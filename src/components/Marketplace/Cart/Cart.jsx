import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement, removeItem, resetCart, loadCart } from '../../../constants/Redux/items/itemsSlice';
import { loadCartFromFirestore } from '../../../constants/Redux/items/itemsSlice';
import { auth } from '../../../constants/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Cart = () => {
    const dispatch = useDispatch();
    // ✅ Read cart items from Redux state, not from RTK Query
    const items = useSelector(state => state.itemsReducer.items);

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

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-center]">Cart</h1>
            {items.length > 0 ? (
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-zinc-900 rounded-lg shadow-lg p-6">
                        <table className="min-w-full h-[100vh">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-left text-zinc-400">Product</th>
                                    <th className="py-3 px-4 text-left text-zinc-400">Description</th>
                                    <th className="py-3 px-4 text-center text-zinc-400">Price</th>
                                    <th className="py-3 px-4 text-center text-zinc-400">Quantity</th>
                                    <th className="py-3 px-4 text-center text-zinc-400">Total</th>
                                    <th className="py-3 px-4 text-center text-zinc-400"></th>
                                </tr>
                            </thead>

                            <tbody>
                                {items?.map(item => {
                                    const price = Number(item.price) || 0;
                                    const quantity = Number(item.quantity) || 1;

                                    return (
                                        <tr key={item.id} className="border-b border-zinc-800 hover:bg-zinc-800/60 transition">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded-md bg-zinc-800 object-cover" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-400 text-2xl font-bold">
                                                            {item.title?.substring(0, 1)}
                                                        </div>
                                                    )}
                                                    <span className="font-bold text-white">{item.title}</span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 text-zinc-300 max-w-xs truncate">{item.desc}</td>
                                            <td className="py-4 px-4 text-center text-green-400 font-semibold">${price}</td>

                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => dispatch(decrement(item.id))}
                                                        className="px-2 py-1 rounded bg-zinc-800 text-orange-400 border border-zinc-700 hover:bg-zinc-700 transition disabled:opacity-50"
                                                        disabled={quantity <= 1}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="min-w-[2.5rem] text-center bg-zinc-700 px-2 py-1 rounded text-white">{quantity}</span>
                                                    <button
                                                        onClick={() => dispatch(increment(item.id))}
                                                        className="px-2 py-1 rounded bg-zinc-800 text-green-400 border border-zinc-700 hover:bg-zinc-700 transition"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 text-center text-white font-semibold">
                                                ${(price * quantity).toFixed(2)}
                                            </td>

                                            <td className="py-4 px-4 text-center">
                                                <button
                                                    className="text-red-400 hover:underline text-sm"
                                                    onClick={() => dispatch(removeItem(item.id))}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>

                        <div className="mt-6 flex justify-end">
                            <button
                                className="m-auto px-6 py-2 rounded bg-red-600 hover:cursor-pointer text-white font-semibold hover:bg-red-700 transition-colors shadow ring-1 ring-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-400/70"
                                onClick={() => dispatch(resetCart())}
                            >
                                Clear Cart
                            </button>
                            <span className="text-2xl font-bold text-white m-auto">
                                Total:&nbsp;$
                                {items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[100vh]">
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-orange-500/10 to-black" />

                    {/* Glow effects */}
                    <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-600/30 to-blue-600/30 border-2 border-dashed border-orange-400/30 shadow-lg shadow-blue-500/10 mb-5 animate-pulse">
                        <svg className="w-10 h-10 text-orange-400 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M6 6h15l-1.5 9H8.5L7 6zm0 0L5 4H2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="9" cy="19" r="1.5" />
                            <circle cx="18" cy="19" r="1.5" />
                        </svg>

                        <span className="absolute -top-2 -right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-xl border border-orange-500/40">0</span>
                    </div>
                    <span className="text-xs rounded-full px-3 py-1 bg-orange-500/10 border border-orange-400/20 text-orange-300 animate-pulse">
                        Cart Empty
                    </span>
                    <h2 className="text-4xl font-bold bg-gradient-to-tr from-orange-400/50 via-red-500/90 to-amber-500/900 bg-clip-text text-transparent mb-2 text-center">
                        Your Cart Is Empty
                    </h2>
                    <p className="text-zinc-100 text-2xl text-center mb-1">
                        You have no items in your cart yet.
                    </p>
                    <p className="text-zinc-200 text-md text-center mb-4 max-w-md">
                        Browse our marketplace and add products to your cart. Your items will show up here!
                    </p>
                </div>
            )}
        </div>
    );
};

export default Cart;
