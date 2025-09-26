import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, ArrowRight } from 'lucide-react';

const Features = () => {
    const sectionRef = useRef();
    const featuresRef = useRef();

    useEffect(() => {
        gsap.fromTo(sectionRef.current.querySelector('.features-title'),
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

        gsap.fromTo(featuresRef.current.children,
            { x: -50, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }, []);

    const features = [
        "24/7 Technical Support",
        "Scalable Architecture",
        "SEO Optimization",
        "Mobile-First Design",
        "Performance Analytics",
        "Security Best Practices",
        "Cloud Integration",
        "API Development",
        "Database Optimization",
        "User Experience Design",
        "Quality Assurance",
        "Ongoing Maintenance"
    ];

    return (
        <section id="features" ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="features-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Why Choose{' '}
                            <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                                Nextrix?
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            We deliver comprehensive solutions with attention to every detail.
                            Our commitment to excellence ensures your project exceeds expectations.
                        </p>
                        <button className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2">
                            <span>Start Your Project</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>

                    <div ref={featuresRef} className="space-y-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-800/30 to-transparent rounded-lg hover:from-orange-500/10 hover:to-blue-500/10 transition-all duration-300 transform hover:translate-x-2"
                            >
                                <div className="p-1 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-gray-300 group-hover:text-white font-medium transition-colors duration-300">
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;