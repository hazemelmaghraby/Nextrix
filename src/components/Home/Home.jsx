import React from 'react';
import useUserData from '../../constants/data/useUserData';
import { signOut } from 'firebase/auth';
import Hero from './Inner/Hero';
import { auth } from '../../constants/firebase';
import Features from './Inner/Features';
import About from './Inner/About';
import Services from './Inner/Services';
import Contact from './Inner/Contact';

const Home = () => {
    return (
        <>
            <Hero />
            <About />
            <Services />
            <Features />
            <Contact />
        </>
    )
}

export default Home;