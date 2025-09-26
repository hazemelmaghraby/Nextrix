import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../constants/firebase";

export default function MoreInfoForm() {
    const [role, setRole] = useState("");
    const [careerRoles, setCareerRoles] = useState([]);
    const [subRoles, setSubRoles] = useState([]);
    const [owner, setOwner] = useState(false);
    const [premium, setPremium] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return alert("No logged-in user!");

        try {
            await setDoc(
                doc(db, "users", user.uid),
                {
                    careerRoles,
                    subRoles,
                    premium,
                },
                { merge: true } // ✅ merge so it keeps firstName, email, etc.
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-black/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-8 space-y-6"
            >
                <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
                    Complete Your Profile
                </h2>


                {/* Career Roles */}
                <div>
                    <label className="block text-gray-300 mb-2">Career Roles</label>
                    <select
                        multiple
                        value={careerRoles}
                        onChange={handleCareerChange}
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Sub Roles */}
                <div>
                    <label className="block text-gray-300 mb-2">Sub Roles</label>
                    <select
                        multiple
                        value={subRoles}
                        onChange={handleSubRolesChange}
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>Vault</option>
                        <option>DRE.$</option>
                        <option>Marketing</option>
                        <option>Team Lead</option>
                    </select>
                </div>


                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:opacity-90 transition"
                >
                    Save Profile Info
                </button>
            </form>
        </div>
    );
}
