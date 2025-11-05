import React, { useState, useEffect, useRef } from 'react';
import useUserData from '../../constants/data/useUserData';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../constants/firebase';
import { Menu, X, User, Settings, LogOut, ChevronDown, UserStar, Crown, Projector, BriefcaseBusiness, BadgeCheck, Plus, Atom, ShoppingCart, Store, BookCopy } from 'lucide-react';
import { gsap } from 'gsap';
import NotificationsPanel from './NotificationsPanel';
import { getDoc, addDoc, getDocs, where, query, setDoc, collection, doc, serverTimestamp, orderBy, onSnapshot } from 'firebase/firestore';
import Logo from '/Logo.png';
import { motion } from "framer-motion";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { loadCart, loadCartFromFirestore } from '../../constants/Redux/items/itemsSlice';
import LMSLogo from '/LMS.png'


const Navbar = () => {
    const dispatch = useDispatch();
    const { firstName, surName, username, role, gender, phone, owner, premium, uid, avatar } = useUserData();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [projectsMenuIsOpen, setProjectsMenuIsOpen] = useState()
    const dropdownRef = useRef();
    const items = useSelector(state => state.itemsReducer.items);

    // Load cart from Firestore on mount and when user changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const cartItems = await loadCartFromFirestore();
                dispatch(loadCart(cartItems));
            } else {
                dispatch(loadCart([]));
            }
        });
        return () => unsubscribe();
    }, [dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        gsap.fromTo('.header-item',
            { y: -50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            }
        );
    }, []);

    useEffect(() => {
        if (!uid) return;

        const q = query(
            collection(db, "users", uid, "notifications"),
            orderBy("timeStamp", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // 🔑 Check docChanges to only detect *newly added* notifications
            snapshot.docChanges().forEach((change) => {
                // if (change.type === "added") {
                //     const audio = new Audio("/notification.mp3"); // put your file in /public
                //     audio.play().catch((err) =>
                //         console.log("Audio play blocked:", err)
                //     );
                // }
            });

            // Update state with all notifications
            setNotifications(newData);

            // Count unread
            const unread = newData.filter((n) => !n.read).length;
            setUnreadCount(unread);
        });

        return () => unsubscribe();
    }, [uid]);


    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: element,
                ease: "power2.out"
            });
        }
        setIsMenuOpen(false);
    };

    const navItems = [
        { name: 'Home', id: 'hero' },
        { name: 'About', id: 'about' },
        { name: 'Services', id: 'services' },
        { name: 'Features', id: 'features' },
        { name: 'Contact', id: 'contact' }
    ];


    const handleSignOut = async () => {
        try {
            await signOut(auth);
            alert("Logged Out Successfully !")
        } catch (error) {
            alert(`Error logging out - please try again later:\n ${error}`);
        }
    }


    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-sm shadow-lg' : 'bg-black'
                }`}>
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="header-item">
                            <div className="flex items-center space-x-2">
                                <img src={Logo} alt="" className='text-2xl w-10 text-red-600 mt-1' />
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent hover:cursor-pointer" onClick={() => window.location.href = '/'}>
                                    Nextrix
                                </h1>
                            </div>
                        </div>

                        <div className="hidden md:flex space-x-8">
                            {navItems.map((item, index) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="header-item text-white hover:text-orange-500 transition-colors duration-300 relative group cursor-pointer hover:cursor-pointer"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                                </button>
                            ))}
                            {username && (
                                <>
                                    {/* <button onClick={handleSignOut} className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-2 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 flex items-center space-x-2 hover:cursor-pointer">
                                        Logout
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300"></span>
                                    </button> */}

                                    <div className="relative flex items-center justify-center" ref={dropdownRef}>
                                        {/* Avatar Button */}
                                        <button
                                            onClick={() => setOpen(!open)}
                                            className={
                                                `flex items-center space-x-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-lg border hover:bg-white/20 transition-all hover:cursor-pointer ` +
                                                (
                                                    owner === true ? 'border-yellow-500 shadow-[0_0_0_3px_rgba(253,224,71,0.3)]'
                                                        : role === 'admin'
                                                            ? 'border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.3)]'
                                                            : role === 'moderator'
                                                                ? 'border-purple-500 shadow-[0_0_0_2px_rgba(168,85,247,0.3)]'
                                                                : role === 'staff'
                                                                    ? 'border-green-500 shadow-[0_0_0_2px_rgba(34,197,94,0.3)]'
                                                                    : 'border-white/10'
                                                )
                                            }
                                            style={
                                                role === 'admin'
                                                    ? { boxShadow: '0 0 0 3px rgba(239,68,68,0.3)' }
                                                    : role === 'moderator'
                                                        ? { boxShadow: '0 0 0 3px rgba(168,85,247,0.3)' }
                                                        : role === 'staff'
                                                            ? { boxShadow: '0 0 0 3px rgba(34,197,94,0.3)' }
                                                            : {}
                                            }
                                        >
                                            <img
                                                src={avatar || "https://i.pravatar.cc/40"} // replace with user profile pic
                                                alt="profile"
                                                className="w-8 h-8 rounded-full border border-orange-500/50"
                                            />
                                            <ChevronDown
                                                className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${open ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>
                                        {/* ======================================== */}

                                        <div className="relative flex items-center ml-2.5">
                                            <button
                                                onClick={() => setIsOpen((prev) => !prev)}
                                                className="flex hover:cursor-pointer items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/10 via-black/10 to-blue-500/10 border border-white/10 hover:bg-orange-500/20 transition"
                                                style={{ minWidth: 0 }}
                                            >
                                                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                                <span className="inline-flex items-center px-2 py-1.5 rounded-full bg-orange-500/20 text-xs font-semibold text-orange-300">
                                                    {unreadCount}
                                                </span>
                                                <ChevronDown
                                                    className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                                />
                                            </button>
                                            {isOpen && (
                                                <div className="absolute right-0 top-12 w-96 z-50 rounded-xl shadow-2xl bg-gradient-to-r from-orange-500/10 via-black/10 to-blue-500/10 border border-white/10 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="px-4 py-5">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h2 className="text-lg font-bold text-orange-400 flex items-center gap-2">
                                                                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                                </svg>
                                                                Notifications
                                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-orange-500/20 text-xs font-semibold text-orange-300">
                                                                    {unreadCount}
                                                                </span>
                                                            </h2>
                                                        </div>
                                                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                                            {notifications.length === 0 && (
                                                                <li className="text-gray-400 text-sm text-center py-4">
                                                                    No notifications yet.
                                                                </li>
                                                            )}
                                                            {notifications.map((n) => (
                                                                <li
                                                                    key={n.id}
                                                                    className={`p-3 rounded-lg border transition-all duration-200 flex flex-col gap-1
                                                                        ${n.read
                                                                            ? "bg-black/40 border-white/10"
                                                                            : "bg-gradient-to-r from-orange-600/80 to-orange-500/80 border-orange-400/40 shadow-lg shadow-orange-500/10"
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <h3 className={`font-semibold truncate ${n.read ? "text-white" : "text-yellow-100"}`}>{n.title}</h3>
                                                                        {!n.read && (
                                                                            <button
                                                                                onClick={() =>
                                                                                    setDoc(doc(db, "users", uid, "notifications", n.id), {
                                                                                        ...n,
                                                                                        read: true,
                                                                                    })
                                                                                }
                                                                                className="ml-3 text-xs font-bold text-blue-300 hover:text-blue-400 underline transition"
                                                                            >
                                                                                Mark as read
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-gray-200">{n.description}</p>
                                                                    <span className="text-xs text-gray-400">{new Date(n.timeStamp).toLocaleString()}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* ======================================== */}

                                        {/* Cart Button */}
                                        <div className="relative flex items-center ml-2.5">
                                            <Link
                                                to='/cart'
                                                className="flex hover:cursor-pointer items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/10 via-black/10 to-blue-500/10 border border-white/10 hover:bg-orange-500/20 transition"
                                            >
                                                <ShoppingCart className="w-5 h-5 text-orange-400" />
                                                <span className="inline-flex items-center px-2 py-1.5 rounded-full bg-orange-500/20 text-xs font-semibold text-orange-300">
                                                    {items.length}
                                                </span>
                                            </Link>
                                        </div>
                                        {/* ======================================== */}

                                        <div className="header-item flex items-center gap-4">
                                            {owner && <NotificationsPanel />}
                                            {/* show only if Owner in */}
                                        </div>

                                        {/* Dropdown Menu */}
                                        {open && (
                                            <div
                                                className="absolute right-0 top-15 w-96 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200 min-w-[320px] bg-black/30 backdrop-blur-xl border border-white/20
    "
                                                style={{
                                                    WebkitBackdropFilter: "blur(20px)", // Safari support
                                                    backdropFilter: "blur(20px)"        // Chrome/Edge/Firefox
                                                }}
                                            >
                                                {owner ? (
                                                    <>
                                                        {/* User Info Section for Owner */}
                                                        <div className="px-4 py-5 border-b border-yellow-400/40 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-blue-500/20 relative">
                                                            <div className="flex items-center space-x-3">
                                                                <img
                                                                    src={avatar || "https://i.pravatar.cc/40"}
                                                                    alt="profile"
                                                                    className="w-8 h-8 rounded-full border-2 border-yellow-400 shadow-lg shadow-yellow-400/30"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-bold text-yellow-300 truncate mb-1 flex items-center gap-1">
                                                                        {firstName} {surName}
                                                                        <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded bg-yellow-400/20 border border-yellow-400 text-[10px] font-semibold text-yellow-200 uppercase tracking-wider animate-pulse">
                                                                            Owner
                                                                        </span>
                                                                    </p>
                                                                    <p className="text-xs text-yellow-200 truncate mb-1">
                                                                        @{username}
                                                                    </p>
                                                                    <div className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-blue-500/30 border border-yellow-400/50 shadow shadow-yellow-400/10">
                                                                        <span className="text-xs font-bold text-yellow-200 capitalize tracking-wide">
                                                                            {role}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="absolute top-2 right-2">
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-yellow-400 animate-spin-slow" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M12 2v2m6.364 1.636l-1.414 1.414M22 12h-2m-1.636 6.364l-1.414-1.414M12 22v-2m-6.364-1.636l1.414-1.414M2 12h2m1.636-6.364l1.414 1.414" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : role === 'admin' ? (
                                                    <>
                                                        {/* User Info Section for Admin */}
                                                        <div className="px-4 py-3 border-b border-red-400/30 bg-gradient-to-r from-red-500/10 to-red-400/10">
                                                            <div className="flex items-center space-x-3">
                                                                <img
                                                                    src={avatar || "https://i.pravatar.cc/32"}
                                                                    alt="profile"
                                                                    className="w-8 h-8 rounded-full border-2 border-red-500/70"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-semibold truncate mb-1 text-red-300 flex items-center">
                                                                        {firstName} {surName}
                                                                        {premium && (
                                                                            <UserStar className="text-yellow-400 w-[19px] ml-0.5 hover:cursor-pointer" />
                                                                        )}
                                                                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded bg-red-400/20 border border-red-400 text-[10px] font-semibold text-red-200 uppercase tracking-wider animate-pulse">
                                                                            Admin
                                                                        </span>
                                                                    </p>
                                                                    <p className="text-xs truncate mb-1 text-red-200">
                                                                        @{username}
                                                                    </p>
                                                                    <div className="inline-flex items-center px-2 py-1 rounded-full border bg-gradient-to-r from-red-500/20 to-red-400/20 border-red-400/30">
                                                                        <span className="text-xs font-medium capitalize text-red-300">
                                                                            {role}
                                                                        </span>
                                                                    </div>
                                                                    {premium && (<>
                                                                        <div className="inline-flex ml-1 items-center px-2 py-1 rounded-full border bg-gradient-to-r from-amber-500/20 to-amber-400/20 border-amber-400/30">
                                                                            <span className="text-xs font-medium capitalize text-amber-300">
                                                                                premuim
                                                                            </span>
                                                                        </div>
                                                                    </>)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : role === 'moderator' ? (
                                                    <>
                                                        {/* User Info Section for Moderator */}
                                                        <div className="px-4 py-3 border-b border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-blue-400/10">
                                                            <div className="flex items-center space-x-3">
                                                                <img
                                                                    src={avatar || "https://i.pravatar.cc/32"}
                                                                    alt="profile"
                                                                    className="w-8 h-8 rounded-full border-2 border-purple-500/70"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-semibold truncate mb-1 text-purple-300 flex items-center">
                                                                        {firstName} {surName}
                                                                        {premium && (
                                                                            <UserStar className="text-yellow-400 w-[19px] ml-0.5 hover:cursor-pointer" />
                                                                        )}
                                                                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded bg-purple-400/20 border border-purple-400 text-[10px] font-semibold text-purple-200 uppercase tracking-wider animate-pulse">
                                                                            Moderator
                                                                        </span>
                                                                    </p>
                                                                    <p className="text-xs truncate mb-1 text-purple-200">
                                                                        @{username}
                                                                    </p>
                                                                    <div className="inline-flex items-center px-2 py-1 rounded-full border bg-gradient-to-r from-purple-500/20 to-blue-400/20 border-purple-400/30">
                                                                        <span className="text-xs font-medium capitalize text-purple-300">
                                                                            {role}
                                                                        </span>
                                                                    </div>
                                                                    {premium && (<>
                                                                        <div className="inline-flex ml-1 items-center px-2 py-1 rounded-full border bg-gradient-to-r from-amber-500/20 to-amber-400/20 border-amber-400/30">
                                                                            <span className="text-xs font-medium capitalize text-amber-300">
                                                                                premuim
                                                                            </span>
                                                                        </div>
                                                                    </>)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : role === 'staff' ? (
                                                    <>
                                                        {/* User Info Section for Staff */}
                                                        <div className="px-4 py-3 border-b border-green-400/30 bg-gradient-to-r from-green-500/10 to-blue-400/10">
                                                            <div className="flex items-center space-x-3">
                                                                <img
                                                                    src={avatar || "https://i.pravatar.cc/32"}
                                                                    alt="profile"
                                                                    className="w-8 h-8 rounded-full border-2 border-green-500/70"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-semibold truncate mb-1 text-green-300 flex items-center">
                                                                        {firstName} {surName}
                                                                        {premium && (
                                                                            <UserStar className="text-yellow-400 w-[19px] ml-0.5 hover:cursor-pointer" />
                                                                        )}
                                                                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded bg-green-400/20 border border-green-400 text-[10px] font-semibold text-green-200 uppercase tracking-wider animate-pulse">
                                                                            Staff
                                                                        </span>
                                                                    </p>
                                                                    <p className="text-xs truncate mb-1 text-green-200">
                                                                        @{username}
                                                                    </p>
                                                                    <div className="inline-flex items-center px-2 py-1 rounded-full border bg-gradient-to-r from-green-500/20 to-blue-400/20 border-green-400/30">
                                                                        <span className="text-xs font-medium capitalize text-green-300">
                                                                            {role}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* User Info Section for Regular User */}
                                                        <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-orange-500/10 to-blue-500/10">
                                                            <div className="flex items-center space-x-3">
                                                                <img
                                                                    src={avatar || "https://i.pravatar.cc/32"}
                                                                    alt="profile"
                                                                    className="w-8 h-8 rounded-full border-2 border-orange-500/50"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-semibold truncate mb-1 text-white">
                                                                        {firstName} {surName}
                                                                        {premium && (
                                                                            <UserStar className="text-yellow-400 w-[19px] ml-0.5 hover:cursor-pointer" />
                                                                        )}
                                                                    </p>
                                                                    <p className="text-xs truncate mb-1 text-gray-300">
                                                                        @{username}
                                                                    </p>
                                                                    <div className="inline-flex items-center px-2 py-1 rounded-full border bg-gradient-to-r from-orange-500/20 to-blue-500/20 border-orange-500/30">
                                                                        <span className="text-xs font-medium capitalize text-orange-300">
                                                                            {role}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* Menu Items */}
                                                <div className="py-1">
                                                    <a
                                                        href="/profile"
                                                        className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-orange-400 transition-all duration-200 group"
                                                    >
                                                        <User className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
                                                        <span className="text-sm font-medium">Profile</span>
                                                    </a>
                                                    {role === 'admin' && (
                                                        <>
                                                            <a
                                                                href="/adminDashboard"
                                                                className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-pink-400 transition-all duration-200 group"
                                                            >
                                                                <span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
                                                                    </svg>
                                                                </span>
                                                                <span className="text-sm font-medium">Dashboard</span>
                                                            </a>
                                                        </>
                                                    )}

                                                    {owner && (

                                                        <>
                                                            <a
                                                                href="/Dashboard1"
                                                                className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-pink-400 transition-all duration-200 group"
                                                            >
                                                                <span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
                                                                    </svg>
                                                                </span>
                                                                <span className="text-sm font-medium">Dashboard</span>
                                                            </a>
                                                        </>

                                                    )}

                                                    <a
                                                        href="/accountSettings"
                                                        className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-blue-400 transition-all duration-200 group"
                                                    >
                                                        <Settings className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                                                        <span className="text-sm font-medium">Settings</span>
                                                    </a>

                                                    <a
                                                        href="/marketplace"
                                                        className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-amber-400 transition-all duration-200 group"
                                                    >
                                                        <Store className="w-4 h-4 text-amber-700 group-hover:text-amber-300 transition-colors" />
                                                        <span className="text-sm font-medium">Marketplace</span>
                                                    </a>

                                                    <a
                                                        href="#"
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            setProjectsMenuIsOpen(!projectsMenuIsOpen);
                                                        }}
                                                        className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-emerald-400 transition-all duration-200 group relative"
                                                    >
                                                        <Projector className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                                                        <span className="text-sm font-medium">Projects</span>
                                                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${projectsMenuIsOpen ? "rotate-180" : ""}`} />
                                                    </a>
                                                    {projectsMenuIsOpen && (
                                                        <motion.div className="ml-8 mt-1 bg-black border border-white/10 rounded-lg shadow-lg z-50"
                                                            initial={{ opacity: 0, y: 30 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.4, ease: "easeOut" }}>
                                                            <a
                                                                href="/myProjects"
                                                                className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-orange-400 transition-all duration-200 group rounded-t-lg"
                                                            >
                                                                <BriefcaseBusiness className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
                                                                <span className="text-sm font-medium">My Projects</span>
                                                            </a>
                                                            <a
                                                                href="/addProject"
                                                                className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-emerald-400 transition-all duration-200 group rounded-b-lg"
                                                            >
                                                                <Plus className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                                                                <span className="text-sm font-medium">Create a Project</span>
                                                            </a>
                                                            {role === 'admin' || owner && (
                                                                <>
                                                                    <a
                                                                        href="/projectsRequests"
                                                                        className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-fuchsia-800-400 transition-all duration-200 group"
                                                                    >
                                                                        <span>
                                                                            <Atom className="w-4 h-4 text-fuchsia-400 group-hover:text-fuchsia-800 transition-colors" />
                                                                        </span>
                                                                        <span className="text-sm font-medium group-hover:text-fuchsia-400 transition-colors">Projects Requests</span>
                                                                    </a>
                                                                </>
                                                            )}
                                                        </motion.div>
                                                    )}

                                                    <a
                                                        href="/userPortfolio"
                                                        className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-lime-400 transition-all duration-200 group"
                                                    >
                                                        <BriefcaseBusiness className="w-4 h-4 text-lime-400 group-hover:text-lime-300 transition-colors" />
                                                        <span className="text-sm font-medium">Portfolio</span>
                                                    </a>


                                                    <a
                                                        href="/verification"
                                                        className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-cyan-400 transition-all duration-200 group"
                                                    >
                                                        <BadgeCheck className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                                                        <span className="text-sm font-medium">Become Certified</span>
                                                    </a>

                                                    <div className="border-t border-white/10 my-5"></div>

                                                    <a
                                                        href="/lms"
                                                        className="flex items-center border border-blue-500 rounded-2xl space-x-3 hover:bg-cyan-600 hover:text-black px-4 py-3 text-gray-200 transition-all duration-200 group"
                                                    >
                                                        <img src={LMSLogo} className="w-8 h-8 text-zinc-300 group-hover:text-lime-400 transition-colors" />
                                                        <span className="text-sm font-medium">LMS</span>
                                                    </a>

                                                    <div className="border-t border-white/10 my-5"></div>

                                                    <button
                                                        onClick={handleSignOut}
                                                        className="w-full text-left flex items-center hover:cursor-pointer space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
                                                    >
                                                        <LogOut className="w-4 h-4 group-hover:text-red-300 transition-colors" />
                                                        <span className="text-sm font-medium">Logout</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </>
                            )}
                            {!username && (
                                <>
                                    <button onClick={() => window.location.href = '/login'} className="hgroup bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 flex items-center space-x-2 hover:cursor-pointer">
                                        Login
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                    <button onClick={() => window.location.href = '/accountType'} className="border-2 text-[16px] hover:cursor-pointer border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                                        Sign Up
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden header-item text-white hover:text-orange-500 transition-colors duration-300"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm">
                            <div className="py-4">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className="block w-full text-left px-6 py-3 text-white hover:text-orange-500 hover:bg-orange-500/10 transition-all duration-300"
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </nav>
            </header >
        </>
    )
}

export default Navbar;