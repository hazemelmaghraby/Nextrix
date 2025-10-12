import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../../constants/firebase';
import { getDoc, doc, setDoc, addDoc, collection, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import useUserData from '../../../constants/data/useUserData';
import MissingPermissions from '../../../constants/components/missingPermissions';
import Loading from '../../../constants/components/Loading';
import NotSignedIn from '../../../constants/components/NotSignedIn';
import { XCircle } from "lucide-react";
import { Link } from 'react-router';



const ProjectsList = () => {

    const lorem = ['Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor deleniti veniam architecto, impedit, provident quidem qui repudiandae culpa voluptatem possimus illum quibusdam esse ad officiis officia nobis, dolores optio ullam.']

    const { user, uid, owner, role, loading, firstName, surName } = useUserData();
    const [pendingProjects, setPendingProjects] = useState([]);
    const [acceptedProjects, setAcceptedProjects] = useState([]);
    const [rejectedProjects, setRejectedProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [acceptanceModalIsOpened, setAcceptanceModalIsOpened] = useState(false);
    const [rejectionModalIsOpened, setRejectionModalIsOpened] = useState(false);
    const [projectDeletionModalIsOpen, setProjectDeletionModalIsOpen] = useState(false);


    // modal input states
    const [discountRate, setDiscountRate] = useState('');
    const [cost, setCost] = useState('');
    const [levelRequired, setLevelRequired] = useState('');
    const [expectedDuration, setExpectedDuration] = useState('');
    const [projectLeader, setProjectLeader] = useState('');
    const [team, setTeam] = useState('');

    useEffect(() => {
        // Only fetch if user exists and is owner or admin,
        // do not return anything except a cleanup function
        if (!user || loading) return;

        let isMounted = true; // flag to avoid setting state on unmounted

        const fetchProjectsData = async () => {
            if ((user && owner) || (user && role === 'admin')) {
                const projects = await getDoc(doc(db, "stock", 'projects'));
                if (projects.exists) {
                    // Helper function to fetch all docs from a subcollection
                    const fetchProjects = async (collectionStatus) => {
                        const colRef = collection(db, 'stock', 'projects', collectionStatus);
                        const querySnap = await getDocs(colRef);
                        return querySnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
                    };

                    const pendingProjects = await fetchProjects('pending projects');
                    const acceptedProjects = await fetchProjects('accepted projects');
                    const rejectedProjects = await fetchProjects('rejected projects');
                    if (isMounted) {
                        setPendingProjects(pendingProjects);
                        setAcceptedProjects(acceptedProjects);
                        setRejectedProjects(rejectedProjects);
                    }
                }
            }
        };

        fetchProjectsData();

        return () => {
            isMounted = false;
        };
    }, [user, role, owner, loading]);

    const handleAcceptance = (project) => {
        setSelectedProject(project)
        setAcceptanceModalIsOpened(true);
    };

    const handleSubmition = async (e) => {
        e.preventDefault();
        if (!selectedProject) return;
        try {
            const acceptedProjectDoc = doc(
                db, 'stock', 'projects', 'accepted projects', selectedProject.id
            );

            await setDoc(acceptedProjectDoc, {
                ...selectedProject,
                discountRate,
                cost,
                levelRequired,
                expectedDuration,
                projectLeader,
                team,
                status: "accepted",
                acceptedAt: serverTimestamp(),
                acceptedByInUID: uid,
                acceptedByName: firstName + " " + surName
            });

            // Remove from pending collection
            const pendingProjectRef = doc(
                db,
                "stock",
                "projects",
                "pending projects",
                selectedProject.id
            );
            await deleteDoc(pendingProjectRef);

            // Close modal and reset
            setAcceptanceModalIsOpened(false);
            setSelectedProject(null);
            setDiscountRate("");
            setCost("");
            setLevelRequired("");

        } catch (error) {
            console.error("Error accepting project:", error);
            alert("Failed to accept project.");
        }
    }

    const handleRejectionBtn = (project) => {
        setSelectedProject(project)
        setRejectionModalIsOpened(true);
    }

    const handleRejectionModal = async (e) => {
        e.preventDefault();
        if (!selectedProject) {
            return
        }

        try {
            const rejectedProjectDocs = doc(db, 'stock', 'projects', 'rejected projects', selectedProject.id);
            await setDoc(rejectedProjectDocs, {
                ...selectedProject,
                rejectedBy: uid,
                rejectorName: firstName + " " + surName,
                rejectedAt: serverTimestamp(),
                status: 'rejected'
            })

            // Remove from pending collection
            const pendingProjectRef = doc(
                db,
                "stock",
                "projects",
                "pending projects",
                selectedProject.id
            );
            await deleteDoc(pendingProjectRef);
            window.location.reload();

        } catch (err) {
            alert('error: check the console')
            console.log(`error : ${err}`);
        }
    }

    const handleProjectDeletion = (project) => {
        setSelectedProject(project)
        setProjectDeletionModalIsOpen(true);
    }

    const handleDeletionBtn = async (e) => {
        e.preventDefault();
        if (!selectedProject) return null;
        if (owner) {
            try {
                const rejectedProjectDoc = doc(db, 'stock', 'projects', 'rejected projects', selectedProject.id);
                await deleteDoc(rejectedProjectDoc);
                window.location.reload();
            } catch (err) {
                console.log(`error :${err}`)
            }
        } else {
            alert('you are not authorized for this action')
            setProjectDeletionModalIsOpen(false);
        }

    }

    return (
        <div className="p-6 mt-30">
            <h2 className="text-2xl font-bold mb-4 text-blue-500">All Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Pending Projects */}
                <div className="bg-[#0a0a0f] rounded-2xl shadow-lg p-5 border border-[#1f1f2e] transition-all duration-300">
                    <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        Pending Projects
                    </h3>

                    {pendingProjects.length === 0 ? (
                        <p className="text-gray-400 text-sm italic">No pending projects.</p>
                    ) : (
                        <ul className="space-y-5">
                            {pendingProjects.map((project) => (
                                <li
                                    key={project.id}
                                    className="relative bg-[#11111a] border border-[#2b2b3c] rounded-xl p-5 hover:border-blue-600 hover:shadow-[0_0_20px_rgba(0,122,255,0.2)] transition-all duration-300"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-lg font-semibold text-white">
                                            {project.name || "Untitled Project"}
                                        </h4>
                                    </div>

                                    {/* Core Info */}
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-500 inline">Client:</span>
                                            <br />
                                            <Link
                                                to={`/accs/${project.clientUID}`}
                                                className="text-blue-400 hover:underline"
                                            >
                                                {project.clientName}
                                            </Link>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Business Type:</span>
                                            <p className="text-white">{project.bussinessType || "N/A"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Project Type:</span>
                                            <p className="text-white">{project.type || "N/A"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">System:</span>
                                            <p className="text-white">{project.system || "N/A"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Package:</span>
                                            <p className="text-white">{project.selectedPackage || "Standard"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Discount:</span>
                                            <p className="text-white">{project.discountRate ?? 0}%</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Place Nature:</span>
                                            <p className="text-white">{project.placeNature || "Not specified"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Created:</span>
                                            <p className="text-white text-xs">{new Date(project.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="my-4 border-t border-[#1f1f2e]"></div>

                                    {/* Details */}
                                    <div className="mt-2">
                                        <p className="text-gray-500 mb-1">Details:</p>
                                        <div className="bg-[#0f0f17] border border-blue-900/30 p-3 rounded-lg max-h-32 overflow-y-auto text-gray-300 text-xs leading-relaxed">
                                            {project.details || "No details provided."}
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="mt-3">
                                        <span className="text-gray-500 block">Notes:</span>
                                        <div className="bg-[#0f0f17] border border-[#2b2b3c] p-3 rounded-lg text-gray-300 text-xs leading-relaxed">
                                            {project.notes && project.notes !== "nulling" ? project.notes : "No notes added."}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-6">
                                        <span className="text-xs text-gray-500">ID: {project.id}</span>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleAcceptance(project)}
                                                className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleRejectionBtn(project)}
                                                className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-300"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4 bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold border border-blue-700/50">
                                        Pending
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Accepted Projects */}
                <div className="bg-[#0a0a0f] rounded-2xl shadow-lg p-5 border border-[#1f1f2e] transition-all duration-300">
                    <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Accepted Projects
                    </h3>

                    {acceptedProjects.length === 0 ? (
                        <p className="text-gray-400 text-sm italic">No accepted projects yet.</p>
                    ) : (
                        <ul className="space-y-5">
                            {acceptedProjects.map((project) => (
                                <li
                                    key={project.id}
                                    className="relative bg-[#11111a] border border-[#2b2b3c] rounded-xl p-5 hover:border-green-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all duration-300"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-lg font-semibold text-white">
                                            {project.name || "Untitled Project"}
                                        </h4>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-500">Client:</span>
                                            <p className="text-white">{project.clientName || "Unknown"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Business Type:</span>
                                            <p className="text-white">{project.bussinessType || "N/A"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Project Type:</span>
                                            <p className="text-white">{project.type || "N/A"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">System:</span>
                                            <p className="text-white">{project.system || "N/A"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Package:</span>
                                            <p className="text-white">{project.selectedPackage || "Standard"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Cost:</span>
                                            <p className="text-white">${project.cost || "0"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Discount Rate:</span>
                                            <p className="text-white">{project.discountRate ?? 0}%</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Expected Duration:</span>
                                            <p className="text-white">{project.expectedDuration || "Not set"} days</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Project Leader:</span>
                                            <p className="text-white">{project.projectLeader || "Unassigned"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Accepted By:</span>
                                            <p className="text-white">{project.acceptedByName || "Unknown"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Accepted At:</span>
                                            <p className="text-white text-xs">
                                                {project.acceptedAt
                                                    ? new Date(project.acceptedAt).toLocaleString()
                                                    : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Created At:</span>
                                            <p className="text-white text-xs">
                                                {project.createdAt
                                                    ? new Date(project.createdAt).toLocaleString()
                                                    : "Unknown"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="my-4 border-t border-[#1f1f2e]"></div>

                                    {/* Details */}
                                    <div className="mt-2">
                                        <p className="text-gray-500 mb-1">Details:</p>
                                        <div className="bg-[#0f0f17] border border-green-900/30 p-3 rounded-lg max-h-32 overflow-y-auto text-gray-300 text-xs leading-relaxed">
                                            {project.details || "No description available."}
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="mt-3">
                                        <span className="text-gray-500 block">Notes:</span>
                                        <div className="bg-[#0f0f17] border border-[#2b2b3c] p-3 rounded-lg text-gray-300 text-xs leading-relaxed">
                                            {project.notes && project.notes !== "nulling"
                                                ? project.notes
                                                : "No notes available."}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center mt-6">
                                        <span className="text-xs text-gray-500">ID: {project.id}</span>
                                        <span className="text-green-500 text-sm font-semibold">
                                            {project.status?.toUpperCase() || "ACCEPTED"}
                                        </span>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4 bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-xs font-semibold border border-green-700/50">
                                        Accepted
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Rejected Projects */}
                <div className="bg-[#0a0a0f] rounded-2xl shadow-lg p-5 border border-[#1f1f2e]  transition-all duration-300">
                    <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        Rejected Projects
                    </h3>
                    {rejectedProjects.length === 0 ? (
                        <p className="text-gray-500">No rejected projects.</p>
                    ) : (
                        <ul className="space-y-5">
                            {rejectedProjects.map(project => (
                                <div
                                    key={project.id}
                                    className="relative bg-[#11111a] border border-[#2b2b3c] rounded-xl p-5 hover:border-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-lg font-semibold tracking-wide text-white">{project.name}</h2>
                                    </div>

                                    {/* Core Info */}
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-gray-500">📦 Type</p>
                                            <p className="text-gray-200">{project.type}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">🏢 Business Type</p>
                                            <p className="text-gray-200">{project.bussinessType}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">🌍 Place</p>
                                            <p className="text-gray-200">{project.placeNature}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">💰 Package</p>
                                            <p className="text-gray-200">{project.selectedPackage}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">📆 Created At</p>
                                            <p className="text-gray-200">
                                                {project.createdAt
                                                    ? new Date(project.createdAt).toLocaleString()
                                                    : "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">⛔ Rejected At</p>
                                            <p className="text-gray-200">
                                                {project.rejectedAt?.seconds
                                                    ? new Date(project.rejectedAt.seconds * 1000).toLocaleString()
                                                    : "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="my-4 border-t border-red-900/40"></div>

                                    {/* Client Info */}
                                    <div className="text-sm space-y-2">
                                        <p>
                                            <span className="text-gray-500">👤 Client:</span>{" "}
                                            <span className="text-gray-300">{project.clientName}</span>
                                        </p>
                                        <p>
                                            <span className="text-gray-500">❌ Rejected By:</span>{" "}
                                            <span className="text-red-400 font-medium">
                                                {project.rejectorName || "Unknown"}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="text-gray-500">💬 Notes:</span>{" "}
                                            <span className="text-gray-400 italic">{project.notes}</span>
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-4">
                                        <p className="text-gray-500 mb-1">🧾 Details:</p>
                                        <div className="bg-[#0f0f17] border border-red-900/30 p-3 rounded-lg max-h-32 overflow-y-auto text-gray-300 text-xs leading-relaxed">
                                            {project.details}
                                        </div>
                                        <button
                                            onClick={() => handleProjectDeletion(project)}
                                            className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-300 mt-4 hover:cursor-pointer"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4 bg-red-900/30 text-red-300 px-3 py-1 rounded-full text-xs font-semibold border border-red-700/50">
                                        Rejected
                                    </div>
                                </div>
                            ))}
                        </ul>
                    )}
                </div>
                {acceptanceModalIsOpened && (
                    <>
                        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                            <div className="bg-[#0a0a0f] border border-[#1f1f2e] rounded-2xl shadow-xl p-6 max-w-md w-full text-white">
                                <h2 className="text-lg font-semibold mb-4 text-white">Accept Project</h2>
                                <form className="space-y-4" onSubmit={handleSubmition}>
                                    <div>
                                        <label className="block text-gray-300 font-medium mb-1" htmlFor="project-leader">Project Leader</label>
                                        <input
                                            id="project-leader"
                                            className="w-full rounded-lg border border-[#2b2b3c] bg-[#11111a] px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            type="text"
                                            placeholder="Enter project leader name"
                                            value={projectLeader}
                                            onChange={(e) => setProjectLeader(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 font-medium mb-1" htmlFor="cost">Cost</label>
                                        <input
                                            id="cost"
                                            className="w-full rounded-lg border border-[#2b2b3c] bg-[#11111a] px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            type="number"
                                            min="0"
                                            placeholder="Enter project cost"
                                            value={cost}
                                            onChange={(e) => setCost(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 font-medium mb-1" htmlFor="discount-rate">Discount Rate (%)</label>
                                        <input
                                            id="discount-rate"
                                            className="w-full rounded-lg border border-[#2b2b3c] bg-[#11111a] px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="Enter discount rate"
                                            value={discountRate}
                                            onChange={(e) => setDiscountRate(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 font-medium mb-1" htmlFor="expected-duration">Expected Duration (days)</label>
                                        <input
                                            id="expected-duration"
                                            className="w-full rounded-lg border border-[#2b2b3c] bg-[#11111a] px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            type="number"
                                            min="1"
                                            placeholder="Enter expected duration"
                                            value={expectedDuration}
                                            onChange={(e) => setExpectedDuration(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-[#1a1a28] hover:bg-[#222233] text-gray-200 rounded-lg font-semibold border border-[#2b2b3c]"
                                            onClick={() => setAcceptanceModalIsOpened(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-semibold"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
                {rejectionModalIsOpened && (
                    <>
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
                            <div className="bg-[#0a0a0f] border border-[#1f1f2e] rounded-2xl shadow-xl w-full max-w-md p-6 relative text-white">
                                <h3 className="text-xl font-semibold mb-4 text-red-400">Reject Project</h3>
                                <form onSubmit={handleRejectionModal}>
                                    <div className="mb-4">
                                        <label className="block text-gray-300 font-medium mb-1">Project Name</label>
                                        <div className="bg-[#11111a] border border-[#2b2b3c] rounded-lg px-3 py-2 text-gray-200">{selectedProject?.name || "Untitled Project"}</div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-300 font-medium mb-1">Project Details</label>
                                        <div className="bg-[#11111a] border border-[#2b2b3c] rounded-lg px-3 py-2 text-gray-200">{selectedProject?.details || "No description."}</div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-300 font-medium mb-1">Are you sure you want to reject this project?</label>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-[#1a1a28] hover:bg-[#222233] text-gray-200 rounded-lg font-semibold border border-[#2b2b3c]"
                                            onClick={() => {
                                                setRejectionModalIsOpened(false);
                                                setSelectedProject(null);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-semibold"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
                {projectDeletionModalIsOpen && (
                    <>
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
                            <div className="bg-[#0a0a0f] border border-[#1f1f2e] rounded-2xl shadow-xl w-full max-w-md p-6 relative text-white">
                                <h3 className="text-xl font-semibold mb-4 text-red-500">Delete Project</h3>
                                <form onSubmit={handleDeletionBtn}>
                                    <div className="mb-4">
                                        <label className="block text-gray-300 font-medium mb-1">Project Name</label>
                                        <div className="bg-[#11111a] border border-[#2b2b3c] rounded-lg px-3 py-2 text-gray-200">
                                            {selectedProject?.name || "Untitled Project"}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-300 font-medium mb-1">Project Details</label>
                                        <div className="bg-[#11111a] border border-[#2b2b3c] rounded-lg px-3 py-2 text-gray-200">
                                            {selectedProject?.details || "No description."}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-300 font-medium mb-1">
                                            Are you sure you want to delete this project? This action cannot be undone.
                                        </label>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-[#1a1a28] hover:bg-[#222233] text-gray-200 rounded-lg font-semibold border border-[#2b2b3c]"
                                            onClick={() => {
                                                setProjectDeletionModalIsOpen(false);
                                                setSelectedProject(null);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ProjectsList;