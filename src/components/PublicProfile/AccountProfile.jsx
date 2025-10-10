import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../constants/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram } from "lucide-react";

const AccountProfile = () => {
    const { uid } = useParams();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const ref = doc(db, "users", uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                setUserData(snap.data());
            } else {
                console.log("No such user!");
            }
        };

        if (uid) fetchUser();
    }, [uid]);

    if (!userData)
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-400 animate-pulse">Loading profile...</p>
            </div>
        );

    const {
        avatarURL,
        firstName,
        surName,
        username,
        title,
        level,
        bio,
        profileInfo,
        premium,
        certified,
        role,
        owner,
        careerRoles,
    } = userData;

    const info = profileInfo || {};
    const displayName = `${firstName || ""} ${surName || ""}`.trim();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0b0c10] to-[#0e0f13] text-white flex flex-col items-center py-16 px-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[#111217]/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl min-h-[100vh] max-w-[85%] w-full border border-white/10"
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                    <img
                        src={avatarURL}
                        alt={displayName}
                        className="w-40 h-40 rounded-2xl object-cover border border-white/20 shadow-lg"
                    />
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl font-semibold">
                            {displayName || "Unnamed User"}
                        </h1>
                        {username && (
                            <p className="text-gray-400">@{username}</p>
                        )}
                        {title && (
                            <p className="text-lg text-blue-400 mt-2">{title}</p>
                        )}
                        {role && (
                            <>
                                <p className="text-lg text-blue-400 mt-2">{role}</p>
                            </>
                        )}
                        {owner && (
                            <>
                                <p className="text-lg text-blue-400 mt-2">Owner</p>
                            </>
                        )}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                            {level && (
                                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                                    {level}
                                </span>
                            )}
                            {premium && (
                                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                                    Premium
                                </span>
                            )}
                            {certified && (
                                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                                    Certified
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bio */}
                {bio && (
                    <p className="text-gray-300 leading-relaxed mb-8">
                        {bio}
                    </p>
                )}

                {/* Profile Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {info.level && (
                        <div className="bg-white/5 p-3 rounded-lg">
                            <h3 className="text-sm text-gray-400">Level</h3>
                            <p className="text-white font-medium">{info.level}</p>
                        </div>
                    )}
                    {info.title && (
                        <div className="bg-white/5 p-3 rounded-lg">
                            <h3 className="text-sm text-gray-400">Title</h3>
                            <p className="text-white font-medium">{info.title}</p>
                        </div>
                    )}
                    {careerRoles && (
                        <div className="bg-white/5 p-3 rounded-lg">
                            <h3 className="text-sm text-gray-400">Title</h3>
                            <p className="bg-red-500/20 text-red-300 px-2 py-1 text-sm rounded-md">{info.careerRoles}</p>
                        </div>
                    )}
                    {info.skills && info.skills.length > 0 && (
                        <div className="bg-white/5 p-3 rounded-lg sm:col-span-2">
                            <h3 className="text-sm text-gray-400 mb-1">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {info.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="bg-blue-500/20 text-blue-300 px-2 py-1 text-sm rounded-md"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Links */}
                <div className="flex justify-center gap-6 mt-4">
                    {info.github && (
                        <a
                            href={info.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-400 transition"
                        >
                            <Github size={22} />
                        </a>
                    )}
                    {info.linkedin && (
                        <a
                            href={info.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-400 transition"
                        >
                            <Linkedin size={22} />
                        </a>
                    )}
                    {info.instagram && (
                        <a
                            href={info.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-pink-400 transition"
                        >
                            <Instagram size={22} />
                        </a>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AccountProfile;
