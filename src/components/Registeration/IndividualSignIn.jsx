import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { User, Mail, Lock, Phone, Calendar } from "lucide-react";
import { auth, db } from '../../constants/firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp, getDoc, getDocs, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Loading from "../../constants/components/Loading";
import { useNavigate } from "react-router";
import { vaultAuth, vaultDb, vaultGoogleProvider } from "../../constants/VaultFirebase";
import { QnsDb, QnsAuth } from "../../constants/QnsFirebase";

const IndividualSignIn = () => {
    const formRef = useRef();
    const titleRef = useRef();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [surName, setSurName] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [phone, setPhone] = useState("");
    const [owner, setOwner] = useState(false); // boolean flag
    const [role, setRole] = useState("individual");
    const [subRoles, setSubRoles] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("Success"); // "success" or "error"
    const [vaultCondition, setVaultCondition] = useState("");
    const [QnsCondition, setQnsCondition] = useState("");
    const [DREZ_Condition, setDREZ_Condition] = useState("");
    React.useEffect(() => {
        document.title = 'Nextrix • Sign in';
    }, []);

    useEffect(() => {
        gsap.fromTo(
            titleRef.current,
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        );

        gsap.fromTo(
            formRef.current.children,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
            }
        );
    }, []);

    const handleSignUp = async (event) => {
        event.preventDefault();

        if (
            firstName === "" ||
            surName === "" ||
            username === "" ||
            email === "" ||
            password === "" ||
            gender === "" ||
            age === "" ||
            phone === ""
        ) {
            setMessage("Please fill all the fields");
            return;
        }

        try {
            setLoading(true);

            // ✅ check if username already exists in main db
            const usernameSnap = await getDocs(
                query(collection(db, "users"), where("username", "==", username))
            );
            if (!usernameSnap.empty) {
                setMessage("This username is already taken. Please choose another one.");
                setMessageType('Error');
                setLoading(false);
                return;
            }

            // ✅ check if email already exists in main db
            const emailSnap = await getDocs(
                query(collection(db, "users"), where("email", "==", email))
            );
            if (!emailSnap.empty) {
                setMessage("This email is already registered. Please use another email or login.");
                setMessageType('Error');
                setLoading(false);
                return;
            }

            // 🔑 special Vault check
            let subRolesToSave = null;
            if (email.endsWith("@vault.com")) {
                const emailUsername = email.split("@")[0]; // only the part before @

                // search vaultDb for any user with the same username (ignoring domain)
                const vaultSnap = await getDocs(
                    query(collection(vaultDb, "users"), where("username", "==", emailUsername))
                );
                setVaultCondition(true);

                if (vaultSnap.empty) {
                    setMessage("This username does not exist in the Vault system. Please use a valid Vault account.");
                    setMessageType('Error');
                    setLoading(false);
                    return;
                }
                subRolesToSave = "Vault";
            }

            // 🌸 special Qn's check
            if (email.endsWith("@Qns.com")) {
                const QnemailUsername = email.split("@")[0]; // only the part before @

                // search Qn'sDb for any user with the same username (ignoring domain)
                const QnsSnap = await getDocs(
                    query(collection(QnsDb, "users"), where("email", "==", QnemailUsername))
                );

                if (QnsSnap.empty) {
                    setMessage("This username does not exist in the Qn's system. Please use a valid Qn's account.");
                    setMessageType('Error');
                    setLoading(false);
                    return;
                }
                subRolesToSave = "Qns";
            }

            // ✅ if passed all checks → create user in MAIN Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ✅ save profile in main db
            await setDoc(doc(db, "users", user.uid), {
                email,
                username,
                firstName,
                surName,
                gender,
                age,
                phone,
                role,
                owner,
                certified: false,
                premium: false,
                configDone: false,
                createdAt: serverTimestamp(),
                ...(subRolesToSave && { subRoles: subRolesToSave })
            });

            // ✅ notify owners
            const ownersSnap = await getDocs(
                query(collection(db, "users"), where("owner", "==", true))
            );
            const ownerIds = ownersSnap.docs.map((doc) => doc.id);

            await addDoc(collection(db, "notifications"), {
                title: "New Account Created",
                message: `${firstName} ${surName} (${email}) has joined.`,
                createdAt: serverTimestamp(),
                createdBy: user.uid,
                recipients: ownerIds,
                readBy: [],
            });

            setMessage("Sign Up successful");
            setMessageType('Success');
            navigate("/subInfo");
        } catch (error) {
            console.log(error);
            setMessage(`Sign Up failed: ${error.message}`);
            setMessageType('Error');

        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <Loading />;
    }



    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="gradient-bg absolute inset-0 bg-gradient-to-br from-black via-orange-500/50 to-black"></div>

            {/* Glow elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div
                className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
            ></div>

            <div className="relative mt-15 z-10 w-full max-w-lg bg-black/40 border border-white/10 rounded-2xl shadow-xl p-8 backdrop-blur-xl">
                <h2
                    ref={titleRef}
                    className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-orange-500 via-blue-500 to-white bg-clip-text text-transparent"
                >
                    Create Your Account
                </h2>
                {message && (
                    <div
                        className={`mb-4 px-4 py-3 rounded ${messageType === "Success"
                            ? "bg-green-600 text-white"
                            : messageType === "Error"
                                ? "bg-red-600 text-white"
                                : messageType === "info"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-600 text-white"
                            }`}
                    >
                        {message}
                    </div>
                )}


                <form ref={formRef} className="space-y-5">
                    {/* Firstname & Surname */}
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First name"
                            className="w-1/2 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-orange-500 focus:outline-none"
                        />
                        <input
                            type="text"
                            value={surName}
                            onChange={(e) => setSurName(e.target.value)}
                            placeholder="Surname"
                            className="w-1/2 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Username */}
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full pl-10 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-orange-500 focus:outline-none"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full pl-10 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full pl-10 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-orange-500 focus:outline-none"
                        />
                    </div>

                    {/* Confirm Password */}
                    {/* <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full pl-10 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-blue-500 focus:outline-none"
                        />
                    </div> */}

                    {/* Gender */}
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/10 focus:border-orange-500 focus:outline-none"
                    >
                        <option value="" className="bg-black text-gray-300">
                            Select Gender
                        </option>
                        <option value="male" className="bg-black text-white">
                            Male
                        </option>
                        <option value="female" className="bg-black text-white">
                            Female
                        </option>
                        <option value="other" className="bg-black text-white">
                            Other
                        </option>
                    </select>

                    {/* Phone */}
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-10 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-orange-500 focus:outline-none"
                        />
                    </div>

                    {/* Age */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="number"
                            placeholder="Age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full pl-10 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* CTA */}
                    <button
                        type="submit"
                        onClick={handleSignUp}
                        className="w-full mt-4 group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 hover:cursor-pointer flex items-center justify-center space-x-2"
                    >
                        <span>Sign Up</span>
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-400">
                    Already have an account ?{" "}
                    <a
                        href="/login"
                        className="text-orange-500 hover:underline"
                    >
                        Login
                    </a>
                </p>
            </div>
        </section>
    );
};

export default IndividualSignIn;