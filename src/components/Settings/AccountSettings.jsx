import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    Shield,
    Palette,
    Bell,
    LogOut,
    User,
    Upload
} from "lucide-react";
import useUserData from "../../constants/data/useUserData";
import Loading from "../../constants/components/Loading";
import NotSignedIn from "../../constants/components/NotSignedIn";
import { auth, db } from '../../constants/firebase';
import { signOut } from 'firebase/auth';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { toast, ToastContainer } from "react-toastify";

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
    const { user, loading, firstName, surName, bio, email, userLevel, title, age, gender, username, role, subRoles, careerRoles, owner, avatar } = useUserData();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingFields, setEditingFields] = useState({
        username: username,
        firstName: firstName,
        surName: surName,
        bio: bio,
        title: title,
        age: age,
        gender: gender,
        subRoles: subRoles,
        careerRoles: careerRoles,
    });
    const [activeTab, setActiveTab] = useState("general");

    const [newAvatar, setNewAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [avatarUploadSucceeded, setAvatarUploadSucceeded] = useState(false);


    // Smart Fix For Empty Fields On Editing

    useEffect(() => {
        if (!loading && user) {
            setEditingFields({
                username: username || "",
                firstName: firstName || "",
                surName: surName || "",
                bio: bio || "",
                title: title || "",
                age: age || "",
                gender: gender || "",
                subRoles: subRoles || [],
                careerRoles: careerRoles || [],
            });
        }
    }, [loading, user, username, firstName, surName, bio, title, age, gender, subRoles, careerRoles]);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setUpdatedData((prev) => ({ ...prev, [name]: value }));
    // };

    const handleSavingChanges = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (!user) return;

            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                username: editingFields.username,
                firstName: editingFields.firstName,
                surName: editingFields.surName,
                age: editingFields.age,
                gender: editingFields.gender,
                subRoles: editingFields.subRoles,
                careerRoles: editingFields.careerRoles,
                "profileInfo.bio": editingFields.bio,
                "profileInfo.title": editingFields.title,
            });

            toast("Info Updated ✅", {
                position: 'bottom-center',
                theme: 'dark',
                autoClose: 1500,
                className: 'bg-black'
            });
            setEditing(false);
        } catch (error) {
            console.error("Failed to save changes:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loading />;

    const handleEditingBtn = () => {
        setEditing(true);
    };

    if (!user && !loading)
        return (
            <NotSignedIn>
                You must be signed in to access your account settings.
            </NotSignedIn>
        );

    const handleAvatarSave = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return alert("Please sign in first.");
        if (!newAvatar) return alert("Please select an image first.");

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("image", newAvatar);

            const apiKey = "31fd65f85db081f73371a67dd8e2042e";
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (!data.success) throw new Error("Failed to upload image to ImageBB");

            const imageUrl = data.data.url;
            setPreview(imageUrl);

            await setDoc(
                doc(db, "users", currentUser.uid),
                { avatarURL: imageUrl },
                { merge: true }
            );

            setAvatarUploadSucceeded(true);
        } catch (err) {
            console.error("Error saving avatar:", err);
            alert("Error uploading avatar.");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setNewAvatar(file);
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
    };

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
                        {avatarUploadSucceeded && (
                            <>
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                                    <div className="bg-gray-900 rounded-xl shadow-lg p-8 max-w-sm w-full border border-white/10">
                                        <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                                            Avatar Updated Successfully
                                        </h3>
                                        <p className="mb-6 text-gray-300">
                                            Would you like to return to Account Settings or continue editing your profile?
                                        </p>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
                                                onClick={() => setAvatarUploadSucceeded(false)}
                                            >
                                                Continue Editing
                                            </button>
                                            <button
                                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
                                                onClick={() => {
                                                    setAvatarUploadSucceeded(false);
                                                    window.location.href = '/accountSettings'
                                                }}
                                            >
                                                Return to Account Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
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
                                            color: "red",
                                            gradient: "from-red-900/40 to-orange-900/40",
                                            border: "border-red-500/40",
                                            dot: "bg-red-400",
                                            text: "text-red-400",
                                            bold: "text-red-300",
                                            badge: "text-red-200",
                                            badgeBorder: "border-red-400/30",
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
                                {editing ? (<>
                                    <form
                                        className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
                                        onSubmit={handleSavingChanges}>
                                        <div className="bg-black/40 rounded-xl p-4 border border-white/10 flex flex-col items-center">
                                            <label className="block font-semibold text-gray-400 mb-2" htmlFor="profilePic">
                                                Profile Picture
                                            </label>
                                            <div className="flex flex-col justify-center items-center gap-2 w-full">
                                                <div className="relative w-32 h-32 flex items-center justify-center group">
                                                    {preview ? (
                                                        <img
                                                            src={preview}
                                                            alt="Avatar Preview"
                                                            className="w-32 h-32 rounded-full border-4 border-blue-500/40 object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-32 h-32 rounded-full bg-black/40 border-4 border-dashed border-blue-500/30 flex items-center justify-center text-gray-500 text-3xl group-hover:border-blue-400 transition-all">
                                                            <img
                                                                src={
                                                                    editingFields.avatar ||
                                                                    avatar
                                                                }
                                                                alt="Profile Preview"
                                                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
                                                            />
                                                        </div>
                                                    )}
                                                    <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer shadow-md transition">
                                                        <Upload className="w-4 h-4 text-white" />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleAvatarSave}
                                                    disabled={uploading}
                                                    className={`px-5 py-2.5 rounded-lg text-white font-semibold transition-all ${uploading
                                                        ? "bg-gray-600 cursor-not-allowed"
                                                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-600 hover:to-blue-600 shadow-md hover:shadow-lg hover:shadow-blue-500/30"
                                                        }`}
                                                >
                                                    {uploading ? "Uploading..." : "Save Avatar"}
                                                </button>
                                                {/* <img
                                                    src={
                                                        editingFields.avatar ||
                                                        avatar
                                                    }
                                                    alt="Profile Preview"
                                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
                                                />
                                                <input
                                                    type="file"
                                                    id="profilePic"
                                                    name="profilePic"
                                                    accept="image/*"
                                                    className="w-full text-gray-200 mt-2"
                                                    onChange={handleAvatarSave}
                                                /> */}
                                            </div>
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                            <label className="block font-semibold text-gray-400 mb-1" htmlFor="firstName">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                id="firstName"
                                                value={editingFields.firstName || ""}
                                                onChange={(e) =>
                                                    setEditingFields({ ...editingFields, [e.target.name]: e.target.value })
                                                }
                                                className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"
                                                required
                                            />

                                        </div>
                                        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                            <label className="block font-semibold text-gray-400 mb-1" htmlFor="surName">Surname</label>
                                            <input
                                                type="text"
                                                name="surName"
                                                id="surName"
                                                value={editingFields.surName}
                                                onChange={(e) =>
                                                    setEditingFields({ ...editingFields, [e.target.name]: e.target.value })}
                                                className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"
                                                required
                                            />
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                            <label className="block font-semibold text-gray-400 mb-1" htmlFor="title">Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                id="title"
                                                value={editingFields.title}
                                                onChange={(e) =>
                                                    setEditingFields({ ...editingFields, [e.target.name]: e.target.value })}
                                                className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"
                                                placeholder="Job, degree, rank..."
                                            />
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                            <label className="block font-semibold text-gray-400 mb-1" htmlFor="age">Age</label>
                                            <input
                                                type="number"
                                                name="age"
                                                id="age"
                                                value={editingFields.age}
                                                onChange={(e) =>
                                                    setEditingFields({ ...editingFields, [e.target.name]: e.target.value })}
                                                className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"
                                                min={0}
                                                max={150}
                                            />
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                            <label className="block font-semibold text-gray-400 mb-1" htmlFor="gender">Gender</label>
                                            <input
                                                type="text"
                                                name="gender"
                                                id="gender"
                                                value={editingFields.gender}
                                                onChange={(e) =>
                                                    setEditingFields({ ...editingFields, [e.target.name]: e.target.value })}
                                                className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"
                                                placeholder="Male, Female, Non-binary, etc."
                                            />
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                            <label className="block font-semibold text-gray-400 mb-1" htmlFor="careerRoles">Career Roles</label>
                                            <input
                                                type="text"
                                                name="careerRoles"
                                                id="careerRoles"
                                                value={editingFields.careerRoles}
                                                onChange={(e) =>
                                                    setEditingFields({ ...editingFields, [e.target.name]: e.target.value })}
                                                className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"
                                                placeholder="Separate with commas"
                                            />
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                                            <label className="block font-semibold text-gray-400 mb-1" htmlFor="subRoles">Sub Roles</label>
                                            <input
                                                type="text"
                                                name="subRoles"
                                                id="subRoles"
                                                value={editingFields.subRoles}
                                                onChange={(e) =>
                                                    setEditingFields({ ...editingFields, [e.target.name]: e.target.value })}
                                                className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"
                                                placeholder="Separate with commas"
                                            />
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-4 border border-white/10 sm:col-span-2">
                                            <label className="block font-semibold text-gray-400 mb-1" htmlFor="bio">Bio</label>
                                            <textarea
                                                name="bio"
                                                id="bio"
                                                value={editingFields.bio}
                                                onChange={(e) =>
                                                    setEditingFields({ ...editingFields, [e.target.name]: e.target.value })}
                                                className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"
                                                rows={3}
                                                placeholder="A little about you..."
                                            />
                                        </div>
                                        <div className="flex gap-2 sm:col-span-2 items-center mt-2">
                                            <button
                                                className={`bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-2 rounded-lg font-semibold ${saving ? "opacity-40" : ""}`}
                                                type="submit"
                                                disabled={saving}
                                            >
                                                {saving ? "Saving..." : "Save"}
                                            </button>
                                            <button
                                                type="button"
                                                className="px-6 py-2 bg-gray-600 rounded-lg text-white font-semibold hover:bg-gray-500 transition"
                                                onClick={() => setEditing(false)}
                                                disabled={saving}
                                            >
                                                Cancel
                                            </button>

                                        </div>
                                    </form>
                                </>) : (<>
                                    <div className="flex items-center gap-4 bg-black/40 rounded-xl p-4 border border-white/10 sm:col-span-2">
                                        <img
                                            src={avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent((firstName || "") + " " + (surName || ""))}
                                            alt="Avatar"
                                            className="w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-400">Avatar</p>
                                            <p className="text-sm text-gray-300">Profile picture displayed across Nextrix</p>
                                        </div>
                                    </div>
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
                                            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-2 rounded-lg font-semibold cursor-pointer"
                                            onClick={() => handleEditingBtn()}
                                        >
                                            Edit
                                        </button>
                                        {/* <span className="text-md text-gray-400 italic">coming soon</span> */}
                                    </div></>)}
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
            <ToastContainer />
        </div>
    );
}
