import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../constants/firebase';
import { LogIn } from "lucide-react";
import { useNavigate } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("success"); // "success" or "error"
    const navigate = useNavigate();

    document.title = 'Login';

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch Firestore user document
            const userData = await getDoc(doc(db, "users", user.uid));
            // console.log(userData.data());
            setMessage("Logged In Successfully");
            setMessageType("success");
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } catch (error) {
            setMessage("Login failed. Please check your credentials.");
            setMessageType("error");
            console.error("Login error:", error);
        }
    };

    return (
        <section className="regContainer min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
            <div className="regCard w-full max-w-md bg-transparent backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex justify-center items-center mb-3">
                        <LogIn className="w-10 h-10 text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-gray-400">Login to continue your journey</p>
                </div>

                {/* Message */}
                {message && (
                    <div
                        className={`mb-4 px-4 py-3 rounded ${messageType === "success"
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                            }`}
                    >
                        {message}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5 bg-transparent">
                    {/* Email */}
                    <div>
                        <label className="block text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 outline-none transition"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 outline-none transition"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="hover:cursor-pointer w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
                    >
                        Login
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-6 text-center text-gray-400">
                    Don’t have an account?{" "}
                    <a
                        href="/accountType"
                        className="text-orange-500 hover:underline"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </section>
    );
};

export default Login;