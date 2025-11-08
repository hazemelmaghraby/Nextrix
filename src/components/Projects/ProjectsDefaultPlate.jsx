import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { db } from '../../constants/firebase';
import useUserData from '../../constants/data/useUserData';
import NotSignedIn from '../../constants/components/NotSignedIn';
import Loading from '../../constants/components/Loading';
import { doc, getDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';

const labelStyle = "text-xs font-semibold text-gray-400";
const valueStyle = "text-base text-white";
const boxStyle = "bg-black/70 rounded-xl shadow-lg border border-white/10 p-6 mb-4 w-full max-w-2xl mx-auto";
const gridStyle = "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3";

const ProjectsDefaultPlate = () => {
    const { user, loading } = useUserData();
    const { projectId } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            if (!user && loading) return;
            if (!projectId) return;
            setFetchLoading(true);
            try {
                // Path: eur3 > stock/projects/accepted projects/:projectId
                const projectDoc = doc(db, 'stock', 'projects', 'accepted projects', projectId);
                const projectSnap = await getDoc(projectDoc);
                if (!projectSnap.exists()) {
                    toast('No Projects Found.', {
                        position: 'bottom-center',
                        autoClose: 8000,
                        theme: 'dark'
                    });
                    setProjectData(null);
                } else {
                    setProjectData(projectSnap.data());
                }
            } catch (error) {
                toast.error('An error occurred while fetching the project data.', {
                    position: 'bottom-center',
                    autoClose: 8000,
                    theme: 'dark'
                });
                setProjectData(null);
            } finally {
                setFetchLoading(false);
            }
        };
        fetchProject();
    }, [projectId, user, loading]);

    if (loading || fetchLoading) return <Loading />;
    if (!user && !loading) return <NotSignedIn />;

    return (
        <div className="flex flex-col items-center justify-center py-35 min-h-[60vh] bg-gradient-to-b from-[#131314] to-[#1a1a1a]">
            <ToastContainer />
            <div className={boxStyle}>
                {!projectData ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <p className="text-xl text-gray-200 font-bold animate-pulse">Project Not Found</p>
                    </div>
                ) : (
                    <>
                        {/* Project header */}
                        <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-extrabold text-white">{projectData.name || "Untitled Project"}</h2>
                                <span className="inline-flex mt-2 text-sm px-3 py-0.5 rounded-full bg-green-900/40 text-green-300 uppercase tracking-wide font-mono">
                                    {projectData.status}
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="flex flex-col gap-1">
                                    <span className="text-2xl font-bold text-yellow-400">${projectData.cost ?? '-'}</span>
                                    {projectData.discountRate && Number(projectData.discountRate) > 0 && (
                                        <span className="text-orange-300 text-xs">Discount: {projectData.discountRate}%</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Details */}
                        <div className={gridStyle}>
                            {/* Left */}
                            <div className="flex flex-col gap-4">
                                {projectData.details && (
                                    <div>
                                        <span className={labelStyle}>Details</span>
                                        <p className={valueStyle + " mt-1"}>{projectData.details}</p>
                                    </div>
                                )}
                                {projectData.notes && (
                                    <div>
                                        <span className={labelStyle}>Notes</span>
                                        <p className={valueStyle + " mt-1"}>{projectData.notes}</p>
                                    </div>
                                )}
                                <div>
                                    <span className={labelStyle}>Type</span>
                                    <p className={valueStyle + " mt-1"}>{projectData.type || '-'}</p>
                                </div>
                                <div>
                                    <span className={labelStyle}>System</span>
                                    <p className={valueStyle + " mt-1"}>{projectData.system || '-'}</p>
                                </div>
                                <div>
                                    <span className={labelStyle}>Package</span>
                                    <p className={valueStyle + " mt-1"}>{projectData.selectedPackage || '-'}</p>
                                </div>
                                <div>
                                    <span className={labelStyle}>Where</span>
                                    <p className={valueStyle + " mt-1"}>{projectData.placeNature || '-'}</p>
                                </div>
                            </div>
                            {/* Right */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <span className={labelStyle}>Project Leader</span>
                                    <p className={valueStyle + " mt-1"}>{projectData.projectLeader || '-'}</p>
                                </div>
                                <div>
                                    <span className={labelStyle}>Expected Duration</span>
                                    <p className={valueStyle + " mt-1"}>{projectData.expectedDuration ? `${projectData.expectedDuration} days` : '-'}</p>
                                </div>
                                <div>
                                    <span className={labelStyle}>Created At</span>
                                    <p className={valueStyle + " mt-1"}>
                                        {projectData.createdAt
                                            ? new Date(projectData.createdAt).toLocaleString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : '-'}
                                    </p>
                                </div>
                                {/* Intentionally hidden (not shown): createdBy, team, id, levelRequired, requestStatus */}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ProjectsDefaultPlate;