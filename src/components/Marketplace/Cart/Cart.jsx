import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { increment, decrement, removeItem, resetCart } from '../../../constants/Redux/items/itemsSlice';

const Cart = () => {
    const items = useSelector(state => state.itemsReducer.items)
    const dispatch = useDispatch();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-center">Cart</h1>
            {items.length > 0 ? (
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-zinc-900 rounded-lg shadow-lg p-6">
                        <table className="min-w-full">
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
                                {items.map(item => (
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
                                        <td className="py-4 px-4 text-center text-green-400 font-semibold">${item.price}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => dispatch(decrement(item.id))}
                                                    className="px-2 py-1 rounded bg-zinc-800 text-orange-400 border border-zinc-700 hover:bg-zinc-700 transition disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                                <span className="min-w-[2.5rem] text-center bg-zinc-700 px-2 py-1 rounded text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => dispatch(increment(item.id))}
                                                    className="px-2 py-1 rounded bg-zinc-800 text-green-400 border border-zinc-700 hover:bg-zinc-700 transition"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center text-white font-semibold">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <button
                                                className="text-red-400 hover:underline text-sm"
                                                // Implement a remove action as needed
                                                onClick={() => dispatch(removeItem(item.id))}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                        <tr>
                                            <td colSpan="6" className="pt-4 pb-2 text-right">
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                                                    onClick={() => dispatch(resetCart())}
                                                >
                                                    Clear Cart
                                                </button>
                                            </td>
                                        </tr>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                        <div className="mt-6 flex justify-end">
                            <span className="text-2xl font-bold text-white">
                                Total:&nbsp;$
                                {items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No items in cart</p>
            )
            }
        </div>
    );
};

export default Cart;