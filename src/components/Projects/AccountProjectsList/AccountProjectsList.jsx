import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../constants/firebase";
import useUserData from "../../../constants/data/useUserData";
import Loading from "../../../constants/components/Loading";
import NotSignedIn from "../../../constants/components/NotSignedIn";
import { motion } from "framer-motion";

const AccountProjectsList = () => {
    const { user, uid, loading: userLoading } = useUserData();

    const [pendingProjects, setPendingProjects] = useState([]);
    const [acceptedProjects, setAcceptedProjects] = useState([]);
    const [rejectedProjects, setRejectedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("All"); // "All" | "Pending" | "Accepted" | "Rejected"

    useEffect(() => {
        const fetchProjects = async () => {
            if (!uid) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                // Step 1: Get user document
                const userDocRef = doc(db, "users", uid);
                const userSnap = await getDoc(userDocRef);

                if (!userSnap.exists()) {
                    setError("User document not found.");
                    setLoading(false);
                    return;
                }

                const userData = userSnap.data();
                const projectsAssociated = userData.projectsAssociated || [];

                if (projectsAssociated.length === 0) {
                    setPendingProjects([]);
                    setAcceptedProjects([]);
                    setRejectedProjects([]);
                    setLoading(false);
                    return;
                }
                // ================================== // Advanced ======================================
                // Helper to fetch from specific subcollection
                const fetchFromSubcollection = async (subcollectionName) => {
                    const projectPromises = projectsAssociated.map(async (projectId) => {
                        const ref = doc(db, "stock", "projects", subcollectionName, projectId);
                        const snap = await getDoc(ref);
                        if (snap.exists()) {
                            return { id: snap.id, ...snap.data() };
                        }
                        return null;
                    });
                    return (await Promise.all(projectPromises)).filter(Boolean);
                };

                // Step 2: Fetch from each subcollection
                const [pending, accepted, rejected] = await Promise.all([
                    fetchFromSubcollection("pending projects"),
                    fetchFromSubcollection("accepted projects"),
                    fetchFromSubcollection("rejected projects"),
                ]);

                // Step 3: Set state
                setPendingProjects(pending);
                setAcceptedProjects(accepted);
                setRejectedProjects(rejected);
                // ======================================================================================== 
            } catch (err) {
                console.error(err);
                setError("Failed to fetch projects.");
            } finally {
                setLoading(false);
            }
        };

        if (!userLoading) fetchProjects();
    }, [uid, userLoading]);

    if (userLoading || loading) return <Loading />;
    if (!user) return <NotSignedIn />;

    // 🧩 Combine based on filter
    let displayedProjects = [];
    if (filter === "All")
        displayedProjects = [...pendingProjects, ...acceptedProjects, ...rejectedProjects];
    else if (filter === "Pending") displayedProjects = pendingProjects;
    else if (filter === "Accepted") displayedProjects = acceptedProjects;
    else if (filter === "Rejected") displayedProjects = rejectedProjects;

    return (
        <motion.div
            className="min-h-[100vh] mt-20 bg-gradient-to-b from-black via-gray-950 to-black p-6 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h2 className="text-3xl font-bold text-blue-400 drop-shadow-lg mb-8 text-center">
                Your Associated Projects
            </h2>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {/* 🔽 Filter Buttons */}
            <div className="mb-8 flex flex-wrap justify-center gap-3">
                {["All", "Pending", "Accepted", "Rejected"].map((item) => (
                    <button
                        key={item}
                        onClick={() => setFilter(item)}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${filter === item
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {displayedProjects.length === 0 ? (
                <p className="text-gray-400 text-center text-lg">
                    No {filter !== "All" ? filter.toLowerCase() : ""} projects found.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
                    {displayedProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            className="bg-gray-900/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-6 text-white hover:border-blue-500/40 transition"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-xl font-semibold text-blue-400 mb-2">
                                {project.name}
                            </h3>
                            <p className="text-sm text-gray-400 mb-4 italic">
                                Type: {project.type} | Status:{" "}
                                <span
                                    className={
                                        project.status === "pending"
                                            ? "text-yellow-400"
                                            : project.status === "rejected"
                                                ? "text-red-400"
                                                : "text-green-400"
                                    }
                                >
                                    {project.status}
                                </span>
                            </p>

                            <div className="space-y-1 text-sm text-gray-300">
                                <p>
                                    <span className="font-semibold text-blue-400">
                                        Business Type:
                                    </span>{" "}
                                    {project.bussinessType || "N/A"}
                                </p>
                                <p>
                                    <span className="font-semibold text-blue-400">
                                        Place Nature:
                                    </span>{" "}
                                    {project.placeNature || "N/A"}
                                </p>
                                <p>
                                    <span className="font-semibold text-blue-400">
                                        Package:
                                    </span>{" "}
                                    {project.selectedPackage || "N/A"}
                                </p>
                                <p>
                                    <span className="font-semibold text-blue-400">
                                        System:
                                    </span>{" "}
                                    {project.system || "N/A"}
                                </p>
                                <p>
                                    <span className="font-semibold text-blue-400">
                                        Client Name:
                                    </span>{" "}
                                    {project.clientName}
                                </p>
                                <p>
                                    <span className="font-semibold text-blue-400">
                                        Created At:
                                    </span>{" "}
                                    {project.createdAt
                                        ? new Date(project.createdAt).toLocaleString()
                                        : "N/A"}
                                </p>
                            </div>

                            {project.details && (
                                <p className="mt-4 text-gray-300 text-sm">
                                    <span className="font-semibold text-blue-400">Details:</span>{" "}
                                    {project.details}
                                </p>
                            )}

                            {project.notes && (
                                <p className="mt-2 text-gray-400 text-sm">
                                    <span className="font-semibold text-blue-400">Notes:</span>{" "}
                                    {project.notes}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default AccountProjectsList;
