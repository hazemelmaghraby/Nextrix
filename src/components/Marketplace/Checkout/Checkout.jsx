import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useUserData from "../../../constants/data/useUserData";
import NotSignedIn from "../../../constants/components/NotSignedIn";
import Loading from "../../../constants/components/Loading";

const Checkout = () => {
    const items = useSelector((state) => state.itemsReducer.items);
    const navigate = useNavigate();
    const { username, user, firstName, surName, uid, loading } = useUserData();

    // Always check loading FIRST, before anything else


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
    });

    if (loading) {
        return <Loading />;
    }

    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePayment = (e) => {
        e.preventDefault();
        alert("✅ Payment processed successfully!");
        navigate("/");
    };

    if (!user) {
        return (
            <NotSignedIn>
                You must be signed in to add something to your cart and proceed to checkout.
            </NotSignedIn>
        );
    }

    if (items.length === 0 && user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">
                <h2 className="text-4xl font-bold text-orange-400 mb-4">
                    Your Cart Is Empty
                </h2>
                <button
                    onClick={() => navigate("/cart")}
                    className="px-6 py-2 rounded bg-orange-500 hover:bg-orange-600 transition font-semibold"
                >
                    Back to Cart
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white py-16 px-6 flex items-center justify-center relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-900/70 backdrop-blur-xl p-10 rounded-2xl border border-zinc-800 shadow-lg shadow-orange-500/5"
            >
                {/* LEFT SIDE — RECEIPT */}
                <div>
                    <h2 className="text-3xl font-bold mb-6 text-orange-400">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex justify-between border-b border-zinc-800 pb-3"
                            >
                                <div>
                                    <p className="font-semibold text-white">{item.title}</p>
                                    <p className="text-sm text-zinc-400">
                                        Qty: {item.quantity} × ${item.price}
                                    </p>
                                </div>
                                <p className="font-bold text-green-400">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-between text-xl font-bold border-t border-zinc-800 pt-4">
                        <span>Total:</span>
                        <span className="text-green-400">${totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                {/* RIGHT SIDE — PAYMENT FORM */}
                <motion.form
                    onSubmit={handlePayment}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-5"
                >
                    <h2 className="text-3xl font-bold mb-6 text-blue-400">
                        Payment Details
                    </h2>

                    <div>
                        <label className="block text-zinc-400 text-sm mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={`${firstName} ${surName}`}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full p-3 bg-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-sm mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="you@example.com"
                            className="w-full p-3 bg-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-sm mb-1">Card Number</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            required
                            maxLength={16}
                            placeholder="1234 5678 9012 3456"
                            className="w-full p-3 bg-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-zinc-400 text-sm mb-1">Expiry</label>
                            <input
                                type="text"
                                name="expiry"
                                value={formData.expiry}
                                onChange={handleInputChange}
                                required
                                placeholder="MM/YY"
                                className="w-full p-3 bg-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-zinc-400 text-sm mb-1">CVC</label>
                            <input
                                type="text"
                                name="cvc"
                                value={formData.cvc}
                                onChange={handleInputChange}
                                required
                                maxLength={3}
                                placeholder="123"
                                className="w-full p-3 bg-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-lg mt-6 hover:opacity-90 transition shadow-lg shadow-blue-600/30"
                    >
                        Pay ${totalPrice.toFixed(2)}
                    </motion.button>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default Checkout;
