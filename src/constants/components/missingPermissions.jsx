import React, { useEffect, useRef } from 'react'
import { AlertTriangle } from "lucide-react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";


const MissingPermissions = ({ children }) => {
    const titleRef = useRef();
    const subtitleRef = useRef();

    useEffect(() => {
        gsap.fromTo(
            titleRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        );

        gsap.fromTo(
            subtitleRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" }
        );
    }, []);

    const navigate = useNavigate();
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-red-500/10 to-black" />

            {/* Glow effects */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-3xl">
                <div className="inline-flex items-center justify-center p-6 rounded-full border border-red-500/30 bg-black/40 backdrop-blur-lg shadow-lg mb-6">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <h1
                    ref={titleRef}
                    className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-white bg-clip-text text-transparent mb-4"
                >
                    Not Authorized
                </h1>
                <p
                    ref={subtitleRef}
                    className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
                >
                    {children}
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
                >
                    Go Back Home
                </button>
            </div>
        </section>
    )
}

export default MissingPermissions;