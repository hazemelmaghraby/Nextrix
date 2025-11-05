import React, { useState, useEffect, useRef } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../constants/firebase";
import useUserData from "../../constants/data/useUserData";
import NotSignedIn from "../../constants/components/NotSignedIn";
import Loading from "../../constants/components/Loading";
import { Github, Linkedin, Instagram, Phone, Check, Upload } from "lucide-react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

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
    const [whatsApp, setWhatsApp] = useState("");
    const { user, uid, loading, configDonee, avatar: userAvatar } = useUserData();

    const [avatar, setAvatar] = useState(userAvatar || null);
    const [preview, setPreview] = useState(userAvatar || null);
    const [uploading, setUploading] = useState(false);

    const titleRef = useRef();
    const subtitleRef = useRef();
    const navigate = useNavigate();

    React.useEffect(() => {
        document.title = "Nextrix • subInfo";
    }, []);

    useEffect(() => {
        gsap.fromTo(
            titleRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        );

        gsap.fromTo(
            subtitleRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" }
        );
    }, []);

    if (loading) return <Loading />;

    if (configDonee && !loading) {
        return (
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-green-500/10 to-black" />
                <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />

                <div className="relative z-10 text-center px-6 max-w-3xl">
                    <div className="inline-flex items-center justify-center p-6 rounded-full border border-green-500/30 bg-black/40 backdrop-blur-lg shadow-lg mb-6">
                        <Check className="w-12 h-12 text-green-500" />
                    </div>
                    <h1
                        ref={titleRef}
                        className="text-5xl py-3.5 md:text-7xl font-bold bg-gradient-to-r from-green-500 via-orange-500 to-white bg-clip-text text-transparent mb-4"
                    >
                        Profile Info is complete
                    </h1>
                    <p
                        ref={subtitleRef}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
                    >
                        Your profile information is complete. You can now proceed to start using all features of our platform.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
                    >
                        Home
                    </button>
                </div>
            </section>
        );
    }

    if (!user && !loading) {
        return (
            <NotSignedIn>
                You must be signed in to complete setting up your profile.
            </NotSignedIn>
        );
    }

    // ✅ Upload avatar to ImageBB (not Firebase Storage)
    const handleAvatarSave = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return alert("Please sign in first.");
        if (!avatar) return alert("Please select an image first.");

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("image", avatar);

            // Replace with your ImageBB API key:
            const apiKey = "31fd65f85db081f73371a67dd8e2042e";
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (!data.success) throw new Error("Failed to upload image to ImageBB");

            const imageUrl = data.data.url;
            setPreview(imageUrl);

            await setDoc(
                doc(db, "users", currentUser.uid),
                { avatarURL: imageUrl },
                { merge: true }
            );

            alert("Avatar uploaded successfully!");
        } catch (err) {
            console.error("Error saving avatar:", err);
            alert("Error uploading avatar.");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatar(file);
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
    };

    // 🔥 Existing profile saving (unchanged)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentUser = auth.currentUser;
        if (!currentUser) return alert("You must be signed in.");

        if (!title.trim()) return alert("Job Title is required.");
        if (!level.trim()) return alert("Level is required.");
        if (!bio.trim() || bio.length < 10)
            return alert("Bio must be at least 10 characters.");

        try {
            await setDoc(
                doc(db, "users", currentUser.uid),
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
                        whatsApp,
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6 mt-15">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-3xl bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 space-y-6"
            >
                <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
                    Complete Your Profile
                </h2>

                {/* Avatar Upload */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Avatar Preview"
                                className="w-32 h-32 rounded-full border-4 border-blue-500/40 object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-black/40 border-4 border-dashed border-blue-500/30 flex items-center justify-center text-gray-500 text-3xl group-hover:border-blue-400 transition-all">
                                ?
                            </div>
                        )}

                        <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer shadow-md transition">
                            <Upload className="w-4 h-4 text-white" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <button
                        type="button"
                        onClick={handleAvatarSave}
                        disabled={uploading}
                        className={`px-5 py-2.5 rounded-lg text-white font-semibold transition-all ${uploading
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-600 hover:to-blue-600 shadow-md hover:shadow-lg hover:shadow-blue-500/30"
                            }`}
                    >
                        {uploading ? "Uploading..." : "Save Avatar"}
                    </button>

                    <p className="text-xs text-gray-400 mt-1 text-center">
                        Upload your profile picture (JPG, PNG, or GIF)
                    </p>
                </div>
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
                            <option value="" className="bg-black text-gray-400">Select level</option>
                            <option className="bg-black text-white">Intern</option>
                            <option className="bg-black text-white">Junior</option>
                            <option className="bg-black text-white">Mid</option>
                            <option className="bg-black text-white">Senior</option>
                            <option className="bg-black text-white">Lead</option>
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


                {/* Grid for Career + Sub Roles */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Career Roles Dropdown */}
                    <div>
                        <label className="block text-gray-300 mb-2">Career Roles</label>
                        <div className="relative">
                            <select
                                value={careerRoles.length > 0 ? careerRoles[0] : ""}
                                onChange={e => setCareerRoles([e.target.value])}
                                className="w-full px-4 py-2 pr-10 rounded-lg bg-gradient-to-r from-black/60 to-blue-900/40 border border-blue-400/30 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition duration-150 ease-in-out shadow-md"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(59,130,246,0.15) 100%)"
                                }}
                            >
                                <option value="" className="bg-black text-gray-400">Select a career role</option>
                                <option className="bg-black text-white">Developer</option>
                                <option className="bg-black text-white">Designer</option>
                                <option className="bg-black text-white">Manager</option>
                                <option className="bg-black text-white">Tester</option>
                                <option className="bg-black text-white">Accountant</option>
                                <option className="bg-black text-white">Virtual Assistant</option>
                            </select>
                            {/* Custom dropdown arrow */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Sub Roles</label>
                        <select
                            value={subRoles.length > 0 ? subRoles[0] : ""}
                            onChange={e => setSubRoles([e.target.value])}
                            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" className="bg-black text-gray-400">Select a sub role</option>
                            {(() => {
                                // Map career role to sub roles
                                const subRoleOptions = {
                                    Developer: [
                                        "Frontend",
                                        "Backend",
                                        "Mobile App",
                                        "Desktop App",
                                        "Full Stack",
                                        "DevOps",
                                        "Game Developer",
                                        "Embedded Systems",
                                        "Data Engineer",
                                        "AI/ML Engineer"
                                    ],
                                    Designer: [
                                        "UI Designer",
                                        "UX Designer",
                                        "Graphic Designer",
                                        "Product Designer",
                                        "Motion Designer",
                                        "Brand Designer"
                                    ],
                                    Manager: [
                                        "Project Manager",
                                        "Product Manager",
                                        "Scrum Master",
                                        "Team Lead",
                                        "Operations Manager"
                                    ],
                                    Tester: [
                                        "QA Engineer",
                                        "Automation Tester",
                                        "Manual Tester",
                                        "Performance Tester",
                                        "Security Tester"
                                    ],
                                    Accountant: [
                                        "Financial Accountant",
                                        "Management Accountant",
                                        "Auditor",
                                        "Payroll Specialist"
                                    ],
                                    "Virtual Assistant": [
                                        "Administrative Support",
                                        "Customer Service",
                                        "Data Entry",
                                        "Social Media Assistant"
                                    ]
                                };
                                const selectedCareer = careerRoles.length > 0 ? careerRoles[0] : "";
                                const options = subRoleOptions[selectedCareer] || [];
                                return options.length > 0
                                    ? options.map(opt => (
                                        <option className="bg-black text-white" key={opt} value={opt}>{opt}</option>
                                    ))
                                    : <option className="bg-black text-gray-400" disabled>No sub roles available. Please select a career role.</option>;
                            })()}
                        </select>
                    </div>
                    {/* Skills Dropdown */}
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Skills</label>
                        <select
                            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        >
                            <option value="">Select a skill</option>
                            {(() => {
                                // Map subRole to skills
                                const skillsOptions = {
                                    // Developer subroles
                                    "Frontend": [
                                        "React",
                                        "Vue",
                                        "Angular",
                                        "Svelte",
                                        "Next.js",
                                        "Nuxt.js",
                                        "Pure JavaScript",
                                        "TypeScript",
                                        "HTML/CSS"
                                    ],
                                    "Backend": [
                                        "Node.js",
                                        "Express",
                                        "Django",
                                        "Flask",
                                        "Spring Boot",
                                        "Ruby on Rails",
                                        "Go",
                                        "PHP",
                                        "Laravel"
                                    ],
                                    "Full Stack": [
                                        "React",
                                        "Node.js",
                                        "Django",
                                        "MongoDB",
                                        "Express",
                                        "Vue",
                                        "Angular",
                                        "GraphQL"
                                    ],
                                    "Mobile Developer": [
                                        "React Native",
                                        "Flutter",
                                        "Swift",
                                        "Kotlin",
                                        "Java (Android)",
                                        "Objective-C"
                                    ],
                                    "Game Developer": [
                                        "Unity",
                                        "Unreal Engine",
                                        "Godot",
                                        "C#",
                                        "C++"
                                    ],
                                    "Embedded Systems": [
                                        "C",
                                        "C++",
                                        "Microcontrollers",
                                        "RTOS",
                                        "Assembly"
                                    ],
                                    "Data Engineer": [
                                        "Python",
                                        "SQL",
                                        "Spark",
                                        "Hadoop",
                                        "ETL",
                                        "Airflow"
                                    ],
                                    "AI/ML Engineer": [
                                        "Python",
                                        "TensorFlow",
                                        "PyTorch",
                                        "scikit-learn",
                                        "Keras",
                                        "Pandas"
                                    ],
                                    // Designer subroles
                                    "UI Designer": [
                                        "Figma",
                                        "Sketch",
                                        "Adobe XD",
                                        "InVision"
                                    ],
                                    "UX Designer": [
                                        "User Research",
                                        "Wireframing",
                                        "Prototyping",
                                        "Usability Testing"
                                    ],
                                    "Graphic Designer": [
                                        "Adobe Photoshop",
                                        "Adobe Illustrator",
                                        "CorelDRAW",
                                        "Canva"
                                    ],
                                    "Product Designer": [
                                        "Figma",
                                        "User Flows",
                                        "Prototyping",
                                        "Design Systems"
                                    ],
                                    "Motion Designer": [
                                        "After Effects",
                                        "Blender",
                                        "Cinema 4D",
                                        "Adobe Animate"
                                    ],
                                    "Brand Designer": [
                                        "Logo Design",
                                        "Brand Guidelines",
                                        "Typography",
                                        "Color Theory"
                                    ],
                                    // Manager subroles
                                    "Project Manager": [
                                        "Agile",
                                        "Scrum",
                                        "Kanban",
                                        "Jira",
                                        "Trello"
                                    ],
                                    "Product Manager": [
                                        "Roadmapping",
                                        "Market Research",
                                        "User Stories",
                                        "A/B Testing"
                                    ],
                                    "Scrum Master": [
                                        "Scrum",
                                        "Facilitation",
                                        "Retrospectives",
                                        "Sprint Planning"
                                    ],
                                    "Team Lead": [
                                        "Leadership",
                                        "Mentoring",
                                        "Code Review",
                                        "Conflict Resolution"
                                    ],
                                    "Operations Manager": [
                                        "Process Optimization",
                                        "Resource Planning",
                                        "Budgeting"
                                    ],
                                    // Tester subroles
                                    "QA Engineer": [
                                        "Selenium",
                                        "Cypress",
                                        "Jest",
                                        "Mocha",
                                        "Manual Testing"
                                    ],
                                    "Automation Tester": [
                                        "Selenium",
                                        "Cypress",
                                        "Appium",
                                        "TestCafe"
                                    ],
                                    "Manual Tester": [
                                        "Test Case Design",
                                        "Bug Reporting",
                                        "Exploratory Testing"
                                    ],
                                    "Performance Tester": [
                                        "JMeter",
                                        "LoadRunner",
                                        "Gatling"
                                    ],
                                    "Security Tester": [
                                        "OWASP",
                                        "Burp Suite",
                                        "Penetration Testing"
                                    ],
                                    // Accountant subroles
                                    "Financial Accountant": [
                                        "Financial Reporting",
                                        "GAAP",
                                        "Excel",
                                        "QuickBooks"
                                    ],
                                    "Management Accountant": [
                                        "Budgeting",
                                        "Forecasting",
                                        "Variance Analysis"
                                    ],
                                    "Auditor": [
                                        "Internal Audit",
                                        "Risk Assessment",
                                        "Compliance"
                                    ],
                                    "Payroll Specialist": [
                                        "Payroll Processing",
                                        "Tax Compliance",
                                        "HRIS"
                                    ],
                                    // Virtual Assistant subroles
                                    "Administrative Support": [
                                        "Scheduling",
                                        "Data Entry",
                                        "Document Management"
                                    ],
                                    "Customer Service": [
                                        "CRM",
                                        "Live Chat",
                                        "Email Support"
                                    ],
                                    "Data Entry": [
                                        "Excel",
                                        "Google Sheets",
                                        "Database Management"
                                    ],
                                    "Social Media Assistant": [
                                        "Content Scheduling",
                                        "Analytics",
                                        "Community Management"
                                    ]
                                };
                                const options = skillsOptions[subRoles[0]] || [];
                                return options.length > 0
                                    ? options.map(skill => (
                                        <option className="bg-black text-white" key={skill} value={skill}>{skill}</option>
                                    ))
                                    : <option className="bg-black text-gray-400" disabled>No skills available. Please select a sub role.</option>;
                            })()}
                        </select>
                    </div>

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

                <div>
                    <label className="block text-gray-300 mb-2">Social Links</label>
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
                                value={whatsApp}
                                onChange={(e) => setWhatsApp(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="WhatsApp Link or Number"
                            />
                        </div>
                    </div>
                </div>

                {/* Avatar Upload */}


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
