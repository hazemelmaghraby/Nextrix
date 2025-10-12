import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../../constants/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import {
    Github,
    Linkedin,
    Instagram,
    Shield,
    Crown,
    UserStar,
    BadgeCheck,
} from "lucide-react";

// === ROLE STYLES ===
const roleStyles = {
    owner: {
        frame: "border-2 border-yellow-500 shadow-[0_0_0_3px_rgba(253,224,71,0.3)]",
        name: "text-yellow-300",
        username: "text-yellow-200",
        badge:
            "bg-yellow-400/20 border border-yellow-400 text-yellow-200 uppercase tracking-wider animate-pulse",
    },
    admin: {
        frame: "border-2 border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.3)]",
        name: "text-blue-300",
        username: "text-blue-200",
        badge:
            "bg-red-500/20 border border-red-500 text-blue-200 uppercase tracking-wider animate-pulse",
    },
    moderator: {
        frame: "border-2 border-purple-500 shadow-[0_0_0_3px_rgba(168,85,247,0.3)]",
        name: "text-purple-300",
        username: "text-purple-200",
        badge:
            "bg-purple-400/20 border border-purple-400 text-purple-200 uppercase tracking-wider animate-pulse",
    },
    staff: {
        frame: "border-2 border-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.3)]",
        name: "text-green-300",
        username: "text-green-200",
        badge:
            "bg-green-400/20 border border-green-400 text-green-200 uppercase tracking-wider animate-pulse",
    },
    premium: {
        frame: "border-2 border-orange-500 shadow-[0_0_0_3px_rgba(234,179,8,0.3)]",
        name: "text-orange-300",
        username: "text-orange-200",
        badge:
            "bg-orange-400/20 border border-orange-400 text-orange-200 uppercase tracking-wider animate-pulse",
    },
    certified: {
        frame: "border-2 border-cyan-400 shadow-[0_0_0_3px_rgba(34,211,238,0.3)]",
        name: "text-cyan-300",
        username: "text-cyan-200",
        badge:
            "bg-cyan-400/20 border border-cyan-400 text-cyan-200 uppercase tracking-wider animate-pulse",
    },
    default: {
        frame: "border-2 border-white/10",
        name: "text-white",
        username: "text-gray-400",
        badge: "bg-white/10 border border-white/20 text-gray-300",
    },
};

function getRoleKey({ owner, role, premium, certified }) {
    if (owner) return "owner";
    if (role?.toLowerCase().includes("admin")) return "admin";
    if (role?.toLowerCase().includes("moderator")) return "moderator";
    if (role?.toLowerCase().includes("staff")) return "staff";
    if (certified) return "certified";
    if (premium) return "premium";
    return "default";
}

const AccountProfile = () => {
    const { uid } = useParams();
    const [userData, setUserData] = useState(null);
    const [projects, setProjects] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // === FETCH USER + PROJECTS + TEAM ===
    useEffect(() => {
        const fetchUserData = async () => {
            if (!uid) return;

            try {
                const userRef = doc(db, "users", uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setUserData(data);

                    // Fetch projects
                    const projectsRef = collection(db, "users", uid, "projects");
                    const projectsSnap = await getDocs(projectsRef);
                    const projectsData = projectsSnap.docs.map((d) => ({
                        id: d.id,
                        ...d.data(),
                    }));
                    setProjects(projectsData);

                    // Fetch team members if any
                    if (data.teamMembersUID?.length) {
                        const userFetches = data.teamMembersUID.map((memberId) =>
                            getDoc(doc(db, "users", memberId))
                        );
                        const userSnaps = await Promise.all(userFetches);
                        const members = userSnaps
                            .filter((s) => s.exists())
                            .map((s) => ({ id: s.id, ...s.data() }));
                        setTeamMembers(members);
                    }
                }
            } catch (error) {
                console.error("Error loading user profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [uid]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <p className="text-gray-400 animate-pulse">Loading profile...</p>
            </div>
        );

    if (!userData)
        return (
            <div className="flex items-center justify-center h-screen bg-black text-gray-300">
                User not found.
            </div>
        );

    const {
        avatarURL,
        firstName,
        surName,
        username,
        title,
        bio,
        role,
        owner,
        premium,
        certified,
        teamName,
    } = userData;

    const displayName = `${firstName || ""} ${surName || ""}`.trim() || "Unnamed User";
    const roleKey = getRoleKey({ owner, role, premium, certified });
    const styles = roleStyles[roleKey];

    return (
        <div className="relative min-h-screen flex flex-col items-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden py-16 px-6 text-white">
            {/* Animated Background Orbs */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow"></div>

            <motion.div
                className={`relative w-full max-w-4xl p-[2px] rounded-3xl ${styles.frame}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="bg-black/70 backdrop-blur-2xl rounded-3xl p-8 md:p-12">
                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row items-center gap-6 border-b border-white/10 pb-8">
                        <div className={`relative w-32 h-32 rounded-full overflow-hidden border-4 ${styles.frame}`}>
                            <img
                                src={avatarURL || `https://ui-avatars.com/api/?name=${displayName}`}
                                alt={displayName}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1
                                className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-blue-400 ${styles.name}`}
                            >
                                {displayName}
                            </h1>
                            {username && <p className={`${styles.username} text-sm`}>@{username}</p>}
                            {title && <p className="text-orange-400 font-semibold mt-1">{title}</p>}
                            <div className="flex justify-center md:justify-start gap-3 mt-4">
                                <span className={`px-4 py-1 rounded-full text-sm ${styles.badge}`}>
                                    {role || "User"}
                                </span>
                                {premium && <Crown className="text-orange-400" />}
                                {certified && <BadgeCheck className="text-cyan-400" />}
                            </div>
                        </div>
                    </div>

                    {/* BIO */}
                    {bio && <p className="text-gray-300 mt-6">{bio}</p>}

                    {/* PROJECTS */}
                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold mb-4 text-orange-400">Projects</h2>
                        {projects.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {projects.map((p) => (
                                    <div
                                        key={p.id}
                                        className="bg-black/50 border border-white/10 rounded-xl p-5 hover:border-orange-400/30 transition-all"
                                    >
                                        <h3 className="text-lg font-semibold text-white">{p.projectName}</h3>
                                        <p className="text-gray-400 text-sm mt-2 line-clamp-3">{p.description}</p>
                                        {p.techs && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {p.techs.map((t, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 rounded-lg text-xs bg-orange-500/10 border border-orange-500/20 text-orange-300"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No projects available.</p>
                        )}
                    </div>

                    {/* TEAM MEMBERS */}
                    {teamName && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                                Team: {teamName}
                            </h2>
                            {teamMembers.length > 0 ? (
                                <div className="flex flex-wrap gap-5">
                                    {teamMembers.map((member) => (
                                        <Link
                                            to={`/account/${member.id}`}
                                            key={member.id}
                                            className="flex flex-col items-center group"
                                        >
                                            <div className="w-20 h-20 rounded-full overflow-hidden border border-white/20 group-hover:border-blue-400 transition">
                                                <img
                                                    src={
                                                        member.avatarURL ||
                                                        `https://ui-avatars.com/api/?name=${member.firstName || "User"}`
                                                    }
                                                    alt={member.username || "user"}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <p className="text-sm mt-2 text-gray-300 group-hover:text-white transition">
                                                {member.firstName || "Unknown"}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No team members found.</p>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AccountProfile;
