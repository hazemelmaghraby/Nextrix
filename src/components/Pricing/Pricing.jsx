import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Star,
    Crown,
    BadgeCheck,
    ShieldCheck,
} from "lucide-react";

const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
};

const stagger = {
    animate: {
        transition: { staggerChildren: 0.2 },
    },
};

export default function PricingSection() {
    React.useEffect(() => {
        document.title = 'Nextrix • Settings';
    }, []);
    const plans = [
        {
            title: "Starter",
            price: "$5/mo",
            desc: "Perfect for individuals just getting started.",
            features: [
                "Access to developer profiles",
                "Basic search filters",
                "Community Support",
            ],
            icon: <BadgeCheck className="w-8 h-8 text-orange-400" />,
            gradient: "from-orange-500/20 to-orange-700/10",
        },
        {
            title: "Pro",
            price: "$15/mo",
            desc: "Boost your reach with advanced features.",
            features: [
                "Rank higher in searches",
                "Exclusive job postings",
                "Priority support",
                "Pro role in community",
            ],
            icon: <Star className="w-8 h-8 text-blue-400" />,
            gradient: "from-blue-500/20 to-purple-700/10",
        },
        {
            title: "Elite",
            price: "$30/mo",
            desc: "For companies & professionals scaling big.",
            features: [
                "All Pro features",
                "Dedicated account manager",
                "Enterprise analytics",
                "Elite role + VIP perks",
            ],
            icon: <Crown className="w-8 h-8 text-pink-400" />,
            gradient: "from-pink-500/20 to-red-700/10",
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white py-20 px-6">
            {/* Hero */}
            <motion.div
                className="max-w-7xl mx-auto text-center"
                initial="initial"
                animate="animate"
                variants={stagger}
            >
                <motion.h1
                    className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent"
                    variants={fadeInUp}
                >
                    Choose Your Plan
                </motion.h1>
                <motion.p
                    className="text-lg text-gray-400 mb-16 max-w-2xl mx-auto"
                    variants={fadeInUp}
                >
                    Unlock exclusive features, boost your visibility, and get tailored
                    benefits whether you’re a developer or a hiring company.
                </motion.p>

                {/* Plans */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-10"
                    variants={stagger}
                >
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05 }}
                            className={`relative p-8 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl bg-gradient-to-br ${plan.gradient} flex flex-col justify-between`}
                        >
                            <div>
                                <div className="mb-6 flex justify-center">
                                    <div className="w-16 h-16 rounded-xl bg-black/40 flex items-center justify-center shadow-lg">
                                        {plan.icon}
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold mb-2">{plan.title}</h3>
                                <p className="text-4xl font-extrabold mb-4">{plan.price}</p>
                                <p className="text-gray-400 mb-6">{plan.desc}</p>
                                <ul className="space-y-3 text-gray-200">
                                    {plan.features.map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center gap-3 text-base"
                                        >
                                            <ShieldCheck className="w-5 h-5 text-green-400" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-8">
                                <Link
                                    to={`/subscribe/${plan.title.toLowerCase()}`}
                                    className="inline-block w-full text-center px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 text-black hover:opacity-90 transition"
                                >
                                    Subscribe
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Call-to-Action */}
            <motion.div
                className="max-w-4xl mx-auto mt-32 text-center p-12 rounded-2xl bg-black/50 border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                    Upgrade Today!
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                    Maximize your experience with exclusive benefits and unlock your full
                    potential.
                </p>
                <Link
                    to="/register"
                    className="inline-block px-10 py-4 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 text-black hover:opacity-90 transition"
                >
                    Get Started Now
                </Link>

                {/* Decorative Glows */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
            </motion.div>
        </div>
    );
}
