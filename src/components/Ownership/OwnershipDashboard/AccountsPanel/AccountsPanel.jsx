import React, { useEffect, useState } from "react";
import { db } from "../../../../constants/firebase"; // adjust path
import { collection, getDocs } from "firebase/firestore";
import { ArchiveX } from 'lucide-react';
import useUserData from "../../../../constants/data/useUserData";// userData import hook
import NotSignedIn from '../../../../constants/components/NotSignedIn';
import MissingPermissions from '../../../../constants/components/missingPermissions';
import Loading from '../../../../constants/components/Loading';
import Archive from "../../../../../public/archive.png";

export default function AccountsPanel() {
    const [users, setUsers] = useState([]);
    const { user, username, owner, role, loading } = useUserData();



    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!loading && user && owner) {
                    const querySnapshot = await getDocs(collection(db, "users"));
                    const usersData = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setUsers(usersData);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, [loading, user, owner]);

    if (loading) {
        return <Loading />
    }

    if (!user) {
        <NotSignedIn>
            You must be signed in to identify your permissions.
        </NotSignedIn>
    }

    if (!owner) {
        <MissingPermissions>
            You do not have permission to access this page. Only owners/admins can view users accounts.
        </MissingPermissions>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] p-10 mt-20">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent mb-10">
                Accounts Panel
            </h1>



            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {users.map((useres) => (
                    <div
                        key={useres.id}
                        className={`bg-black/40 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition`}
                    >
                        {/* Senior / Junior badge */}
                        <div className="mb-4">
                            <span className="px-3 py-1 text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full">
                                {useres.role || "Developer"}
                            </span>
                        </div>

                        {/* Avatar */}
                        <div className="flex justify-center">
                            <img
                                src={useres.avatar || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmNTcxMmQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1hcmNoaXZlLXgtaWNvbiBsdWNpZGUtYXJjaGl2ZS14Ij48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iNSIgeD0iMiIgeT0iMyIgcng9IjEiLz48cGF0aCBkPSJNNCA4djExYTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4Ii8+PHBhdGggZD0ibTkuNSAxNyA1LTUiLz48cGF0aCBkPSJtOS41IDEyIDUgNSIvPjwvc3ZnPg=="}
                                alt={useres.firstName}
                                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/40"
                            />
                        </div>

                        {/* Name + Role */}
                        <h2 className="text-xl font-semibold text-center mt-4">
                            {useres.name}
                        </h2>
                        <p className="text-center text-gray-400">{useres.firstName} {useres.surName}</p>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4 text-center mt-6 text-sm">
                            <div>
                                <p className="text-gray-400">Working hours</p>
                                <p className="font-semibold">{useres.hours || "Full time"}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Nature of work</p>
                                <p className="font-semibold">{useres.nature || "Remote"}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Salary</p>
                                <p className="font-semibold">{useres.salary || "N/A"} $</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Cost / hr</p>
                                <p className="font-semibold">{useres.cost || "N/A"} $</p>
                            </div>
                        </div>

                        {/* View Button */}
                        <div className="mt-6">
                            <button className="w-full hover:cursor-pointer py-2 rounded-xl bg-gradient-to-r from-orange-500 to-blue-500 text-white font-medium hover:opacity-90 transition">
                                View Portfolio →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
