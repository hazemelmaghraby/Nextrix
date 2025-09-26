import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Smartphone, Globe, Zap, Database, Shield } from 'lucide-react';

const Services = () => {
    const sectionRef = useRef();
    const servicesRef = useRef();

    useEffect(() => {
        gsap.fromTo(sectionRef.current.querySelector('.services-title'),
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

        gsap.fromTo(servicesRef.current.children,
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: servicesRef.current,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }, []);

    const services = [
        {
            icon: Code,
            title: "Web Development",
            description: "Modern, responsive websites built with the latest technologies and best practices.",
            gradient: "from-orange-500 to-red-500"
        },
        {
            icon: Smartphone,
            title: "Mobile Apps",
            description: "Native and cross-platform mobile applications for iOS and Android.",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: Globe,
            title: "E-Commerce",
            description: "Scalable online stores with secure payment processing and inventory management.",
            gradient: "from-orange-500 to-yellow-500"
        },
        {
            icon: Zap,
            title: "Performance Optimization",
            description: "Lightning-fast loading times and optimal user experience across all devices.",
            gradient: "from-blue-500 to-purple-500"
        },
        {
            icon: Database,
            title: "Backend Development",
            description: "Robust server-side solutions with scalable databases and APIs.",
            gradient: "from-orange-500 to-pink-500"
        },
        {
            icon: Shield,
            title: "Security Solutions",
            description: "Comprehensive security implementation to protect your digital assets.",
            gradient: "from-blue-500 to-indigo-500"
        }
    ];

    return (
        <section id="services" ref={sectionRef} className="py-20 bg-black">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="services-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                        Our <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">Services</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Comprehensive digital solutions tailored to your business needs and goals.
                    </p>
                </div>

                <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={index}
                                className="group relative p-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700/50 hover:border-orange-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                            >
                                {/* Background gradient on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                <div className="relative z-10">
                                    <div className={`mb-6 p-4 bg-gradient-to-br ${service.gradient} rounded-xl w-fit group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-orange-500 transition-colors duration-300">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                                        {service.description}
                                    </p>
                                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="text-orange-500 font-semibold hover:text-orange-400 transition-colors duration-300">
                                            Learn More →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Services;