import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../constants/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Github, Linkedin, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { Riple, BlinkBlur } from "react-loading-indicators";

const AccountProfile = () => {
    const { uid } = useParams();
    const [userData, setUserData] = useState(null);
    const [teamData, setTeamData] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamLoading, setTeamLoading] = useState(true);

    useEffect(() => {
        const fetchUserAndTeam = async () => {
            try {
                setTeamLoading(true);

                // 🧩 1. Fetch user
                const userRef = doc(db, "users", uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    console.error("User not found");
                    setTeamLoading(false);
                    return;
                }

                const userInfo = userSnap.data();
                setUserData(userInfo);

                // 🧱 2. Fetch team (if exists)
                if (userInfo.teamId) {
                    const teamRef = doc(db, "teams", userInfo.teamId);
                    const teamSnap = await getDoc(teamRef);

                    if (teamSnap.exists()) {
                        const teamInfo = teamSnap.data();
                        setTeamData(teamInfo);

                        // 👥 3. Fetch all team members
                        const members = await Promise.all(
                            teamInfo.teamMembersUIDs.map(async (memberUID) => {
                                const memberRef = doc(db, "users", memberUID);
                                const memberSnap = await getDoc(memberRef);
                                return memberSnap.exists()
                                    ? { id: memberUID, ...memberSnap.data() }
                                    : null;
                            })
                        );

                        setTeamMembers(members.filter(Boolean));
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setTeamLoading(false);
            }
        };

        if (uid) fetchUserAndTeam();
    }, [uid]);

    if (!userData)
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <BlinkBlur color="#ff7300" size="medium" text="" textColor="#ff7300" />
                <p className="mt-6 text-orange-400 text-lg font-medium animate-pulse">
                    Loading profile data. Please wait...
                </p>
            </div>
        );

    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const info = userData.profileInfo || {};
    const displayName = `${userData.firstName || ""} ${userData.surName || ""}`.trim();

    return (
        <div className="min-h-screen flex items-center justify-center py-16 px-6 bg-gradient-to-br from-black via-gray-900/90 to-black text-gray-100 mt-10">
            <motion.div
                className="w-full max-w-5xl bg-black/40 border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
            >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-white/10 pb-8 mb-8">
                    <img
                        src={userData.avatarURL}
                        alt={displayName}
                        className="w-40 h-40 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                    />
                    <div className="flex-1 text-center md:text-left">
                        <h1
                            className={`text-4xl font-bold ${userData.owner
                                ? "text-yellow-500"
                                : userData.role === "admin"
                                    ? "text-red-700"
                                    : userData.role === "moderator"
                                        ? "text-purple-600"
                                        : "bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent"
                                }`}
                        >
                            {displayName || "Unnamed User"}
                        </h1>
                        {userData.username && (
                            <>
                                <p className="text-gray-400 text-sm">@{userData.username}</p>
                                <p
                                    className={`${userData.owner
                                        ? "text-amber-300"
                                        : userData.role === "admin"
                                            ? "text-red-300"
                                            : "text-white"
                                        } text-xl mb-3`}
                                >
                                    {info.title}
                                </p>
                            </>
                        )}
                        {userData.owner && (
                            <span className="px-4 py-1 mr-1 rounded-full text-sm bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                Owner
                            </span>
                        )}
                        {['admin', 'moderator', 'staff'].includes(userData.role) && (
                            <span
                                className={`px-4 py-1 mr-1 rounded-full text-sm ${userData.role === 'admin'
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                    : userData.role === 'moderator'
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                        : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                                    }`}
                            >
                                {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                            </span>
                        )}
                        {userData.premium && (
                            <span className="px-4 py-1 mx-1 rounded-full text-sm bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                Premium
                            </span>
                        )}
                        {userData.certified && (
                            <span className="px-4 py-1  mx-1 rounded-full text-sm bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                Certified
                            </span>
                        )}


                    </div>
                </div>

                {/* BIO */}
                {info.bio && (
                    <motion.p
                        className="text-gray-300 leading-relaxed mb-8 text-center md:text-left"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                    >
                        {info.bio}
                    </motion.p>
                )}

                {/* INFO GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {info.title && (
                        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                            <p className="font-semibold text-gray-400">Title</p>
                            <p>{info.title}</p>
                        </div>
                    )}
                    {info.level && (
                        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                            <p className="font-semibold text-gray-400">Level</p>
                            <p>{info.level}</p>
                        </div>
                    )}
                    {info.careerRoles && (
                        <div className="bg-black/40 rounded-xl p-4 border border-white/10 sm:col-span-2">
                            <p className="font-semibold text-gray-400">Career Roles</p>
                            <p className="text-red-300">{info.careerRoles}</p>
                        </div>
                    )}
                    {info.skills && info.skills.length > 0 && (
                        <div className="bg-black/40 rounded-xl p-4 border border-white/10 sm:col-span-2">
                            <p className="font-semibold text-gray-400 mb-2">Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {info.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-lg text-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* TEAM SECTION */}
                {teamData ? (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                            Team: {teamData.teamName}
                        </h2>
                        <p className="text-gray-400 mb-6">Major: {teamData.major}</p>

                        {teamLoading ? (
                            <Riple color="#32cd32" size="medium" text="" textColor="" />
                        ) : teamMembers.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                                {teamMembers.map((member) => (
                                    <motion.div
                                        key={member.id}
                                        className="bg-black/40 p-4 rounded-xl border border-white/10 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <img
                                            src={member.avatarURL}
                                            alt={member.firstName || member.username || "User"}
                                            className="w-14 h-14 rounded-xl object-cover border border-white/20"
                                        />
                                        <div>
                                            <Link
                                                to={`/accs/${member.id}`}
                                                className="font-semibold text-white text-sm hover:text-blue-400 transition"
                                            >
                                                {`${member.firstName || ""} ${member.surName || ""}`.trim() ||
                                                    member.username ||
                                                    "Unnamed"}
                                            </Link>
                                            {member.role && (
                                                <div
                                                    className={`text-xs ${member.role === "admin"
                                                        ? "text-red-500"
                                                        : member.owner
                                                            ? "text-yellow-400"
                                                            : "text-blue-400"
                                                        }`}
                                                >
                                                    {member.role.charAt(0).toUpperCase() +
                                                        member.role.slice(1).toLowerCase()}
                                                </div>
                                            )}
                                            {member.profileInfo?.level && (
                                                <div className="text-xs text-gray-400">
                                                    Lv. {member.profileInfo.level}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No team members found.</p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500 italic mb-6">This user is not in a team.</p>
                )}

                {/* LINKS */}
                <div className="flex justify-center gap-6 mt-10">
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
