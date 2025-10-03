import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../constants/firebase";
import useUserData from "../../constants/data/useUserData";
import NotSignedIn from '../../constants/components/NotSignedIn';
import Loading from "../../constants/components/Loading";
import { Github, Linkedin, Instagram, Phone } from "lucide-react";

export default function MoreInfoForm() {
    const [role, setRole] = useState("");
    const [careerRoles, setCareerRoles] = useState([]);
    const [subRoles, setSubRoles] = useState([]);
    const [owner, setOwner] = useState(false);
    const [premium, setPremium] = useState(false);
    const [bio, setBio] = useState("");
    const [level, setLevel] = useState("");
    const [title, setTitle] = useState("");
    const [skills, setSkills] = useState("");
    const [projects, setProjects] = useState("");
    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [instagram, setInstagram] = useState("");
    const [phone, setPhone] = useState("");
    const { user, uid, loading } = useUserData();

    if (loading) {
        <Loading />
    }


    if (!user && !loading) {
        return (
            <NotSignedIn>
                you must be signed in to complete setting up your profile.
            </NotSignedIn>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            alert("No logged-in user!");
            return;
        }

        // ✅ validations
        if (!title.trim()) {
            alert("Job Title is required.");
            return;
        }
        if (!level.trim()) {
            alert("Level is required.");
            return;
        }
        if (!bio.trim() || bio.length < 10) {
            alert("Bio must be at least 10 characters.");
            return;
        }

        try {
            await setDoc(
                doc(db, "users", user.uid),
                {
                    profileInfo: {
                        careerRoles,
                        subRoles,
                        bio,
                        level,
                        title,
                        skills: Array.isArray(skills)
                            ? skills
                            : skills.split(",").map((s) => s.trim()).filter(Boolean),
                        projects: Array.isArray(projects)
                            ? projects
                            : projects.split(",").map((p) => p.trim()).filter(Boolean),
                        github,
                        linkedin,
                        instagram,
                        phone,
                        configDone: true,
                    },
                },
                { merge: true }
            );

            alert("Extra info saved!");
        } catch (err) {
            console.error("Error saving extra info:", err);
            alert("Error saving info.");
        }
    };

    // handle dropdown multi select
    const handleCareerChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
        setCareerRoles(selected);
    };

    const handleSubRolesChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
        setSubRoles(selected);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6 mt-15">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-4xl bg-black/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-8 space-y-6"
            >
                <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
                    Complete Your Profile
                </h2>

                {/* Grid for general fields */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Job Title */}
                    <div>
                        <label className="block text-gray-300 mb-2">Job Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Full Stack Developer"
                        />
                    </div>

                    {/* Level */}
                    <div>
                        <label className="block text-gray-300 mb-2">Level</label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select level</option>
                            <option>Intern</option>
                            <option>Junior</option>
                            <option>Mid</option>
                            <option>Senior</option>
                            <option>Lead</option>
                        </select>
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-gray-300 mb-2">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                {/* Grid for Skills + Projects */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Skills */}
                    <div>
                        <label className="block text-gray-300 mb-2">Skills</label>
                        <input
                            type="text"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. React, Node.js, Figma (comma separated)"
                        />
                    </div>

                    {/* Projects */}
                    <div>
                        <label className="block text-gray-300 mb-2">Previous Projects</label>
                        <input
                            type="text"
                            value={projects}
                            onChange={(e) => setProjects(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add project links (comma separated)"
                        />
                    </div>
                </div>

                {/* Grid for Career + Sub Roles */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-300 mb-2">Career Roles</label>
                        <select
                            multiple
                            value={careerRoles}
                            onChange={handleCareerChange}
                            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                        >
                            <option>Front End</option>
                            <option>Back End</option>
                            <option>Ui, Ux</option>
                            <option>Designer</option>
                            <option>Accountant</option>
                            <option>Project Manager</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl / Cmd to select multiple</p>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Sub Roles</label>
                        <select
                            multiple
                            value={subRoles}
                            onChange={handleSubRolesChange}
                            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                        >
                            <option>Marketing</option>
                            <option>Team Lead</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-300 mb-2">Social Media Links</label>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <span className="text-gray-400">
                                <Github className="w-5 h-5" />
                            </span>
                            <input
                                type="url"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="GitHub URL"
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-blue-400">
                                <Linkedin className="w-5 h-5" />
                            </span>
                            <input
                                type="url"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="LinkedIn URL"
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-pink-400">
                                <Instagram className="w-5 h-5" />
                            </span>
                            <input
                                type="url"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Instagram URL"
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-green-400">
                                <Phone className="w-5 h-5" />
                            </span>
                            <input
                                type="url"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="WhatsApp Link or Number"
                            />
                        </div>
                    </div>
                </div>

                {/* Avatar - Coming Soon */}
                <div className="opacity-50 pointer-events-none">
                    <label className="block text-gray-300 mb-2">Avatar (Coming Soon)</label>
                    <div className="w-full px-4 py-3 rounded-lg bg-black/40 border border-dashed border-white/20 text-gray-400 text-center">
                        Avatar upload feature is coming soon...
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:cursor-pointer font-semibold hover:opacity-90 transition"
                >
                    Save Profile Info
                </button>
            </form>
        </div>
    );
}
