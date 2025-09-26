import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function useUserData() {
    const [user, setUser] = useState(null);
    const [uid, setUid] = useState(null);
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [surName, setSurName] = useState(null);
    const [email, setEmail] = useState(null);
    const [gender, setGender] = useState(null);
    const [phone, setPhone] = useState("#");
    const [age, setAge] = useState(null);
    const [owner, setOwner] = useState(false);
    const [role, setRole] = useState("user");
    const [careerRoles, setCareerRoles] = useState(null);
    const [subRoles, setSubRoles] = useState(["No Stored Roles"]);
    const [premium, setPremium] = useState(false);

    // NEW: loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true); // start fetching

            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();

                        setUser(currentUser);
                        setUid(currentUser.uid);
                        setFirstName(userData.firstName || "null");
                        setSurName(userData.surName || userData.sureName || "null");
                        setUsername(userData.username || "null !");
                        setEmail(userData.email || "no email");
                        setGender(userData.gender || "Invalid");
                        setRole(userData.role || "user");
                        setAge(userData.age || "0");
                        setPhone(userData.phone || "#");
                        setOwner(userData.owner || false);
                        setPremium(userData.premium || false);
                        setCareerRoles(userData.careerRoles || "Unchoosed");
                        setSubRoles(userData.subRoles || ["Unchoosed"]);
                    }
                } catch (error) {
                    console.error(`Error fetching user data: ${error}`);
                }
            } else {
                // Reset everything on logout
                setUser(null);
                setUid(null);
                setUsername(null);
                setFirstName(null);
                setSurName(null);
                setEmail(null);
                setGender(null);
                setRole("user");
                setAge(null);
                setPhone("#");
                setOwner(false);
                setPremium(false);
                setCareerRoles(null);
                setSubRoles(["No Stored Roles"]);
            }

            setLoading(false); // finished fetching
        });

        return () => unsubscribe();
    }, []);

    return {
        user,
        firstName,
        surName,
        username,
        email,
        gender,
        phone,
        age,
        owner,
        premium,
        role,
        careerRoles,
        subRoles,
        loading,
        uid, // <--- use this in your components
    };
}
