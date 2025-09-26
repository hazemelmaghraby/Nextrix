import React, { useState, useEffect } from "react";
import {
    Mail,
    Phone,
    User,
    Star,
    Shield,
    Crown,
    UserStar,
    Linkedin,
    Twitter,
    Facebook,
    LinkedinIcon,
    Instagram,
} from "lucide-react";
import useUserData from "../../constants/data/useUserData";
import Loading from "../../constants/components/Loading";

// Role color classes matching Navbar.jsx
const roleStyles = {
    owner: {
        // Yellow border and shadow, yellow badge, yellow text
        frame: "border-2 border-yellow-500 shadow-[0_0_0_3px_rgba(253,224,71,0.3)]",
        badge: "bg-yellow-400/20 border border-yellow-400 text-yellow-200 uppercase tracking-wider animate-pulse",
        border: "border-yellow-500 shadow-[0_0_0_3px_rgba(253,224,71,0.3)]",
        name: "text-yellow-300",
        username: "text-yellow-200",
        roleBg: "bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-blue-500/30 border border-yellow-400/50 shadow shadow-yellow-400/10",
    },
    admin: {
        // Red border and shadow, red badge, blue text
        frame: "border-2 border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.3)]",
        badge: "bg-red-500/20 border border-red-500 text-blue-200 uppercase tracking-wider animate-pulse",
        border: "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.3)]",
        name: "text-blue-300",
        username: "text-blue-200",
        roleBg: "bg-gradient-to-r from-blue-400/30 to-blue-500/30 border border-blue-400/50",
    },
    moderator: {
        // Purple border and shadow, purple badge, purple text
        frame: "border-2 border-purple-500 shadow-[0_0_0_3px_rgba(168,85,247,0.3)]",
        badge: "bg-purple-400/20 border border-purple-400 text-purple-200 uppercase tracking-wider animate-pulse",
        border: "border-purple-500 shadow-[0_0_0_3px_rgba(168,85,247,0.3)]",
        name: "text-purple-300",
        username: "text-purple-200",
        roleBg: "bg-gradient-to-r from-purple-400/30 to-purple-500/30 border border-purple-400/50",
    },
    staff: {
        // Green border and shadow, green badge, green text
        frame: "border-2 border-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.3)]",
        badge: "bg-green-400/20 border border-green-400 text-green-200 uppercase tracking-wider animate-pulse",
        border: "border-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.3)]",
        name: "text-green-300",
        username: "text-green-200",
        roleBg: "bg-gradient-to-r from-green-400/30 to-green-500/30 border border-green-400/50",
    },
    premium: {
        // Orange border and shadow, orange badge, orange text
        frame: "border-2 border-orange-500 shadow-[0_0_0_3px_rgba(234,179,8,0.3)]",
        badge: "bg-orange-400/20 border border-orange-400 text-orange-200 uppercase tracking-wider animate-pulse",
        border: "border-orange-500 shadow-[0_0_0_3px_rgba(234,179,8,0.3)]",
        name: "text-orange-300",
        username: "text-orange-200",
        roleBg: "bg-gradient-to-r from-orange-400/30 to-orange-500/30 border border-orange-400/50",
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

function getRoleKey({ owner, role, premium }) {
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
        user,
        loading
    } = useUserData();


    // useEffect(() => {
    //     if (user !== undefined) {
    //         setLoading(false);
    //     }
    // }, [user]);

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">
                <div className="inline-block p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl text-center">
                    <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                        <span className="text-orange-500">Please</span> Login to view your
                        profile
                    </p>
                    <a
                        className="text-lg text-blue-400 hover:underline transition"
                        href="/login"
                    >
                        Login
                    </a>
                </div>
            </div>
        );
    }

    // Determine style based on role/owner/premium
    const roleKey = getRoleKey({ owner, role, premium });
    const frameClass = roleStyles[roleKey]?.frame || roleStyles.default.frame;
    const badgeClass = roleStyles[roleKey]?.badge || roleStyles.default.badge;
    const profileBorderClass = roleStyles[roleKey]?.border || roleStyles.default.border;
    const nameClass = roleStyles[roleKey]?.name || roleStyles.default.name;
    const usernameClass = roleStyles[roleKey]?.username || roleStyles.default.username;
    const roleBgClass = roleStyles[roleKey]?.roleBg || roleStyles.default.roleBg;

    // Role label and icon
    let roleLabel = role;
    let roleIcon = null;
    if (owner) {
        roleLabel = "Owner";
        roleIcon = <Shield className="w-4 h-4" />;
    } else if (roleKey === "admin") {
        roleLabel = "Admin";
    } else if (roleKey === "moderator") {
        roleLabel = "Moderator";
    } else if (roleKey === "staff") {
        roleLabel = "Staff";
    } else if (premium) {
        roleLabel = "Premium";
        roleIcon = <Crown className="w-4 h-4" />;
    } else {
        roleLabel = role || "User";
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
            {/* Animated BG Orbs */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow"></div>

            {/* Outer border based on role */}
            <div
                className={`relative w-full max-w-5xl mt-20 p-[2px] rounded-3xl ${frameClass}`}
            >
                {/* Glassmorphism inner card */}
                <div className="bg-black/70 backdrop-blur-2xl rounded-3xl p-10 md:p-12 text-white space-y-8 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                    {/* Header with profile pic */}
                    <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-8 gap-6">
                        <div className="flex items-center gap-6">
                            {/* Profile Image */}
                            <div
                                className={`relative w-28 h-28 rounded-full overflow-hidden border-4 ${profileBorderClass}`}
                            >
                                <img
                                    src={`https://ui-avatars.com/api/?name=${firstName}+${surName}&background=000000&color=ffffff`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Name + Username */}
                            <div>
                                <h1 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-blue-500 ${nameClass === "text-white" ? "" : nameClass} flex items-center gap-2`}>
                                    {firstName} {surName}
                                    {owner && (
                                        <>
                                            <Crown className="text-yellow-400 mt-2" />
                                        </>
                                    )}
                                    {premium && (
                                        <>
                                            <UserStar className="text-yellow-400 mt-2" />
                                        </>
                                    )}
                                </h1>
                                <p className={`${usernameClass} ${usernameClass === "text-gray-400" ? "" : "font-semibold"}`}>@{username}</p>
                            </div>
                        </div>

                        {/* Roles */}
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-4 py-1 rounded-full text-sm flex items-center gap-1 ${badgeClass}`}>
                                {roleIcon}
                                <span>{roleLabel}</span>
                            </span>
                            {/* Show premium badge if premium and not owner and not admin/mod/staff */}
                            {premium && !owner && !["admin", "moderator", "staff"].includes(roleKey) && (
                                <span className="px-3 py-1 rounded-full text-xs bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center space-x-1 animate-pulse">
                                    <Crown className="w-4 h-4" />
                                    <span>Premium</span>
                                </span>
                            )}
                            {/* Show role background badge for owner/admin/mod/staff */}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-blue-400" />
                            <span className="text-gray-300">{email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-green-400" />
                            <span className="text-gray-300">{phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-purple-400" />
                            <span className="text-gray-300">
                                {gender}, {age} years
                            </span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <span className="text-gray-300">
                                {premium ? "Premium Member" : "Standard Member"}
                            </span>
                        </div>
                    </div>

                    <div className="activityRoles">
                        <h2 className="text-xl font-semibold mb-3 text-white/90">
                            Activity Roles
                        </h2>
                        {premium && (<>
                            <div className="inline-flex items-center px-6 py-1 rounded-full border-2 bg-gradient-to-r from-amber-500/30 to-amber-400/30 border-amber-400/50 shadow-lg">
                                <span className="text-md font-bold capitalize text-amber-200 tracking-wide">
                                    premium
                                </span>
                            </div>
                        </>)}
                    </div>

                    {/* Career Roles */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-white/90">
                            Career Roles
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {Array.isArray(careerRoles) ? (
                                careerRoles.map((r, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-blue-500/20 border border-white/10 text-sm text-gray-200 hover:scale-105 transition"
                                    >
                                        {r}
                                    </span>
                                ))
                            ) : (
                                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-blue-500/20 border border-white/10 text-sm text-gray-200">
                                    {careerRoles}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Sub Roles */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-white/90">
                            Sub Roles
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {Array.isArray(subRoles) ? (
                                subRoles.map((r, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition"
                                    >
                                        {r}
                                    </span>
                                ))
                            ) : (
                                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300">
                                    {subRoles}
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Social Media */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-white/90">
                            Social Media
                        </h2>
                        <div className="flex gap-4">
                            <a
                                href="https://linkedin.com/in/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-white/5 border border-white/10 text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition"
                            >
                                <Linkedin className="w-6 h-6" />
                            </a>
                            <a
                                href="https://twitter.com/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-white/5 border border-white/10 text-sky-400 hover:bg-sky-500/20 hover:scale-110 transition"
                            >
                                <Twitter className="w-6 h-6" />
                            </a>
                            <a
                                href="https://facebook.com/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-white/5 border border-white/10 text-blue-600 hover:bg-blue-600/20 hover:scale-110 transition"
                            >
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a
                                href="https://instagram.com/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-white/5 border border-white/10 text-pink-400 hover:bg-pink-500/20 hover:scale-110 transition"
                            >
                                <Instagram className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
