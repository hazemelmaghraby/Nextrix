import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Users, Lightbulb, Rocket } from 'lucide-react';

const About = () => {
    const sectionRef = useRef();
    const cardsRef = useRef();

    useEffect(() => {
        gsap.fromTo(sectionRef.current.querySelector('.about-title'),
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        gsap.fromTo(cardsRef.current.children,
            { y: 80, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: cardsRef.current,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }, []);

    const values = [
        {
            icon: Target,
            title: "Precision",
            description: "Every detail matters. We deliver pixel-perfect solutions with uncompromising accuracy."
        },
        {
            icon: Users,
            title: "Collaboration",
            description: "Your success is our mission. We work hand-in-hand to bring your vision to life."
        },
        {
            icon: Lightbulb,
            title: "Innovation",
            description: "Pushing boundaries with cutting-edge technology and creative problem-solving."
        },
        {
            icon: Rocket,
            title: "Performance",
            description: "Lightning-fast, scalable solutions that grow with your business needs."
        }
    ];

    return (
        <section id="about" ref={sectionRef} className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="about-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                            About Nextrix
                        </span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        We're a team of passionate developers, designers, and innovators dedicated to
                        creating exceptional digital experiences that drive real business results.
                    </p>
                </div>

                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <div
                                key={index}
                                className="group p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10"
                            >
                                <div className="mb-6 p-3 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                                    <Icon className="w-8 h-8 text-orange-500 group-hover:text-blue-500 transition-colors duration-300" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-orange-500 transition-colors duration-300">
                                    {value.title}
                                </h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                    {value.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-20 text-center">
                    <div className="inline-block p-8 bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-orange-500/10 rounded-2xl border border-gradient-to-r border-orange-500/20">
                        <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                            <span className="text-orange-500">500+</span> Projects Delivered
                        </p>
                        <p className="text-lg text-gray-300">
                            Trusted by startups and enterprises worldwide
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;