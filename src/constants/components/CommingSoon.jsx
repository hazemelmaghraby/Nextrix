import React, { useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
    const titleRef = useRef();
    const subtitleRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo(
            titleRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
        );

        gsap.fromTo(
            subtitleRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.4, ease: "power2.out" }
        );
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-500/10 to-black" />

            {/* Glow effects */}
            <div className="absolute top-24 left-24 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-24 right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-3xl">
                <div className="inline-flex items-center justify-center p-6 rounded-full border border-orange-500/30 bg-black/40 backdrop-blur-lg shadow-lg mb-6">
                    <Clock className="w-12 h-12 text-orange-400" />
                </div>
                <h1
                    ref={titleRef}
                    className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-500 via-yellow-400 to-white bg-clip-text text-transparent mb-4 pb-3"
                >
                    Coming Soon
                </h1>
                <p
                    ref={subtitleRef}
                    className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
                >
                    We’re working hard on something amazing.
                    Stay tuned for exciting updates and exclusive features!
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:cursor-pointer hover:to-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={() => navigate("/emailSubscription")}
                        className="bg-gradient-to-r from-purple-500 to-blue-600 hover:cursor-pointer hover:from-purple-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                        Notify Me
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ComingSoon;
