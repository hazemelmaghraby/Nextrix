import React from "react";
import { Link, NavLink } from "react-router-dom";
import { BookOpen, GraduationCap, LayoutDashboard } from "lucide-react";
import LMSLogo from '/LMS.png';
import useUserData from "../../../constants/data/useUserData";

const LMSNavbar = () => {
    const { user, username, firsName, surName, role, owner, lms } = useUserData();
    return (
        <nav className="fixed top-0 left-0 w-full bg-zinc-950/70 backdrop-blur-md border-b border-blue-900/40 z-50 px-10 py-1 flex justify-between items-center min-h-[5rem]">
            <Link
                to="/lms"
                className="flex items-center gap-5"
            >
                <img
                    src={LMSLogo}
                    alt="Nextrix LMS logo"
                    className="w-14 h-14 rounded-xl shadow-md"
                    style={{ objectFit: "cover" }}
                />
                <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Nextrix LMS
                </span>
            </Link>
            <div className="flex items-center gap-10 text-base">
                <NavLink
                    to="/lms"
                    className={({ isActive }) =>
                        `flex items-center gap-2 ${isActive ? "text-cyan-400" : "text-zinc-300 hover:text-cyan-300"
                        }`
                    }
                >
                    <BookOpen className="w-5 h-5" /> Home
                </NavLink>
                <NavLink
                    to="/lms/courses"
                    className={({ isActive }) =>
                        `flex items-center gap-2 ${isActive ? "text-cyan-400" : "text-zinc-300 hover:text-cyan-300"
                        }`
                    }
                >
                    <GraduationCap className="w-5 h-5" /> Courses
                </NavLink>
                <NavLink
                    to="/lms/dashboard"
                    className="flex items-center gap-2 text-zinc-300 hover:text-cyan-300"
                >
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                </NavLink>
            </div>
        </nav>
    );
};

export default LMSNavbar;