import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Maintenance = () => {
    const modalRef = useRef();
    useEffect(() => {
        document.body.style.background = "#000";
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.background = "";
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        gsap.fromTo(
            modalRef.current,
            { scale: 0.85, opacity: 0, y: 60 },
            {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
            }
        );

        // animated background
        gsap.to(".maintenance-bg", {
            background: "linear-gradient(45deg, #F97316, #2654a0, #0F0F23)",
            duration: 5,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
        });
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">

            {/* 🔥 BACKGROUND */}
            <div className="maintenance-bg absolute inset-0 bg-gradient-to-br from-black via-orange-500/20 to-black"></div>

            {/* glow effects */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>

            {/* 🔥 BIG MODAL */}
            <div
                ref={modalRef}
                className="relative z-10 bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-2xl w-full text-center shadow-2xl"
            >
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-blue-500 to-white bg-clip-text text-transparent">
                    Maintenance Mode
                </h1>

                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    Nextrix is currently undergoing critical security upgrades and infrastructure improvements.
                    <br />
                    All user accounts, authentication systems, and services are temporarily unavailable.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6 text-lg text-gray-200">
                    ⏳ Expected downtime:{" "}
                    <span className="text-orange-400 font-semibold">
                        1/5/2026
                    </span>
                </div>

                <p className="text-gray-400 text-sm">
                    We’re working to bring the platform back stronger, faster, and more secure.
                    <br />
                    Thank you for your patience.
                </p>
            </div>
        </div>
    );
};

export default Maintenance;
