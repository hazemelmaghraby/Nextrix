import React, { useEffect, useRef } from "react";
import {
    Store,
    BookOpen,
    UserCheck,
    LayoutTemplate
} from "lucide-react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

// --- Data for the marketplace items ---
const marketItems = [
    {
        title: "Books",
        description: "Curated e-books and helpful guides.",
        icon: BookOpen,
        path: "/marketplace/books",
    },
    {
        title: "Session Codes",
        description: "1-on-1 coaching & consultations.",
        icon: UserCheck,
        path: "/marketplace/sessionCodes",
    },
    {
        title: "Templates",
        description: "Project starters and UI kits.",
        icon: LayoutTemplate,
        path: "/marketplace/templates",
    },
];

// --- Marketplace Component ---
const Marketplace = () => {
    const titleRef = useRef();
    const subtitleRef = useRef();
    const cardsContainerRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        // Animate title
        gsap.fromTo(
            titleRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        );

        // Animate subtitle
        gsap.fromTo(
            subtitleRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" }
        );

        // Animate marketplace cards with a stagger
        gsap.fromTo(
            cardsContainerRef.current.children,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.5,
                ease: "power2.out",
                stagger: 0.2, // Animates each card one after another
            }
        );
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-500/10 to-black" />

            {/* Glow effects */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl w-full">
                <div className="inline-flex items-center justify-center p-6 rounded-full border border-blue-500/30 bg-black/40 backdrop-blur-lg shadow-lg mb-6">
                    <Store className="w-12 h-12 text-blue-400" />
                </div>
                <h1
                    ref={titleRef}
                    className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-white bg-clip-text text-transparent mb-4"
                >
                    Marketplace
                </h1>
                <p
                    ref={subtitleRef}
                    className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12"
                >
                    Explore our curated collection of digital goods and services.
                </p>

                {/* Marketplace Items Grid */}
                <div
                    ref={cardsContainerRef}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {marketItems.map((item) => (
                        <div
                            key={item.title}
                            onClick={() => navigate(item.path)}
                            className="p-8 rounded-lg border border-gray-700/50 bg-black/40 backdrop-blur-lg shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:border-blue-500/70 hover:shadow-blue-500/10"
                        >
                            <item.icon className="w-10 h-10 text-blue-400 mb-4 mx-auto" />
                            <h3 className="text-2xl font-semibold text-white mb-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-400">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Marketplace;