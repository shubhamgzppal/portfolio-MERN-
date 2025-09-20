import dynamic from 'next/dynamic'
import Head from 'next/head'
import React, { useState, useEffect } from 'react'

import Hero from '../components/Hero.jsx'
import About from './About.jsx'
import Projects from './Projects.jsx'
import Contact from './Contact.jsx'
import Certificates from './Certificates.jsx'
import Education from './Education.jsx'
import Resume from './Resume.jsx'
import Footer from '../components/Footer.jsx'
import Sidebar from '../components/sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import Background3D from '../components/Background3D.jsx'
import Chatbot from '../components/Chatbot.jsx'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [dark, setDark] = useState(false); 
  const [showBackground, setShowBackground] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const root = typeof window !== 'undefined' ? window.document.documentElement : null;
    if (!root) return;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setShowTop(typeof window !== 'undefined' ? window.scrollY > 300 : false);
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setActiveSection(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;
    function handleEscape(e) {
      if (e.key === 'Escape') setSidebarOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <Hero />;
      case 'about':
        return <About />;
      case 'projects':
        return <Projects />;
      case 'education':
        return <Education />;
      case 'certificates':
        return <Certificates />;
      case 'resume':
        return <Resume />;
      case 'contact':
        return <Contact />;
      default:
        return <Hero />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {showBackground && <Background3D theme={dark ? 'dark' : 'light'} section={activeSection} />}
      
      <button className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white/20 dark:bg-gray-800/80 hover:bg-secondary/30 dark:hover:bg-gray-700/80 transition transform xl:hidden shadow-md"
        onClick={() => setSidebarOpen(true)} aria-label="Open menu" style={{ backdropFilter: 'blur(10px)', pointerEvents:"auto" }}
      >
        <svg className="w-7 h-7 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeSection={activeSection} dark={dark} setDark={setDark} showBackground={showBackground} setShowBackground={setShowBackground} setActiveSection={setActiveSection} />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} dark={dark} setDark={setDark} showBackground={showBackground} setShowBackground={setShowBackground} />
      
      <main className="flex-grow">
        {renderActiveSection()}
      </main>

      <Footer />

      <div className="fixed right-4 bottom-6 z-50 flex flex-col items-end"><Chatbot onClick={() => setChatOpen(!chatOpen)} isOpen={chatOpen} /></div>
    </div>
  );
}

const ClientApp = dynamic(() => Promise.resolve(() => <App />), { ssr: false })

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Shubham Portfolio</title>
      </Head>
      <ClientApp />
    </>
  )
}
