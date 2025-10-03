import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, BadgeDollarSign, AtSign, ShieldUser, FolderGit2, Eye, DatabaseZap, ChartColumnDecreasing, DollarSign, Cloud, List } from 'lucide-react';
import useUserData from '../../../constants/data/useUserData';
import NotSignedIn from '../../../constants/components/NotSignedIn';
import MissingPermissions from '../../../constants/components/missingPermissions';
import Loading from '../../../constants/components/Loading';

const ODashboard = () => {
    const sectionRef = useRef(null);
    const featuresRef = useRef(null);
    const { owner, role, user, username, loading } = useUserData();
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Animate the dashboard title
        if (sectionRef.current) {
            gsap.fromTo(
                sectionRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }

        // Animate the menu items
        if (featuresRef.current) {
            gsap.fromTo(
                featuresRef.current.querySelectorAll('.dashboard-feature-item'),
                { x: -50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: featuresRef.current,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return (
            <NotSignedIn>
                You must be signed in to identify your permissions.
            </NotSignedIn>
        );
    }

    // --- Require owner
    if (!owner) {
        return (
            <MissingPermissions>
                You do not have permission to access this page. Only owners/admins can enter the dashboard.
            </MissingPermissions>
        );
    }

    const adminMenu = [
        {
            label: "Accounts Panel",
            onClick: () => {
                window.location.href = '/accountsPanel';
            },
            icon: <List />
        },
        {
            label: "Projects",
            onClick: () => {
                window.location.href = '/projects';
            },
            icon: <FolderGit2 />
        },
        {
            label: "Financials",
            onClick: () => {
                window.location.href = '/financials';
            },
            icon: < DollarSign />
        },
        {
            label: "Admins Management",
            onClick: () => {
                window.location.href = '/adminsManagment';
            },
            icon: <ShieldUser />
        },
        {
            label: "Performance Analytics",
            onClick: () => {
                window.location.href = '/performance-analytics';
            }, icon: <ChartColumnDecreasing />
        },
        {
            label: "Cloud Integration",
            onClick: () => {
                window.location.href = '/cloud-integration';
            },
            icon: <Cloud />
        },
        {
            label: "API Development",
            onClick: () => {
                window.location.href = '/api-development';
            },
            icon: <AtSign />
        },
        {
            label: "Database Optimization",
            onClick: () => {
                window.location.href = '/database-optimization';
            },
            icon: <DatabaseZap />
        },
        {
            label: "User Experience Reviews",
            onClick: () => {
                window.location.href = '/user-experience-reviews';
            },
            icon: < Eye />
        },
    ];

    // Helper to chunk the menu into rows of 3
    const chunkArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    const adminMenuRows = chunkArray(adminMenu, 3);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray via-blue-950 to-black px-4">
            <div
                ref={sectionRef}
                className="w-full max-w-2xl bg-gradient-to-br from-gray via-red-950 to-black backdrop-blur-xl p-10 rounded-2xl shadow-lg border border-white/10 mb-8"
            >
                <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-6">
                    Ownership Dashboard
                </h1>
                <p className="text-center text-gray-300 text-lg">
                    Welcome to the Ownership Dashboard. Please select a panel from the navigation to get started.
                </p>
            </div>

            <div
                ref={featuresRef}
                className="w-full max-w-2xl flex flex-col space-y-4"
            >
                {adminMenuRows.map((row, rowIdx) => (
                    <div
                        key={rowIdx}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        {row.map((feature, index) => (
                            <button
                                key={index}
                                className="dashboard-feature-item hover:cursor-pointer group flex-1 flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-800/30 to-transparent rounded-lg hover:from-orange-500/10 hover:to-blue-500/10 transition-all duration-300 transform hover:translate-x-2 focus:outline-none"
                                onClick={feature.onClick}
                                type="button"
                            >
                                <div className="p-1 bg-gradient-to-r from-red-500 to-black-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                                    <div className="">
                                        {feature.icon}
                                    </div>
                                </div>
                                <span className="text-gray-300 group-hover:text-white font-medium transition-colors duration-300">
                                    {feature.label}
                                </span>
                            </button>
                        ))}
                        {/* Fill empty columns if needed for last row */}
                        {row.length < 3 &&
                            Array.from({ length: 3 - row.length }).map((_, i) => (
                                <div key={`empty-${i}`} className="flex-1" />
                            ))
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ODashboard;