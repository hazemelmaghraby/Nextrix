import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../constants/firebase";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";

const AdminProjectsManagerAI = () => {
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [modalData, setModalData] = useState({
        discountRate: "",
        cost: "",
        levelRequired: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 🔹 Fetch all projects (pending + accepted + rejected)
    useEffect(() => {
        const fetchAllProjects = async () => {
            setLoading(true);

            const statuses = ["pending projects", "accepted projects", "rejected projects"];
            const allProjects = [];

            for (const status of statuses) {
                const colRef = collection(db, "stock", "projects", status);
                const snap = await getDocs(colRef);
                snap.forEach((docSnap) => {
                    allProjects.push({
                        id: docSnap.id,
                        ...docSnap.data(),
                        status,
                    });
                });
            }

            setProjects(allProjects);
            setLoading(false);
        };

        fetchAllProjects();
    }, []);

    const filteredProjects =
        filter === "all"
            ? projects
            : projects.filter((p) => p.status === `${filter} projects`);

    // 🔹 Handle Accept button
    const handleAccept = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const submitAccept = async () => {
        if (!selectedProject) return;

        try {
            const newProjectData = {
                ...selectedProject,
                ...modalData,
                status: "accepted projects",
                acceptedAt: new Date().toISOString(),
            };

            const acceptedRef = doc(db, "stock", "projects", "accepted projects", selectedProject.id);
            await setDoc(acceptedRef, newProjectData);

            // Delete from pending
            const pendingRef = doc(db, "stock", "projects", "pending projects", selectedProject.id);
            await deleteDoc(pendingRef);

            // Update local state
            setProjects((prev) =>
                prev.map((p) =>
                    p.id === selectedProject.id
                        ? { ...newProjectData }
                        : p
                )
            );

            setIsModalOpen(false);
            setModalData({ discountRate: "", cost: "", levelRequired: "" });
        } catch (error) {
            console.error("Error accepting project:", error);
        }
    };

    // 🔹 Handle Reject
    const handleReject = async (project) => {
        try {
            const rejectedRef = doc(db, "stock", "projects", "rejected projects", project.id);
            await setDoc(rejectedRef, { ...project, status: "rejected projects", rejectedAt: new Date().toISOString() });

            const pendingRef = doc(db, "stock", "projects", "pending projects", project.id);
            await deleteDoc(pendingRef);

            setProjects((prev) =>
                prev.map((p) =>
                    p.id === project.id ? { ...project, status: "rejected projects" } : p
                )
            );
        } catch (error) {
            console.error("Error rejecting project:", error);
        }
    };

    if (loading) return <p className="text-gray-400 text-center mt-20">Loading projects...</p>;

    return (
        <motion.div
            className="min-h-screen mt-20 bg-gradient-to-b from-black via-gray-950 to-black p-6 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h2 className="text-3xl font-bold text-blue-400 text-center mb-8">Admin Project Manager</h2>

            {/* Filter Controls */}
            <div className="flex justify-center gap-4 mb-8">
                {["all", "pending", "accepted", "rejected"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg border ${filter === f
                            ? "bg-blue-500 border-blue-600"
                            : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <p className="text-gray-400 text-center">No projects found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            className="bg-gray-900/80 p-6 rounded-2xl border border-gray-700 hover:border-blue-500 transition"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-xl font-semibold text-blue-400 mb-2">{project.name}</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Type: {project.type} |{" "}
                                <span
                                    className={
                                        project.status === "pending projects"
                                            ? "text-yellow-400"
                                            : project.status === "accepted projects"
                                                ? "text-green-400"
                                                : "text-red-400"
                                    }
                                >
                                    {project.status.replace(" projects", "").toUpperCase()}
                                </span>
                            </p>
                            <div className="text-sm text-gray-300 space-y-1">
                                <p><span className="font-semibold text-blue-400">Client:</span> {project.clientName}</p>
                                <p><span className="font-semibold text-blue-400">Business:</span> {project.bussinessType}</p>
                            </div>

                            {project.status === "pending projects" && (
                                <div className="flex gap-4 mt-4">
                                    <button
                                        onClick={() => handleAccept(project)}
                                        className="px-3 py-2 bg-green-600 rounded-lg hover:bg-green-700"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleReject(project)}
                                        className="px-3 py-2 bg-red-600 rounded-lg hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
                    <motion.div
                        className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <h3 className="text-xl font-semibold text-blue-400 mb-4">Accept Project</h3>

                        <div className="space-y-3">
                            <input
                                type="number"
                                placeholder="Discount Rate (%)"
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                                value={modalData.discountRate}
                                onChange={(e) => setModalData({ ...modalData, discountRate: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Cost"
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                                value={modalData.cost}
                                onChange={(e) => setModalData({ ...modalData, cost: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Level Required"
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                                value={modalData.levelRequired}
                                onChange={(e) => setModalData({ ...modalData, levelRequired: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitAccept}
                                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
                            >
                                Confirm Accept
                            </button>
                        </div>
                    </motion.div>
                </div>
            </Dialog>
        </motion.div>
    );
};

export default AdminProjectsManagerAI;
