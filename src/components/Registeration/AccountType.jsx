import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const AccountType = () => {
    React.useEffect(() => {
        document.title = 'Nextrix • Selection';
    }, []);
    const [accountType, setAccountType] = useState("");
    const navigate = useNavigate();

    const formRef = useRef();
    const titleRef = useRef();

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (accountType === "company") {
            navigate("/companySignIn");
        } else if (accountType === "individual") {
            navigate("/individualSignIn");
        }
    };

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

            <div className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-8">
                <h2
                    ref={titleRef}
                    className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-orange-500 via-blue-500 to-white bg-clip-text text-transparent"
                >
                    Choose Account Type
                </h2>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    {/* Select */}
                    <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/10 focus:border-orange-500 focus:outline-none"
                        required
                    >
                        <option value="" className="bg-black text-gray-300">
                            Select Account Type
                        </option>
                        <option value="company" className="bg-black text-white">
                            Company
                        </option>
                        <option value="individual" className="bg-black text-white">
                            Individual
                        </option>
                    </select>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full mt-4 group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 hover:cursor-pointer flex items-center justify-center space-x-2"
                    >
                        <span>Continue</span>
                    </button>
                </form>
            </div>
        </section>
    );
};

export default AccountType;
