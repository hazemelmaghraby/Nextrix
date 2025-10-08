import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../constants/firebase";
import useUserData from "../../../constants/data/useUserData";
import Loading from "../../../constants/components/Loading";
import NotSignedIn from "../../../constants/components/NotSignedIn";
import { motion } from "framer-motion";

const AccountProjectsList = () => {
    const { user, uid, loading: userLoading } = useUserData();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            if (!uid) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                // Get user doc
                const userDocRef = doc(db, "users", uid);
                const userSnap = await getDoc(userDocRef);

                if (!userSnap.exists()) {
                    setError("User document not found.");
                    setLoading(false);
                    return;
                }
                // new and diff 👇
                const userData = userSnap.data();
                const projectsAssociated = userData.projectsAssociated || [];

                if (!Array.isArray(projectsAssociated) || projectsAssociated.length === 0) {
                    setProjects([]);
                    setLoading(false);
                    return;
                }

                // Fetch all associated projects
                const projectPromises = projectsAssociated.map(async (projectId) => {
                    const projectRef = doc(db, "pending projects", projectId);
                    const projectSnap = await getDoc(projectRef);
                    if (projectSnap.exists()) {
                        return { id: projectSnap.id, ...projectSnap.data() };
                    }
                    return null;
                });

                const projectResults = (await Promise.all(projectPromises)).filter(Boolean);
                setProjects(projectResults);
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

            {projects.length === 0 ? (
                <p className="text-gray-400 text-center text-lg">
                    You don’t have any associated projects yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
                    {projects.map((project) => (
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
                                    {new Date(project.createdAt).toLocaleString()}
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
