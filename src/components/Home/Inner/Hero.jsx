import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Zap, Star, Trophy } from 'lucide-react';
import useUserData from '../../../constants/data/useUserData';

const Hero = () => {
    const heroRef = useRef();
    const titleRef = useRef();
    const subtitleRef = useRef();
    const ctaRef = useRef();
    const floatingRef = useRef();

    const { owner, phone, premium, age, role, username, firstName, surName, subRoles } = useUserData();

    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.5 });

        tl.fromTo(titleRef.current.children,
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.1,
                ease: "power3.out"
            }
        )
            .fromTo(subtitleRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out"
                }, "-=0.8"
            )
            .fromTo(ctaRef.current.children,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out"
                }, "-=0.6");

        gsap.to(gsap.utils.toArray(floatingRef.current.children), {
            y: -10,
            duration: 3,
            ease: "power2.inOut",
            stagger: 0.2,
            repeat: -1,
            yoyo: true,
        });


        // Background gradient animation
        // Background gradient animation
        gsap.to('.gradient-bg', {
            background: 'linear-gradient(45deg, #F97316, #2654a0, #0F0F23)',
            duration: 4,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true
        });
    }, []);

    return (
        <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="gradient-bg absolute inset-0 bg-gradient-to-br from-orange-500/20 via-blue-500/20 to-black"></div>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
                <div ref={floatingRef} className="flex justify-center space-x-8 mb-8">
                    <div className="p-4 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full border border-orange-500/20">
                        <Zap className="w-8 h-8 text-orange-500" />
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full border border-blue-500/20">
                        <Star className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full border border-yellow-500/20">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>

                <h1 ref={titleRef} className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                    <span className="block bg-gradient-to-r from-orange-500 via-blue-500 to-white bg-clip-text text-transparent">Next-Gen</span>
                    <span className="block text-white">Projects</span>
                    <span className="block bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">Await</span>
                </h1>

                <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    Transforming ideas into reality with cutting-edge technology and innovative design.
                    Your vision, our expertise, limitless possibilities.
                </p>

                <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:cursor-pointer text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 flex items-center space-x-2">
                        <span>Get Started</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                    <button className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:cursor-pointer px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                        Learn More
                    </button>
                    {owner && (
                        <>
                            <button
                                onClick={() => {
                                    window.location.href = '/Dashboard1';
                                }}
                                className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white hover:cursor-pointer px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                            >
                                Ownership Dashboard
                            </button>
                        </>
                    )}
                    {role === 'admin' && !owner && (
                        <>
                            <button
                                onClick={() => {
                                    window.location.href = '/adminDashboard';
                                }}
                                className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:cursor-pointer px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                            >
                                Admin Dashboard
                            </button>
                        </>
                    )}
                    {role === 'moderator' && !owner && (
                        <>
                            <button
                                onClick={() => {
                                    window.location.href = '/management';
                                }}
                                className="border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white hover:cursor-pointer px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                            >
                                Mod Dashboard
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;