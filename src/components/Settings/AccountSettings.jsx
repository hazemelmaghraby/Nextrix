import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    Shield,
    Palette,
    Bell,
    LogOut,
    User
} from "lucide-react";
import useUserData from "../../constants/data/useUserData";
import Loading from "../../constants/components/Loading";
import NotSignedIn from "../../constants/components/NotSignedIn";
import { auth } from '../../constants/firebase';
import { signOut } from 'firebase/auth'

const tabs = [
    { name: "General", icon: <Settings size={20} />, key: "general" },
    { name: "Security", icon: <Shield size={20} />, key: "security" },
    { name: "Appearance", icon: <Palette size={20} />, key: "appearance" },
    { name: "Notifications", icon: <Bell size={20} />, key: "notifications" },
];

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AccountSettingsDemo() {
    React.useEffect(() => {
        document.title = 'Nextrix • Settings';
    }, []);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { user, loading, firstName, surName, bio, email, userLevel, title, age, gender, username, role, subRoles, careerRoles, owner } = useUserData();
    const [activeTab, setActiveTab] = useState("general");

    if (loading) return <Loading />;
    if (!user)
        return (
            <NotSignedIn>
                You must be signed in to access your account settings.
            </NotSignedIn>
        );

    return (
        <div className="min-h-screen flex items-center justify-center py-23 mb-1.5">
            <motion.div
                className="flex flex-col md:flex-row w-screen min-h-screen bg-gradient-to-br from-black via-gray-900/90 to-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
            >
                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-black/40 border-r border-white/10 flex flex-row md:flex-col text-gray-300">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-3 px-6 py-4 w-full text-left font-semibold transition-all duration-200
                                ${activeTab === tab.key
                                    ? "bg-gradient-to-r from-orange-500/20 to-blue-500/20 text-orange-400 border-l-4 border-orange-500"
                                    : "hover:bg-white/5 text-gray-300"
                                }`}
                        >
                            {tab.icon}
                            {tab.name}
                        </button>
                    ))}

                    <div>
                        <div
                            className="mt-auto px-6 py-4 border-t border-white/10 flex items-center gap-3 text-red-400 cursor-pointer hover:bg-red-500/10 transition"
                            onClick={() => setShowLogoutModal(true)}
                        >
                            <LogOut size={20} />
                            Logout
                        </div>
                        {showLogoutModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                                <div className="bg-gray-900 rounded-xl shadow-lg p-8 max-w-sm w-full border border-white/10">
                                    <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
                                        <LogOut size={22} /> Confirm Logout
                                    </h3>
                                    <p className="mb-6 text-gray-300">
                                        Are you sure you want to log out of your account?
                                    </p>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
                                            onClick={() => setShowLogoutModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition font-semibold"
                                            onClick={async () => {
                                                await auth.signOut();
                                                window.location.href = '/login';
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-10 text-gray-200">
                    {activeTab === "general" && (
                        <motion.div key="general" variants={fadeIn} initial="hidden" animate="visible">
                            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
                                Account Overview
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
                                {owner && (
                                    <>
                                        <div className="bg-gradient-to-r from-orange-900/40 to-blue-900/40 rounded-xl p-4 border-2 border-orange-500/40 col-span-1 sm:col-span-2 flex flex-col gap-2">
                                            <p className="font-semibold text-orange-400 flex items-center gap-2">
                                                <span className="inline-block w-2 h-2 rounded-full bg-orange-400"></span>
                                                Owner
                                            </p>
                                            <p className="text-sm text-gray-300">
                                                You've been granted the <span className="font-bold text-orange-300">Owner Role</span> in Nextrix.
                                            </p>
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                <div className="bg-black/30 border border-orange-400/30 rounded-lg px-4 py-2 text-xs text-orange-200">
                                                    Owner Privileges Enabled
                                                </div>
                                                <div className="bg-black/30 border border-orange-400/30 rounded-lg px-4 py-2 text-xs text-orange-200">
                                                    Access to Admin Dashboard
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {(() => {
                                    // Define special roles and their display properties
                                    const specialRoles = [
                                        {
                                            key: "admin",
                                            label: "Admin",
                                            color: "blue",
                                            gradient: "from-blue-900/40 to-orange-900/40",
                                            border: "border-blue-500/40",
                                            dot: "bg-blue-400",
                                            text: "text-blue-400",
                                            bold: "text-blue-300",
                                            badge: "text-blue-200",
                                            badgeBorder: "border-blue-400/30",
                                            privileges: [
                                                "Admin Privileges Enabled",
                                                "Access to Admin Dashboard"
                                            ]
                                        },
                                        {
                                            key: "moderator",
                                            label: "Moderator",
                                            color: "purple",
                                            gradient: "from-purple-900/40 to-blue-900/40",
                                            border: "border-purple-500/40",
                                            dot: "bg-purple-400",
                                            text: "text-purple-400",
                                            bold: "text-purple-300",
                                            badge: "text-purple-200",
                                            badgeBorder: "border-purple-400/30",
                                            privileges: [
                                                "Moderator Privileges Enabled",
                                                "Can Moderate Content"
                                            ]
                                        },
                                        {
                                            key: "staff",
                                            label: "Staff",
                                            color: "green",
                                            gradient: "from-green-900/40 to-blue-900/40",
                                            border: "border-green-500/40",
                                            dot: "bg-green-400",
                                            text: "text-green-400",
                                            bold: "text-green-300",
                                            badge: "text-green-200",
                                            badgeBorder: "border-green-400/30",
                                            privileges: [
                                                "Staff Privileges Enabled",
                                                "Access to Staff Tools"
                                            ]
                                        }
                                    ];

                                    // Find the current special role (if any, and not owner)
                                    const currentRole = specialRoles.find(r => role === r.key && !owner);

                                    if (!currentRole) return null;

                                    return (
                                        <div className={`bg-gradient-to-r ${currentRole.gradient} rounded-xl p-4 border-2 ${currentRole.border} col-span-1 sm:col-span-2 flex flex-col gap-2`}>
                                            <p className={`font-semibold ${currentRole.text} flex items-center gap-2`}>
                                                <span className={`inline-block w-2 h-2 rounded-full ${currentRole.dot}`}></span>
                                                {currentRole.label}
                                            </p>
                                            <p className="text-sm text-gray-300">
                                                You've been granted the <span className={`font-bold ${currentRole.bold}`}>{currentRole.label} Role</span> in Nextrix.
                                            </p>
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                {currentRole.privileges.map((priv, idx) => (
                                                    <div
                                                        key={priv}
                                                        className={`bg-black/30 border ${currentRole.badgeBorder} rounded-lg px-4 py-2 text-xs ${currentRole.badge}`}
                                                    >
                                                        {priv}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                    <p className="font-semibold text-gray-400">Full Name</p>
                                    <p>{firstName} {surName}</p>
                                </div>
                                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                    <p className="font-semibold text-gray-400">Email</p>
                                    <p>{email}</p>
                                </div>
                                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                    <p className="font-semibold text-gray-400">Username</p>
                                    <p>{username}</p>
                                </div>
                                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                    <p className="font-semibold text-gray-400">Title</p>
                                    <p>{title}</p>
                                </div>
                                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                    <p className="font-semibold text-gray-400">Role</p>
                                    <p className="capitalize">{role || "user"}</p>
                                </div>
                                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                    <p className="font-semibold text-gray-400">Level</p>
                                    <p className="capitalize">{userLevel || "Not Set"}</p>
                                </div>
                                <div className="bg-black/40 rounded-xl p-4 border border-white/10 sm:col-span-2">
                                    <p className="font-semibold text-gray-400">Bio</p>
                                    <p className="text-sm text-gray-300">{bio || "No bio yet."}</p>
                                </div>
                                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                    <p className="font-semibold text-gray-400">Age</p>
                                    <p>{age || "Not specified"}</p>
                                </div>
                                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                    <p className="font-semibold text-gray-400">Gender</p>
                                    <p>{gender || "Not specified"}</p>
                                </div>

                                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                    <p className="font-semibold text-gray-400">Career Roles</p>
                                    <p>
                                        {Array.isArray(careerRoles)
                                            ? careerRoles.join(", ")
                                            : (careerRoles || "Unchoosed")}
                                    </p>
                                </div>
                                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                    <p className="font-semibold text-gray-400">Sub Roles</p>
                                    <p>
                                        {Array.isArray(subRoles)
                                            ? subRoles.join(", ")
                                            : (subRoles || "No Stored Roles")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-2 rounded-lg font-semibold opacity-50 cursor-not-allowed"
                                        disabled
                                    >
                                        Edit
                                    </button>
                                    <span className="text-md text-gray-400 italic">coming soon</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "security" && (
                        <motion.div key="security" variants={fadeIn} initial="hidden" animate="visible">
                            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                Security Settings
                            </h2>
                            <p className="text-gray-400 mb-4">
                                Manage password, authentication, and session controls.
                            </p>
                            <div className="bg-black/40 p-6 rounded-xl border border-white/10">
                                <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition text-white px-6 py-3 rounded-lg font-semibold">
                                    Change Password
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "appearance" && (
                        <motion.div key="appearance" variants={fadeIn} initial="hidden" animate="visible">
                            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                                Appearance
                            </h2>
                            <p className="text-gray-400 mb-4">Theme customization (coming soon)</p>
                            <div className="bg-black/40 border border-white/10 p-6 rounded-xl opacity-50 cursor-not-allowed">
                                <p className="text-gray-500">Theme settings are not available yet.</p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "notifications" && (
                        <motion.div key="notifications" variants={fadeIn} initial="hidden" animate="visible">
                            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                Notification Preferences
                            </h2>
                            <p className="text-gray-400 mb-4">Control email and in-app notifications.</p>
                            <div className="bg-black/40 p-6 rounded-xl border border-white/10">
                                <p className="text-gray-500">Notification settings coming soon.</p>
                            </div>
                        </motion.div>
                    )}
                </main>
            </motion.div>
        </div>
    );
}
