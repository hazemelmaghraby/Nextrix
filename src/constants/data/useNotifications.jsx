import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import useUserData from "./useUserData";

const useNotifications = () => {
    const { uid } = useUserData();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!uid) return;

        const baseConstraints = [
            where("recipients", "array-contains", uid),
        ];

        // Prefer ordered results, but gracefully fallback if index is missing
        const qOrdered = query(
            collection(db, "notifications"),
            ...baseConstraints,
            orderBy("createdAt", "desc")
        );

        let unsubscribe = () => { };

        unsubscribe = onSnapshot(
            qOrdered,
            (snap) => {
                setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            },
            (error) => {
                console.error("Notifications listener error:", error);
                // Missing index or createdAt not present on all docs -> try without orderBy
                const qUnordered = query(
                    collection(db, "notifications"),
                    ...baseConstraints
                );
                unsubscribe();
                unsubscribe = onSnapshot(qUnordered, (snap) => {
                    setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
                });
            }
        );

        return () => unsubscribe();
    }, [uid]);

    return notifications;
};

export default useNotifications;
