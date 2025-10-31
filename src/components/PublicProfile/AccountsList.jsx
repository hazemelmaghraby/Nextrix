import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../constants/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

const AccountsList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(db, "users"));
            const userList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(userList);
        };

        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-12">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-10 text-center text-blue-400">
                    🌐 Available Developers
                </h2>

                {users.length === 0 ? (
                    <p className="text-center text-gray-400">No accounts found.</p>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {users.map((u, index) => (
                            <motion.div
                                key={u.id}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-900/70 border border-white/10 rounded-2xl p-5 shadow-lg hover:border-blue-500/40 hover:shadow-blue-500/20 transition-all duration-300"
                            >
                                {/* Avatar */}
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={
                                            u.avatar ||
                                            u.photoURL ||
                                            "/default-avatar.png"
                                        }
                                        alt="User Avatar"
                                        className="w-20 h-20 rounded-full border border-white/20 object-cover"
                                    />
                                </div>

                                {/* Name & Role */}
                                <h3 className="text-xl font-semibold text-center">
                                    {u.firstName || u.name || "Unnamed User"} {u.surName}
                                </h3>

                                <p className="text-center text-gray-400 text-sm">
                                    {u.profileInfo.title || "No title specified"}
                                </p>

                                {/* Level */}
                                {u.profileInfo.level && (
                                    <p className="text-center text-sm mt-1 text-blue-400">
                                        Level: {u.profileInfo.level}
                                    </p>
                                )}

                                {/* Bio */}
                                {u.profileInfo.bio && (
                                    <p className="text-gray-400 text-sm mt-3 text-center line-clamp-3">
                                        {u.profileInfo.bio}
                                    </p>
                                )}

                                {/* Skills */}
                                {u.profileInfo.skills && Array.isArray(u.profileInfo.skills) && u.profileInfo.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-4 justify-center">
                                        {u.profileInfo.skills.slice(0, 4).map((skill, i) => (
                                            <span
                                                key={i}
                                                className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-2 py-1 text-xs rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {u.profileInfo.skills.length > 4 && (
                                            <span className="text-gray-500 text-xs">+{u.skills.length - 4}</span>
                                        )}
                                    </div>
                                )}

                                {/* View Profile Button */}
                                <div className="flex justify-center mt-6">
                                    <Link
                                        to={`/accs/${u.id}`}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountsList;
