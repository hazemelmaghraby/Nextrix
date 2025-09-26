import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Loading = () => {
    const loaderRef = useRef();

    useEffect(() => {
        gsap.fromTo(
            loaderRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: "power3.out" }
        );
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-blue-500/20 to-black"></div>

            {/* Glow elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div
                className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
            ></div>

            {/* Loader box */}
            <div
                ref={loaderRef}
                className="relative z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-10"
            >
                {/* Spinner */}
                <div className="w-16 h-16 border-4 border-transparent border-t-orange-500 border-r-blue-500 rounded-full animate-spin"></div>

                {/* Text */}
                <p className="mt-6 text-lg font-semibold bg-gradient-to-r from-orange-500 via-blue-500 to-white bg-clip-text text-transparent">
                    Loading...
                </p>
            </div>
        </section>
    );
};

export default Loading;
