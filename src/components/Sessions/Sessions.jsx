import React, { useEffect, useRef } from "react";
import {
    Store,
    BookOpen,
    UserCheck,
    LayoutTemplate
} from "lucide-react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetAllCoursesQuery } from "../../../constants/Redux/items/fetchCourses";

// Helper for mapping icon string to component
const ICONS = {
    BookOpen,
    UserCheck,
    LayoutTemplate,
    Store
};

const Loading = () => (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-500/10 to-black" />
        <div className="relative z-10 text-center px-6 max-w-4xl w-full flex flex-col items-center">
            <span className="text-xl text-white animate-pulse">Loading items...</span>
        </div>
    </section>
);

const Error = () => (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-500/10 to-black" />
        <div className="relative z-10 text-center px-6 max-w-4xl w-full flex flex-col items-center">
            <span className="text-xl text-red-400">Failed to load items 😢</span>
        </div>
    </section>
);

const Sessions = () => {
    const titleRef = useRef();
    const subtitleRef = useRef();
    const cardsContainerRef = useRef();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { data: courses = [], isLoading, isError } = useGetAllCoursesQuery();

    useEffect(() => {
        // Animate title
        if (titleRef.current) {
            gsap.fromTo(
                titleRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
            );
        }
        // Animate subtitle
        if (subtitleRef.current) {
            gsap.fromTo(
                subtitleRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" }
            );
        }
        // Animate marketplace cards with a stagger
        if (cardsContainerRef.current && cardsContainerRef.current.children.length > 0) {
            gsap.fromTo(
                cardsContainerRef.current.children,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.5,
                    ease: "power2.out",
                    stagger: 0.2
                }
            );
        }
    }, [courses]);

    if (isLoading) return <Loading />;
    if (isError) return <Error />;

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
                    className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-400 via-lime-500 to-yellow-300 bg-clip-text text-transparent mb-4"
                >
                    Select A Course
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
                    {courses.map((item) => {
                        // If your items coming from Firestore have an "icon" field as a string, map it to a real component.
                        const IconComponent =
                            typeof item.icon === "string"
                                ? ICONS[item.icon] || Store
                                : item.icon || Store;

                        return (
                            <div
                                key={item.id || item.title}
                                onClick={() => navigate(item.path)}
                                className="p-8 rounded-lg border border-gray-700/50 bg-black/40 backdrop-blur-lg shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:border-blue-500/70 hover:shadow-blue-500/10"
                            >
                                <IconComponent className="w-10 h-10 text-blue-400 mb-4 mx-auto" />
                                <h3 className="text-2xl font-semibold text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400">{item.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Sessions;