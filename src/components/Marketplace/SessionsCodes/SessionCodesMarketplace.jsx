import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../../constants/Redux/items/itemsSlice';
import { auth, db } from '../../../constants/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useGetAllSessionCodesQuery } from '../../../constants/Redux/items/fetchSessionCodes';
import { toast } from 'react-toastify';


const SessionCodesMarketplace = () => {
    const dispatch = useDispatch();
    const { data: items = [], isLoading, isError } = useGetAllSessionCodesQuery(); // ✅ fetch from Firestore via RTK Query

    if (isLoading) return <p className="text-white">Loading items...</p>;
    if (isError) return <p className="text-red-400">Failed to load items 😢</p>;

    const handleAddToCart = (item) => {
        dispatch(addToCart(item));
        toast.success(`${item.title || "Item"} added to cart!`);
    };


    return (
        <div className="relative min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 py-16 mt-5">
            {/* Page Title, Subtitle, and Hero */}
            <div className="flex flex-col items-center justify-center mb-16">
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-blue-400 to-white bg-clip-text text-transparent mb-4">
                    Marketplace
                </h1>
                <p className="text-lg md:text-xl text-zinc-200 max-w-2xl mb-8 text-center">
                    Discover a curated selection of products and resources. Browse, learn more, and add items directly to your cart!
                </p>
                <div className="flex items-center justify-center gap-2">
                    <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">🔥 New deals</span>
                    <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">Secure checkout</span>
                </div>
            </div>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {items.map(item => (
                        <div
                            key={item.id}
                            className="relative bg-black/60 border border-zinc-700 rounded-2xl shadow-lg p-6 flex flex-col items-stretch hover:scale-[1.03] hover:shadow-2xl transition-all duration-200 group overflow-hidden"
                        >
                            {/* Badges */}
                            <div className="absolute top-4 left-4 z-10">
                                {item.category && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-700/40 text-blue-100 mr-2">
                                        {item.category}
                                    </span>
                                )}
                                {item.inStock === false && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-red-600/70 text-white">
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                            <div className="w-32 h-32 bg-zinc-800 rounded-xl mb-6 mx-auto flex items-center justify-center border-2 border-zinc-700 shadow group-hover:shadow-lg transition">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="object-cover w-full h-full rounded-xl transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <span className="text-zinc-400 text-5xl font-bold">
                                        {item.title?.substring(0, 1) || "?"}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-center bg-gradient-to-tr from-orange-400/80 via-blue-400 to-white bg-clip-text text-transparent">
                                {item.title}
                            </h3>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                {item.tagline && (
                                    <span className="text-xs text-orange-300 bg-orange-500/10 px-2 py-1 rounded-full">
                                        {item.tagline}
                                    </span>
                                )}
                            </div>
                            {item.desc && (
                                <p className="text-zinc-300 text-center mb-4 text-sm leading-relaxed line-clamp-3">
                                    {item.desc}
                                </p>
                            )}
                            <div className="flex items-center justify-center gap-4 mt-auto mb-4">
                                {item.rating && (
                                    <span className="flex items-center text-yellow-400 text-sm">
                                        ★ {Number(item.rating).toFixed(1)}
                                    </span>
                                )}
                                {item.seller && (
                                    <span className="text-xs border px-2 py-0.5 rounded text-zinc-300 border-zinc-600">
                                        {item.seller}
                                    </span>
                                )}
                            </div>
                            {item.price && (
                                <div className="mb-3 text-center">
                                    <span className="text-green-400 font-extrabold text-2xl">${item.price}</span>
                                    <span className="ml-2 text-zinc-400 text-xs font-medium">{item.unit || ""}</span>
                                </div>
                            )}

                            {/* Button Bar */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                                {/* More Details (ideally would link to a single product page) */}
                                <button
                                    className="flex-1 bg-zinc-800 hover:bg-zinc-900 text-zinc-100 px-4 py-2 rounded font-semibold border border-zinc-700 hover:border-blue-400 transition-colors"
                                    onClick={() => {
                                        // Could be a Link with productId or open a modal.
                                        toast.info(
                                            <div>
                                                <p className="font-bold">{item.title}</p>
                                                <p>{item.desc || "No additional details."}</p>
                                            </div>,
                                            { autoClose: 3000 }
                                        );
                                    }}
                                >
                                    More Details
                                </button>
                                <button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold border border-blue-700 transition-colors shadow"
                                    disabled={item.inStock === false}
                                    onClick={() => handleAddToCart(item)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SessionCodesMarketplace;