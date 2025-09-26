import React, { useState, useEffect, useRef } from 'react';
import { getDoc, addDoc, getDocs, where, query, setDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../constants/firebase';
import useUserData from '../../constants/data/useUserData';
import { AlertTriangle } from "lucide-react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import NotSignedIn from '../../constants/components/NotSignedIn';
import missingPermissions from '../../constants/components/missingPermissions';


const Announcements = () => {

    const [maintenance, setMaintenance] = useState(null);
    const { user, owner, role, uid } = useUserData();
    const [notificationInfo, setNotificationInfo] = useState({
        title: '',
        description: '',
        timeStamp: ''
    });


    // const [permissionError, setPermissionError] = useState(false);
    // const [signedIn, setSignedIn] = useState(false)
    // if (!owner) {
    //     setPermissionError(true);
    // } else {
    //     setPermissionError(false);
    // }

    // if (user) {
    //     setSignedIn(true)
    // } else {
    //     setSignedIn(false);
    // }

    const handleMaintenanceNotification = async (e) => {
        e.preventDefault();
        if (!uid) return;

        const newNotif = {
            title: notificationInfo.title,
            description: notificationInfo.description,
            timeStamp: Date.now(),
        };

        try {
            await setDoc(doc(db, "publicNotifications", `${notificationInfo.title}: ${notificationInfo.timeStamp}`), {
                title: notificationInfo.title,
                description: notificationInfo.description,
                createdAt: serverTimestamp(),
                createdBy: uid,
            });
            setNotificationInfo({ title: "", description: "" });
            alert("Announcement posted ✅");
        } catch (error) {
            console.error("Error sending maintenance notification:", error);
        }

        // Get all users
        const usersSnap = await getDocs(collection(db, "users"));
        usersSnap.forEach(async (userDoc) => {
            await setDoc(
                doc(db, "users", userDoc.id, "notifications", newNotif.title),
                { ...newNotif, read: false }
            );
        });
    };

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
            <missingPermissions>
                You do not have permission to access this page. Only owners can view or post announcements.
            </missingPermissions>
        );
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-[90vh]">
            <div className="border border-white/10 rounded-xl px-8 py-10 shadow-2xl max-w-md w-full">
                <h2 className="text-2xl font-bold text-orange-500 mb-4 text-center">
                    Post Announcement
                </h2>
                <form onSubmit={handleMaintenanceNotification} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={notificationInfo.title}
                        onChange={(e) =>
                            setNotificationInfo({ ...notificationInfo, title: e.target.value })
                        }
                        className="w-full p-2 rounded bg-black/40 border border-white/20 text-white"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={notificationInfo.description}
                        onChange={(e) =>
                            setNotificationInfo({ ...notificationInfo, description: e.target.value })
                        }
                        className="w-full p-2 rounded bg-black/40 border border-white/20 text-white"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded"
                    >
                        Post Announcement
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Announcements;