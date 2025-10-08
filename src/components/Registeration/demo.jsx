import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { User, Mail, Lock, Phone, Calendar } from "lucide-react";
import { auth, db } from '../../constants/firebase';
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Loading from "../../constants/components/Loading";

const SignUp = () => {
    React.useEffect(() => {
        document.title = 'Nextrix • Settings';
    }, []);
    const formRef = useRef();
    const titleRef = useRef();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [surName, setSurName] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("individual");
    const [loading, setLoading] = useState(false);

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
        if (firstName === "" || surName === "" || username === "" || email === "" || password === "" || gender === "" || age === "" || phone === "") {
            alert("Please fill all the fields");
            return;
        }
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userData = await setDoc(doc(db, "users", user.uid), {
                email: email,
                username: username,
                firstName: firstName,
                surName: surName,
                gender: gender,
                age: age,
                phone: phone,
                role: role,
            });
            alert("Sign Up successful");
            // Note: router is not imported, you may need to add navigation logic
        } catch (error) {
            console.log(error);
            alert(`Sign Up failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }
    if (loading) return (
        <>
            <Loading />
        </>
    )

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="gradient-bg absolute inset-0 bg-gradient-to-br from-orange-500/20 via-blue-500/20 to-black"></div>

            {/* Glow elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div
                className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
            ></div>

            <div className="relative z-10 w-full max-w-lg bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-8">
                <h2
                    ref={titleRef}
                    className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-orange-500 via-blue-500 to-white bg-clip-text text-transparent"
                >
                    Create Your Account
                </h2>

                <form ref={formRef} className="space-y-5">
                    {/* Firstname & Surname */}
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={firstName}
                            onChange={setFirstName}
                            placeholder="First name"
                            className="w-1/2 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-orange-500 focus:outline-none"
                        />
                        <input
                            type="text"
                            value={surName}
                            onChange={setSurName}
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
                            onChange={setUsername}
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
                            onChange={setEmail}
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
                            onChange={setPassword}
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
                            onChange={setPhone}
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
                            onChange={setAge}
                            className="w-full pl-10 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* CTA */}
                    <button
                        type="submit"
                        onClick={handleSignUp}
                        className="w-full mt-4 group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center space-x-2"
                    >
                        <span>Sign Up</span>
                    </button>
                </form>
            </div>
        </section>
    );
};

export default SignUp;
