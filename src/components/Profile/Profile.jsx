// Profile.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Mail,
    Phone,
    User,
    Star,
    Shield,
    Crown,
    UserStar,
    Linkedin,
    Instagram,
    Github,
    BadgeCheck,
    Users,
    FolderKanban,
    Settings as SettingsIcon
} from "lucide-react";
import useUserData from "../../constants/data/useUserData";
import Loading from "../../constants/components/Loading";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../constants/firebase";
import { Riple } from "react-loading-indicators";

// (paste your existing roleStyles object here — kept same as your original)
const roleStyles = {
    owner: {
        frame: "border-2 border-yellow-500 shadow-[0_0_0_3px_rgba(253,224,71,0.3)]",
        badge: "bg-yellow-400/20 border border-yellow-400 text-yellow-200 uppercase tracking-wider animate-pulse",
        border: "border-yellow-500 shadow-[0_0_0_3px_rgba(253,224,71,0.3)]",
        name: "text-yellow-300",
        username: "text-yellow-200",
        roleBg:
            "bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-blue-500/30 border border-yellow-400/50 shadow shadow-yellow-400/10",
    },
    admin: {
        frame: "border-2 border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.3)]",
        badge: "bg-red-500/20 border border-red-500 text-blue-200 uppercase tracking-wider animate-pulse",
        border: "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.3)]",
        name: "text-blue-300",
        username: "text-blue-200",
        roleBg: "bg-gradient-to-r from-blue-400/30 to-blue-500/30 border border-blue-400/50",
    },
    moderator: {
        frame: "border-2 border-purple-500 shadow-[0_0_0_3px_rgba(168,85,247,0.3)]",
        badge: "bg-purple-400/20 border border-purple-400 text-purple-200 uppercase tracking-wider animate-pulse",
        border: "border-purple-500 shadow-[0_0_0_3px_rgba(168,85,247,0.3)]",
        name: "text-purple-300",
        username: "text-purple-200",
        roleBg: "bg-gradient-to-r from-purple-400/30 to-purple-500/30 border border-purple-400/50",
    },
    staff: {
        frame: "border-2 border-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.3)]",
        badge: "bg-green-400/20 border border-green-400 text-green-200 uppercase tracking-wider animate-pulse",
        border: "border-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.3)]",
        name: "text-green-300",
        username: "text-green-200",
        roleBg: "bg-gradient-to-r from-green-400/30 to-green-500/30 border border-green-400/50",
    },
    premium: {
        frame: "border-2 border-orange-500 shadow-[0_0_0_3px_rgba(234,179,8,0.3)]",
        badge: "bg-orange-400/20 border border-orange-400 text-orange-200 uppercase tracking-wider animate-pulse",
        border: "border-orange-500 shadow-[0_0_0_3px_rgba(234,179,8,0.3)]",
        name: "text-orange-300",
        username: "text-orange-200",
        roleBg: "bg-gradient-to-r from-orange-400/30 to-orange-500/30 border border-orange-400/50",
    },
    certified: {
        frame: "border-2 border-cyan-400 shadow-[0_0_0_3px_rgba(34,211,238,0.3)]",
        border: "border-cyan-400 shadow-[0_0_0_3px_rgba(34,211,238,0.3)]",
        name: "text-cyan-300",
        username: "text-cyan-200",
        roleBg: "bg-gradient-to-r from-cyan-400/30 to-cyan-500/30 border border-cyan-400/50",
    },
    default: {
        frame: "border-2 border-white/10",
        badge: "bg-gray-500/20 border border-gray-500/30 text-gray-300",
        border: "border-white/20",
        name: "text-white",
        username: "text-gray-400",
        roleBg: "bg-white/10 border border-white/20",
    },
};

