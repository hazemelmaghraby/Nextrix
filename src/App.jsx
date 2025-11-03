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
import PricingSection from './components/Pricing/Pricing';
import ODashboard from './components/Ownership/OwnershipDashboard/ODashboard';
import AccountsPanel from './components/Ownership/OwnershipDashboard/AccountsPanel/AccountsPanel';
import Verification from './components/Verification/Verification';
import CreateProject from './components/Projects/CreateProject/CreateProject';
import Portfolio from './components/Portfolio/Portfolio';
import AccountSettings from './components/Settings/AccountSettings';
import AccountProjects from './components/Projects/AccountProjectsList/AccountProjectsList'
import AdminDashboard from './components/Admins/Dashboard/AdminDashboard';
import AdminProjectsManager from './components/ManagementsCommon/AllProjects/AllProjects';
import Demo from './components/ManagementsCommon/AllProjects/ProjectsList';
import ProjectsList from './components/ManagementsCommon/AllProjects/ProjectsList';
import OurTeam from './components/OurTeam/OurTeam';
import AccountsList from './components/PublicProfile/AccountsList';
import AccountProfile from './components/PublicProfile/AccountProfile';
import Financials from './components/Ownership/OwnershipDashboard/Financials/Financials';
import AdminsManagement from './components/Ownership/OwnershipDashboard/AdminsManagement/AdminsManagement';
import Marketplace from './components/Marketplace/Marketplace';
import Cart from './components/Marketplace/Cart/Cart';
import Books from './components/Marketplace/Books/Books';
import SessionCodesMarketplace from './components/Marketplace/SessionsCodes/SessionCodesMarketplace';
import Courses from './components/LMS/Courses/Courses';
import LMSHome from './components/LMS/Home/LMSHome';
// import AccountSettingsDemo from './components/Settings/demo';

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
        <Route path='/pricing' element={<PricingSection />} />
        <Route path='/Dashboard1' element={<ODashboard />} />
        <Route path='/accountsPanel' element={<AccountsPanel />} />
        <Route path='/financials' element={<Financials />} />
        <Route path='/adminsManagement' element={<AdminsManagement />} />
        <Route path='/verification' element={<Verification />} />
        <Route path='/addProject' element={<CreateProject />} />
        <Route path='/userPortfolio' element={<Portfolio />} />
        <Route path='/accountSettings' element={<AccountSettings />} />
        <Route path='/myProjects' element={<AccountProjects />} />
        <Route path='/adminDashboard' element={<AdminDashboard />} />
        <Route path='/projectsRequests' element={<ProjectsList />} />
        <Route path='/ourTeam' element={<OurTeam />} />
        <Route path='/demo' element={<Demo />} />
        <Route path='/accs' element={<AccountsList />} />
        <Route path='/accs/:uid' element={<AccountProfile />} />
        <Route path='/marketplace' element={<Marketplace />} />
        <Route path='/marketplace/books' element={<Books />} />
        <Route path='/marketplace/sessionCodes' element={<SessionCodesMarketplace />} />
        <Route path='/lms/courses' element={<Courses />} />
        <Route path='/lms' element={<LMSHome />} />
        <Route path='/cart' element={<Cart />} />
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