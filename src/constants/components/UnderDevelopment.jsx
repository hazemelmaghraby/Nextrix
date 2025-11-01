import React, { useEffect, useRef } from "react";
import { Wrench } from "lucide-react";
import { gsap } from "gsap";

const UnderDevelopment = () => {
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

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-orange-500/10 to-black" />

            {/* Glow effects */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-3xl">
                <div className="inline-flex items-center justify-center p-6 rounded-full border border-orange-500/30 bg-black/40 backdrop-blur-lg shadow-lg mb-6">
                    <Wrench className="w-12 h-12 text-orange-500 animate-spin-slow" />
                </div>
                <h1
                    ref={titleRef}
                    className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-white bg-clip-text text-transparent mb-4"
                >
                    Page Under Development
                </h1>
                <p
                    ref={subtitleRef}
                    className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
                >
                    🚧 This section is still under construction. We’re working hard to bring it to life. Stay tuned!
                </p>
            </div>
        </section>
    );
};

export default UnderDevelopment;