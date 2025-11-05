import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../constants/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import DefaultPng from '/man.png'
import useUserData from "../../constants/data/useUserData";
import NotSignedIn from "../../constants/components/NotSignedIn";
import Loading from "../../constants/components/Loading";

const AccountsList = () => {
    const [users, setUsers] = useState([]);
    const { user, loading } = useUserData();



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

    if (!user && !loading) {
        return (
            <NotSignedIn />
        )
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-25">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-10 text-center text-blue-400">
                    🌐 Available Developers
                </h2>

                {users.length === 0 ? (
                    <p className="text-center text-gray-400">No accounts found.</p>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {users
                            .slice() // don't mutate state
                            .sort((a, b) => {
                                // Sort order: owner (true), admin, moderator, premium (true), rest
                                const priority = u => {
                                    if (u.owner) return 0;
                                    if (u.role === 'admin') return 1;
                                    if (u.role === 'moderator') return 2;
                                    if (u.premium) return 3; //premuim boolean
                                    return 4; // normal user
                                };
                                return priority(a) - priority(b);
                            })
                            .map((u, index) => (
                                <motion.div
                                    key={u.id}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    className={`relative overflow-hidden border ${u.owner ? 'border-amber-400 shadow-amber-500 shadow-md'
                                        : u.role === 'admin' ? 'border-red-500 shadow-red-500 shadow-md'
                                            : u.role === 'moderator' ? 'border-purple-500 shadow-purple-500 shadow-md'
                                                : u.premium ? 'border-yellow-200 shadow-yellow-500 shadow-md'
                                                    : 'border-white/10 shadow-lg hover:border-blue-500/40 hover:shadow-blue-500/20 transition-all duration-300'} rounded-2xl p-5`}
                                >
                                    {/* Badge for special roles */}
                                    {(u.owner || u.role === 'admin' || u.role === 'moderator' || u.premium) && (
                                        <div
                                            className={`absolute top-3 right-3 z-20 px-3 py-1 rounded-full text-xs font-bold tracking-wider shadow-md ${u.owner
                                                ? 'bg-transparent border-1 border-amber-500'
                                                : u.role === 'admin'
                                                    ? 'bg-transparent text-white border-1 border-red-600'
                                                    : u.role === 'moderator' ? 'bg-transparent text-white border-1 border-purple-700'
                                                        : u.premium ? 'bg-transparent  text-white border-1 border-yellow-100'
                                                            : ''
                                                }`}
                                        >
                                            {u.owner ? 'Owner' : u.role == 'admin' || u.role == 'moderator' ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : u.premium ? 'Premium' : '.'}
                                        </div>
                                    )}


                                    {(u.owner || u.role === 'admin' || u.role === 'moderator' || u.premium) && (
                                        <div
                                            className="absolute inset-0 z-0 pointer-events-none"
                                            aria-hidden="true"
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div
                                                className="drop-animation"
                                                style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    background:
                                                        u.owner
                                                            ? "radial-gradient(circle, rgba(255,215,0,0.6) 5%, rgba(255,215,0,0.25) 20%, transparent 70%)"
                                                            : u.role === "admin"
                                                                ? "radial-gradient(circle, rgba(255,0,0,0.6) 5%, rgba(255,0,0,0.25) 40%, transparent 70%)"
                                                                : u.role === 'moderator'
                                                                    ? "radial-gradient(circle, rgba(128,0,255,0.6) 5%, rgba(128,0,255,0.25) 40%, transparent 70%)"
                                                                    : u.premium
                                                                        ? "linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.2) 5%, rgba(251,191,36,0.5) 5%, rgba(251,191,36,0.2) 30%, transparent 100%)"
                                                                        : 'text-red',
                                                    transformOrigin: "center",
                                                    animation: `${u.owner
                                                        ? "spreadGold 3s ease-in-out infinite"
                                                        : u.role === "admin"
                                                            ? "spreadRed 3s ease-in-out infinite"
                                                            : u.role === 'moderator'
                                                                ? "spreadPurple 3s ease-in-out infinite"
                                                                : u.premium
                                                                    ? 'moveCyanBar 2s ease-in-out infinite'
                                                                    : ''
                                                        } `,
                                                    filter: "blur(6px)",
                                                }}
                                            />

                                            <style>
                                                {`
        @keyframes spreadGold {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.3;
          }
          100% {
            transform: scale(0);
            opacity: 0.8;
          }
        }

        @keyframes spreadRed {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.3;
          }
          100% {
            transform: scale(0);
            opacity: 0.8;
          }
        }

        @keyframes spreadPurple {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.3;
          }
          100% {
            transform: scale(0);
            opacity: 0.8;
          }
        }
        @keyframes moveCyanBar {
          0% {
            transform: translateY(100%);
            opacity: 0.2;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0.2;
          }
        }
                                            </style>
      `}
                                            </style>
                                        </div>
                                    )}


                                    {/* Overlay the content above the animated background */}
                                    <div className={u.owner || u.role == 'admin' || u.role === 'moderator' || u.premium ? "relative z-10" : ""}>
                                        {/* Avatar */}
                                        <div className="flex justify-center mb-4">
                                            <img
                                                src={
                                                    u.avatarURL ||
                                                    u.photoURL ||
                                                    DefaultPng
                                                }
                                                alt="Default avatar"
                                                className="w-20 h-20 rounded-full border border-white/20 object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Name & Role */}
                                    <h3 className="text-xl font-semibold text-center relative z-10">
                                        {u.firstName || u.name || "Unnamed User"} {u.surName}
                                    </h3>

                                    <p className={`text-center font-bold 
                                    ${u.owner ? 'text-bold text-amber-200'
                                            : u.role === 'admin' ? 'text-bold text-red-200'
                                                : 'text-gray-400'} 
                                                text-sm relative z-10`}>
                                        {u.profileInfo.title || "No title specified"}
                                    </p>

                                    {/* Level */}
                                    {u.profileInfo.level && (
                                        <p className="text-center text-sm mt-1 text-blue-400 relative z-10">
                                            Level: {u.profileInfo.level}
                                        </p>
                                    )}

                                    {/* Bio */}
                                    {u.profileInfo.bio && (
                                        <p className="text-gray-400 text-sm mt-3 text-center line-clamp-3 relative z-10">
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
                                            className={`px-4 py-2 ${u.owner ? 'bg-transparent text-amber-400 border border-amber-400 rounded-2xl hover:border-transparent hover:text-black hover:bg-amber-400'
                                                : u.role === 'admin' ? 'text-red-400 border border-red-400 rounded-2xl hover:border-transparent hover:text-black hover:bg-red-400'
                                                    : u.role === 'moderator' ? 'text-purple-400 border border-purple-400 rounded-2xl hover:border-transparent hover:text-black hover:bg-purple-400'
                                                        : 'bg-blue-600 hover:bg-blue-500'}   
                                                        rounded-lg text-sm font-semibold transition`}
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                </motion.div>
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountsList;
