import React, { useState, useEffect } from "react";
import useUserData from "../../../constants/data/useUserData";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import Loading from "../../../constants/components/Loading";
import NotSignedIn from "../../../constants/components/NotSignedIn";
import { db } from "../../../constants/firebase";
import { motion } from "framer-motion";


const CreateProject = () => {
    const { user, uid, firstName, surName, loading } = useUserData();

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [system, setSystem] = useState("");
    const [clientUID, setClientUID] = useState(uid || "");
    const [clientName, setClientName] = useState(
        firstName && surName ? `${firstName} ${surName}` : ""
    );
    const [disscountRate, setDisscountRate] = useState(0);
    const [details, setDetails] = useState("");
    const [notes, setNotes] = useState("");
    const [selectedPackage, setSelectedPackage] = useState("");
    const [placeNature, setPlaceNature] = useState("");
    const [bussinessType, setBussinessType] = useState("");
    const [requestStatus, setRequestStatus] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    useEffect(() => {
        if (uid) setClientUID(uid);
        if (firstName && surName) setClientName(`${firstName} ${surName}`);
    }, [uid, firstName, surName]);

    if (loading) return <Loading />;
    if (!user) return <NotSignedIn />;

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setSubmitMessage("");
        try {
            const projectId = crypto.randomUUID();
            await setDoc(doc(db, 'stock', "projects", "pending projects", projectId), {
                name,
                type,
                system,
                clientUID,
                clientName,
                selectedPackage,
                disscountRate,
                bussinessType,
                details,
                placeNature,
                notes,
                requestStatus,
                createdBy: uid,
                createdAt: new Date().toISOString(),
                status: "pending",
            });
            // Instead of overwriting, append the new projectId to the existing array
            await setDoc(
                doc(db, "users", uid),
                {
                    projectsAssociated: arrayUnion(projectId)
                },
                { merge: true }
            );
            setSubmitMessage("✅ Project created successfully!");
            setName("");
            setType("");
            setSystem("");
            setSelectedPackage("");
            setDisscountRate(0);
            setBussinessType("");
            setDetails("");
            setPlaceNature("");
            setNotes("");
            setRequestStatus(false);
        } catch (err) {
            setSubmitMessage("❌ Error creating project: " + err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <motion.div
            className="min-h-[100vh] flex justify-center items-center bg-gradient-to-b from-black via-gray-800 to-black px-6 py-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className=" w-full text-white bg-transparent mx-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-blue-400 drop-shadow-lg tracking-wide">
                    Create a New Project
                </h2>

                <form
                    onSubmit={handleProjectSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Project Name */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-300">
                            Project Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                            placeholder="Enter your project name"
                            required
                        />
                    </div>

                    {/* Type */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-300">Type</label>
                        <input
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                            placeholder="Website, logo, or design?"
                            required
                        />
                    </div>

                    {/* Business Type */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-300">
                            Business Type
                        </label>
                        <input
                            type="text"
                            value={bussinessType}
                            onChange={(e) => setBussinessType(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                            placeholder="e.g. Retail, SaaS"
                        />
                    </div>

                    {/* Place Nature */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-300">
                            Place Nature
                        </label>
                        <input
                            type="text"
                            value={placeNature}
                            onChange={(e) => setPlaceNature(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                            placeholder="e.g. Online, Physical"
                        />
                    </div>

                    {/* Project Details */}
                    <div className="col-span-2 space-y-1">
                        <label className="text-sm font-semibold text-gray-300">
                            Project Details
                        </label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm h-28 focus:outline-none focus:ring-2 focus:ring-blue-600 transition resize-none"
                            placeholder="Describe your project in detail..."
                        />
                    </div>

                    {/* Notes */}
                    <div className="col-span-2 space-y-1">
                        <label className="text-sm font-semibold text-gray-300">Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-blue-600 transition resize-none"
                            placeholder="Additional notes..."
                        />
                    </div>

                    {/* Selected Package */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-300">
                            Selected Package
                        </label>
                        <select
                            value={selectedPackage}
                            onChange={(e) => setSelectedPackage(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                        >
                            <option value="">Select a package</option>
                            <option value="Basic">Basic</option>
                            <option value="Premium">Premium</option>
                            <option value="Elite">Elite</option>
                            <option value="Nextrix">Nextrix</option>
                        </select>
                    </div>

                    {/* System */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-300">
                            System
                        </label>
                        <input
                            type="text"
                            value={system}
                            onChange={(e) => setSystem(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                            placeholder="System or platform used"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-2 mt-8 flex justify-center">
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/30 transition duration-300 disabled:opacity-50"
                        >
                            {submitLoading ? "Submitting..." : "Create Project"}
                        </button>
                    </div>

                    {/* Message */}
                    {submitMessage && (
                        <div
                            className={`col-span-2 text-center mt-4 text-sm ${submitMessage.startsWith("❌")
                                ? "text-red-500"
                                : "text-green-400"
                                }`}
                        >
                            {submitMessage}
                        </div>
                    )}
                </form>
            </div>
        </motion.div>
    );
};

export default CreateProject;
