import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const teamMembers = [
    {
        name: "Hazem El-Maghraby",
        role: "CEO",
        bio: "Specialized in building dynamic, modern user interfaces with React & Tailwind.",
        img: "/Hazem.jpg",
        github: "#",
        linkedin: "#",
        email: "mailto:hazem@example.com",
        portfolio: 'you'
    },
    {
        name: "Maria W. Miller",
        role: "CTO",
        bio: "",
        img: "",
        github: "#",
        linkedin: "#",
        email: "mailto:ahmed@example.com",
    },
    {
        name: "Sara Mostafa",
        role: "UI/UX Designer",
        bio: "Designs intuitive, user-focused experiences that bring brands to life.",
        img: "",
        github: "#",
        linkedin: "#",
        email: "mailto:sara@example.com",
    },
    {
        name: "Omar Khaled",
        role: "Full-Stack Developer",
        bio: "Bridges the gap between design and technology with a focus on performance.",
        img: "",
        github: "#",
        linkedin: "#",
        email: "mailto:omar@example.com",
    },
];

const OurTeam = () => {
    return (
        <section className="relative h-[100vh] bg-gradient-to-b from-[#060608] to-[#0b0c10] text-white py-23 px-10 overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,0,128,0.15),transparent_70%)]"></div>

            {/* Section header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16 relative z-10"
            >
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-400 to-blue-500">
                    Meet Our Team
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto">
                    The Nextrix crew — turning imagination into code, and code into reality.
                </p>
            </motion.div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
                {teamMembers.map((member, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="relative group rounded-2xl bg-[#0f1015] border border-white/10 hover:border-pink-500/50 transition-all overflow-hidden shadow-xl hover:shadow-pink-500/10"
                    >
                        {/* Image */}
                        <div className="h-60 overflow-hidden">
                            <img
                                src={member.img}
                                alt={member.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Info */}
                        <div className="p-5">
                            <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                            <p className="text-pink-400 text-sm mb-2">{member.role}</p>
                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                {member.bio}
                            </p>

                            {/* Social Links */}
                            <div className="flex space-x-4 mt-auto">
                                <a
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-pink-400 transition"
                                >
                                    <Github size={18} />
                                </a>
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-pink-400 transition"
                                >
                                    <Linkedin size={18} />
                                </a>
                                <a
                                    href={member.email}
                                    className="hover:text-pink-400 transition"
                                >
                                    <Mail size={18} />
                                </a>
                                {/* Portfolio Button */}
                                {member.portfolio && (
                                    <a
                                        href={member.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-auto px-5 py-2.5 bg-pink-600/80 hover:bg-pink-700 text-white rounded-full text-[16px] font-semibold transition-colors duration-300 shadow hover:shadow-pink-500/20"
                                    >
                                        Portfolio
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Glow border effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default OurTeam;