function getRoleKey({ owner, role, premium, certified }) {
    if (certified && !owner && role === "admin" && role === "moderator" && role === "staff") return "certified";
    if (owner) return "owner";
    if (role && typeof role === "string") {
        const r = role.toLowerCase();
        if (r.includes("admin")) return "admin";
        if (r.includes("moderator")) return "moderator";
        if (r.includes("staff")) return "staff";
    }
    if (premium) return "premium";
    return "default";
}

const Profile = () => {
    const {
        user,
        phone,
        gender,
        firstName,
        surName,
        username,
        email,
        premium,
        owner,
        role,
        subRoles,
        careerRoles,
        age,
        loading,
        avatar,
        github,
        linkedin,
        instagram,
        whatsApp,
        bio,
        title,
        certified,
        major,
        teamId,
        uid,
        projectsAssociatedd
    } = useUserData();


    // Team + projects
    const [teamData, setTeamData] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamLoading, setTeamLoading] = useState(true);

    const [projectsLoading, setProjectsLoading] = useState(false);
    // This will hold the fetched project objects
    const [projectsData, setProjectsData] = useState([]); // Default to [] instead of null

    useEffect(() => {
        const fetchTeam = async () => {
            setTeamLoading(true);
            try {
                // 🧱 2. Fetch team (if exists)
                if (teamId) {
                    const teamRef = doc(db, "teams", teamId);
                    const teamSnap = await getDoc(teamRef);

                    if (teamSnap.exists()) {
                        const teamInfo = teamSnap.data();
                        setTeamData(teamInfo);

                        // 👥 3. Fetch all team members
                        if (Array.isArray(teamInfo.teamMembersUIDs) && teamInfo.teamMembersUIDs.length > 0) {
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
                        } else {
                            setTeamMembers([]);
                        }
                    } else {
                        setTeamData(null);
                        setTeamMembers([]);
                    }
                } else {
                    setTeamData(null);
                    setTeamMembers([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setTeamData(null);
                setTeamMembers([]);
            } finally {
                setTeamLoading(false);
            }
        };

        if (uid) fetchTeam();
    }, [uid, teamId]);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!user && !loading) return;
            setProjectsLoading(true);
            try {
                if (projectsAssociatedd && Array.isArray(projectsAssociatedd) && projectsAssociatedd.length > 0) {
                    // Fetch all project docs listed in projectsAssociatedd
                    const projectDocs = await Promise.all(
                        projectsAssociatedd.map(async (projectsAssociatedd) => {
                            const projectRef = doc(db, 'stock', 'projects', 'accepted projects', projectsAssociatedd);
                            const projectSnap = await getDoc(projectRef);
                            return projectSnap.exists() ? { id: projectsAssociatedd, ...projectSnap.data() } : null;
                        })
                    );
                    // Filter out nulls where docs didn't exist
                    setProjectsData(projectDocs.filter(Boolean));
                } else if (typeof projectsAssociatedd === "string") {
                    // Single project id
                    const projectRef = doc(db, "projects", projectsAssociatedd);
                    const projectSnap = await getDoc(projectRef);
                    if (projectSnap.exists()) {
                        setProjectsData([{ id: projectsAssociatedd, ...projectSnap.data() }]);
                    } else {
                        setProjectsData([]);
                    }
                } else {
                    setProjectsData([]);
                }

            } catch (error) {
                setProjectsData([]);
            } finally {
                setProjectsLoading(false);
            }

        }
        fetchProjects();
    }, [projectsAssociatedd, user, loading]);


    useEffect(() => {
        document.title = "Nextrix • Profile";
    }, []);

    if (loading) return <Loading />;

    if (!user) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">
                <div className="inline-block p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl text-center">
                    <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                        <span className="text-orange-500">Please</span> Login to view your profile
                    </p>
                    <a className="text-lg text-blue-400 hover:underline transition" href="/login">
                        Login
                    </a>
                </div>
            </div>
        );
    }

    const roleKey = getRoleKey({ owner, role, premium, certified });
    const frameClass = roleStyles[roleKey]?.frame || roleStyles.default.frame;
    const badgeClass = roleStyles[roleKey]?.badge || roleStyles.default.badge;
    const profileBorderClass = roleStyles[roleKey]?.border || roleStyles.default.border;
    const nameClass = roleStyles[roleKey]?.name || roleStyles.default.name;
    const usernameClass = roleStyles[roleKey]?.username || roleStyles.default.username;
    const roleBgClass = roleStyles[roleKey]?.roleBg || roleStyles.default.roleBg;

    const isGoldShimmer = roleKey === "owner" || roleKey === "admin";

    // FIX: Use projectsData (array) not projects
    const projects = Array.isArray(projectsData) ? projectsData : [];

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black pt-20 md:pt-24">
            <div className="w-full px-6 py-8 md:px-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    {/* LEFT: profile card */}
                    <div className="md:col-span-1 relative">
                        {/* gold shimmer behind card for owners/admins only */}
                        {isGoldShimmer && (
                            <div className="absolute -inset-1 rounded-2xl overflow-hidden pointer-events-none z-0">
                                <div className="gold-shimmer w-full h-full" />
                            </div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`relative z-10 bg-black/60 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border ${frameClass}`}
                        >
                            <div className="flex flex-col items-center">
                                <div className={`relative w-40 h-40 rounded-full overflow-hidden border-4 ${profileBorderClass}`}>
                                    <img
                                        src={avatar || `https://ui-avatars.com/api/?name=${firstName}+${surName}&background=000000&color=ffffff`}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${firstName}+${surName}&background=000000&color=ffffff`; }}
                                    />
                                </div>

                                <div className="text-center mt-4">
                                    <h1 className={`text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-blue-400 ${nameClass}`}>
                                        {firstName} {surName}
                                        {owner && <Crown className="inline-block ml-2 text-yellow-300" />}
                                        {premium && !certified && <UserStar className="inline-block ml-1 text-yellow-300" />}
                                        {certified && !owner && <BadgeCheck className="inline-block ml-1 text-cyan-300" />}
                                    </h1>
                                    <p className={`mt-1 ${usernameClass} ${usernameClass !== "text-gray-400" ? "font-semibold" : "text-gray-400"}`}>@{username}</p>
                                    {title && <p className="text-sm text-orange-400 mt-2">{title}</p>}
                                </div>

                                <div className="mt-4 flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-2 ${badgeClass}`}>
                                        {owner ? <Shield className="w-4 h-4" /> : roleKey === "admin" ? <Shield className="w-4 h-4" /> : null}
                                        <span>{owner ? "Owner" : role || "User"}</span>
                                    </span>
                                    {premium && !certified && !["admin", "moderator", "staff"].includes(roleKey) && (
                                        <span className="px-3 py-1 rounded-full text-xs bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center gap-1 animate-pulse">
                                            <Crown className="w-4 h-4" />
                                            <span>Premium</span>
                                        </span>
                                    )}
                                </div>

                                {/* team quick info */}
                                {!teamLoading && teamData && (
                                    <div className="mt-6 w-full text-left">
                                        <h3 className="text-sm text-white/80 font-semibold flex items-center gap-2">
                                            <Users className="w-4 h-4" /> Team
                                        </h3>
                                        <div className="mt-2 bg-white/5 p-3 rounded-lg border border-white/10">
                                            <p className="font-semibold text-white">{teamData.teamName}</p>
                                            <p className="text-xs text-gray-300 mt-1">
                                                Members: {teamData.teamMembersUIDs?.length || 0}
                                            </p>
                                            <div className="flex mt-3 -space-x-2">
                                                {teamMembers.map((m) => (
                                                    <a
                                                        key={m.id || m.uid}
                                                        href={`/accs/${m.id || m.uid}`}
                                                        className="block"
                                                        title={`Go to ${m.firstName || "User"}'s profile`}
                                                    >
                                                    </a>
                                                ))}
                                            </div>
                                            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {teamMembers.map((m) => (
                                                    <a
                                                        key={m.id || m.uid}
                                                        href={`/accs/${m.id || m.uid}`}
                                                        className={`flex items-center bg-gradient-to-r from-gray-800 via-black to-gray-900 border rounded-lg p-3 shadow-md hover:border-orange-400 hover:bg-black/70 transition border-transparent`}

                                                        title={`Go to ${m.firstName || "User"}'s profile`}
                                                    >
                                                        <img
                                                            src={
                                                                m.avatarURL ||
                                                                m.avatar ||
                                                                `https://ui-avatars.com/api/?name=${m.firstName || "User"}&background=111827&color=fff`
                                                            }
                                                            alt={m.firstName}
                                                            className="w-10 h-10 rounded-full mr-3 border border-gray-700 object-cover"
                                                        />
                                                        <div>
                                                            <p className="font-semibold text-white">
                                                                {(m.firstName || "User") + (m.surName ? ` ${m.surName}` : "")}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                @{m.username || "unknown"}
                                                            </p>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-6 flex gap-2">
                                    <a href={linkedin || "#"} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 border border-white/10 hover:scale-110 transition">
                                        <Linkedin className="w-5 h-5 text-blue-300" />
                                    </a>
                                    <a href={github || "#"} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 border border-white/10 hover:scale-110 transition">
                                        <Github className="w-5 h-5 text-white" />
                                    </a>
                                    <a href={instagram || "#"} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 border border-white/10 hover:scale-110 transition">
                                        <Instagram className="w-5 h-5 text-pink-400" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT: details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Professional Info */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-black/60 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border border-white/10">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6"><SettingsIcon className="w-5 h-5" /> Professional Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Current Role</label>
                                    <p className="text-white">{role || "N/A"}</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Title</label>
                                    <p className="text-white">{title || "-"}</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Experience / Major</label>
                                    <p className="text-white">{major || "-"}</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Phone</label>
                                    <p className="text-white">{phone || "-"}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Personal Details */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-black/60 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border border-white/10">
                            <h2 className="text-lg font-semibold text-white mb-4">Personal Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Email</label>
                                    <p className="text-white">{email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Gender / Age</label>
                                    <p className="text-white">{gender || "-"}{age ? `, ${age} years` : ""}</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Member Status</label>
                                    <p className="text-white">{certified ? "Certified Member" : "Standard Member"}</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Membership Tier</label>
                                    <p className="text-white">{premium ? "Premium" : "Free"}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Career Roles / Subroles / Projects */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="bg-black/50 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border border-white/8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="text-sm text-white/90 font-semibold mb-3">Career Roles</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(careerRoles) && careerRoles.length ? careerRoles.map((r, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-200">{r}</span>
                                        )) : <p className="text-gray-300">-</p>}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm text-white/90 font-semibold mb-3">Sub Roles</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(subRoles) && subRoles.length ? subRoles.map((r, i) => (
                                            <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300">{r}</span>
                                        )) : <p className="text-gray-300">-</p>}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm text-white/90 font-semibold mb-3">Projects</h3>
                                    <div className="flex flex-col gap-2">
                                        {projectsLoading ? (
                                            <p className="text-gray-300">Loading...</p>
                                        ) : projects && projects.length ? projects.map(p => (
                                            <div key={p.id} className="p-2 rounded-lg bg-white/5 border border-white/8">
                                                <a
                                                    href={`/myProjects/${p.id}`}
                                                    className="text-white text-sm font-semibold hover:underline"
                                                >
                                                    {p.projectName || p.name || "Untitled"}
                                                </a>
                                                {p.details && (
                                                    <p className="text-gray-400 text-xs mt-1">
                                                        {p.details.length > 50
                                                            ? `${p.details.slice(0, 50)}...`
                                                            : p.details}
                                                    </p>
                                                )}
                                            </div>
                                        )) : <p className="text-gray-300">No projects</p>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Profile;
