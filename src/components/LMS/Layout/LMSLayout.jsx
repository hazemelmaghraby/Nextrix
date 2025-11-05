import React, { useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LMSNavbar from "../Navigation/LMSNavigationBar";
import LMSFooter from "../Footer/LMSFooter";

gsap.registerPlugin(ScrollTrigger);

const LMSLayout = () => {
    const pageRef = useRef();

    useEffect(() => {
        gsap.fromTo(
            pageRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: "power2.out" }
        );
    }, []);

    return (
        <div
            ref={pageRef}
            className="relative min-h-screen bg-gradient-to-br from-black via-blue-950 to-zinc-950 text-white overflow-x-hidden"
        >
            {/* LMS-specific navbar */}
            <LMSNavbar />

            {/* Page content */}
            <main className="pt-20">
                <Outlet />
            </main>

            {/* LMS-specific footer */}
            <LMSFooter />
        </div>
    );
};

export default LMSLayout;
