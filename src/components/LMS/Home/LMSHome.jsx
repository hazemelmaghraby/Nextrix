import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut", delay },
    }),
};

const LMSHome = () => {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-black via-blue-950 to-zinc-950 py-28 overflow-hidden">
            {/* Glow effects */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600/50 rounded-full blur-3xl animate-pulse z-0" />
            <div className="absolute bottom-20 right-10 w-[30rem] h-[30rem] bg-cyan-400/20 rounded-full blur-3xl animate-pulse z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,100,255,0.08),transparent_60%)] pointer-events-none" />

            {/* Hero Section */}
            <motion.section
                initial="hidden"
                animate="show"
                className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24"
            >
                {/* Floating gradient glow behind title */}
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    <div className="w-80 h-80 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
                </div>

                {/* Tagline */}
                <motion.span
                    variants={fadeUp}
                    className="bg-gradient-to-r from-blue-600/30 to-cyan-500/30 text-white/90 text-sm uppercase tracking-[0.2em] font-medium px-6 py-1 rounded-full mb-6 border border-blue-400/40 shadow-lg backdrop-blur-sm"
                >
                    Nextrix LMS
                </motion.span>

                {/* Headline */}
                <motion.h1
                    variants={fadeUp}
                    custom={0.2}
                    className="text-4xl md:text-6xl font-extrabold leading-tight mb-4"
                >
                    <span className="block text-zinc-100 mb-2 text-lg md:text-2xl font-light tracking-wide">
                        Welcome to
                    </span>
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-white bg-clip-text text-transparent drop-shadow-lg">
                        Nextrix Learning System
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={fadeUp}
                    custom={0.4}
                    className="max-w-2xl text-base md:text-lg text-zinc-300 mb-10 mt-2 leading-relaxed"
                >
                    Your personalized hub for courses, interactive sessions, and continuous learning.
                    Explore trending courses, join real-time sessions, and track your journey — all in one place.
                </motion.p>

                {/* Highlight badges */}
                <motion.div
                    variants={fadeUp}
                    custom={0.6}
                    className="flex flex-wrap gap-3 justify-center mb-10"
                >
                    <span className="bg-cyan-600/80 text-white px-4 py-1.5 rounded-full text-xs shadow border border-cyan-400/40">
                        📚 Quality Courses
                    </span>
                    <span className="bg-blue-900/70 text-blue-100 px-4 py-1.5 rounded-full text-xs shadow border border-blue-400/20">
                        🕒 Live Sessions
                    </span>
                    <span className="bg-sky-400/10 text-sky-200 px-4 py-1.5 rounded-full text-xs border border-sky-400/20">
                        📈 Progress Tracking
                    </span>
                </motion.div>

                {/* CTA button */}
                <motion.a
                    href="/lms/courses"
                    variants={fadeUp}
                    custom={0.8}
                    whileHover={{
                        scale: 1.06,
                        boxShadow: "0 0 20px rgba(56, 189, 248, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block px-10 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl text-lg shadow-md transition-all duration-300"
                >
                    Explore Courses
                </motion.a>
            </motion.section>


            {/* Features Section */}
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="z-10 container mx-auto flex flex-col md:flex-row gap-8 justify-center items-stretch mt-20 px-6"
            >
                {[
                    {
                        title: "Browse Trending Courses",
                        desc: "Hand-picked courses across subjects and career tracks. Find the right skill, taught by industry leaders.",
                        icon: (
                            <path
                                d="M15.75 13.5V6.75A2.25 2.25 0 0 0 13.5 4.5h-6A2.25 2.25 0 0 0 5.25 6.75V17.25A2.25 2.25 0 0 0 7.5 19.5H15.75A2.25 2.25 0 0 0 18 17.25V14.25"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        ),
                        color: "text-cyan-400",
                    },
                    {
                        title: "Interactive Real-Time Sessions",
                        desc: "Join live sessions with mentors and fellow learners. Ask, discuss, and get feedback instantly.",
                        icon: (
                            <>
                                <circle cx="12" cy="12" r="10" />
                                <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06" />
                            </>
                        ),
                        color: "text-blue-400",
                    },
                    {
                        title: "Track Your Progress",
                        desc: "Monitor your learning achievements and milestones. Resume where you left off, every time.",
                        icon: (
                            <>
                                <rect x="3" y="3" width="18" height="18" rx="3" />
                                <path d="M3 9h18M9 21V9M15 21V9" />
                            </>
                        ),
                        color: "text-sky-400",
                    },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        variants={fadeUp}
                        custom={i * 0.3}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 30px rgba(56, 189, 248, 0.2)",
                            rotateY: 2,
                        }}
                        className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-blue-950/70 shadow-lg p-8 flex-1 flex flex-col items-center transition-transform duration-300"
                    >
                        <svg
                            className={`w-12 h-12 mb-4 ${card.color}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            {card.icon}
                        </svg>
                        <h3 className="text-xl font-bold text-cyan-300 mb-2 text-center">
                            {card.title}
                        </h3>
                        <p className="text-zinc-300 text-center mb-4">{card.desc}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* CTA Footer */}
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0.2}
                className="mt-24 text-center z-10 relative"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Ready to Start Your Learning Journey?
                </h2>
                <p className="text-zinc-300 mb-6">
                    Unlock access to premium content, certifications, and community discussions.
                </p>
                <a
                    href="/lms/register"
                    className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200"
                >
                    Get Started
                </a>
            </motion.div>

            <div className="my-20" />
        </div>
    );
};

export default LMSHome;
