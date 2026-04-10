import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Wrench, Clock } from "lucide-react";

const Maintenance = () => {
    const containerRef = useRef();
    const contentRef = useRef();

    useEffect(() => {
        gsap.fromTo(
            contentRef.current.children,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
            }
        );

        gsap.to(".gradient-bg", {
            background: "linear-gradient(45deg, #F97316, #2654a0, #0F0F23)",
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
        });
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        >
            {/* Background */}
            <div className="gradient-bg absolute inset-0 bg-gradient-to-br from-black via-orange-500/20 to-black"></div>

            {/* Glow effects */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>

            {/* Content */}
            <div
                ref={contentRef}
                className="relative z-10 text-center px-6 max-w-2xl"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-5 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full border border-orange-500/20">
                        <Wrench className="w-10 h-10 text-orange-500" />
                    </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
                    Under Maintenance
                </h1>

                <p className="text-gray-300 text-lg mb-6">
                    We're currently performing security upgrades and improvements.
                    The platform will be back stronger and safer.
                </p>

                <div className="flex justify-center items-center gap-2 text-orange-400">
                    <Clock className="w-5 h-5" />
                    <span>Expected downtime: 3 days</span>
                </div>

                <p className="text-gray-500 mt-6 text-sm">
                    Thank you for your patience ❤️
                </p>
            </div>
        </div>
    );
};

export default Maintenance;