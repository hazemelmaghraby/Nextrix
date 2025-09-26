import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Login from './components/Registeration/Login';
import AccountType from './components/Registeration/AccountType';
import IndividualSignIn from './components/Registeration/IndividualSignIn';
import CompanySignIn from './components/Registeration/CompanySignIn';
import Profile from './components/Profile/Profile';
import NotFound from './constants/components/NotFound';
import UnderDevelopment from './constants/components/UnderDevelopment';
import MoreInfoForm from './components/Registeration/moreInfo';
import Announcements from './components/Ownership/Announcements';

gsap.registerPlugin(ScrollTrigger);



const Layout = () => {
  const appRef = useRef();

  useEffect(() => {
    // Initial page load animation
    gsap.fromTo(appRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      }
    );
  }, []);

  return (
    <>
      <div ref={appRef} className="min-h-screen bg-black text-white overflow-x-hidden">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};


function App() {



  const router = createBrowserRouter(createRoutesFromElements(
    <Route>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/accountType' element={<AccountType />} />
        <Route path='/individualSignIn' element={<IndividualSignIn />} />
        <Route path='/companySignIn' element={<CompanySignIn />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/subInfo' element={<MoreInfoForm />} />
        <Route path='/announcementsCenter' element={<Announcements />} />
      </Route>
    </Route>
  ))

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
};

export default App;