import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';
import Certificates from './Certificates';
import Education from './Education';
import Resume from './Resume';
import Footer from './Footer';
import Sidebar from './sidebar';
import Navbar from './Navbar';
import DarkModeToggle from './DarkModeToggle';
import Background3D from './components/Background3D';
import { useState, useEffect } from 'react';
import Chatbot from './components/Chatbot';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [toggleCount, setToggleCount] = useState(0);
  const [showBackground, setShowBackground] = useState(true);
  
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
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [dark]);

  const handleDarkModeToggle = (newDarkValue) => {
    setDark(newDarkValue);
    setToggleCount(prevCount => {
      const newCount = prevCount + 1;
      if (newCount === 2) {
        setShowBackground(false);
      }
      else if (newCount === 3) {
        setShowBackground(true);
        return 0;
      }
      return newCount;
    });
  };

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setActiveSection(hash);
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
      
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white/20 dark:bg-gray-800/80 hover:bg-secondary/30 dark:hover:bg-gray-700/80 transition transform xl:hidden shadow-md"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <svg className="w-7 h-7 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeSection={activeSection} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-grow">
        {renderActiveSection()}
      </main>

      <Footer />

      <div className="fixed right-4 bottom-6 z-50 flex flex-col items-end">
       <Chatbot onClick={() => setChatOpen(!chatOpen)} isOpen={chatOpen} />
      </div>

      <div className="fixed right-4 top-4 z-50 hidden lg:block">
        <DarkModeToggle dark={dark} setDark={handleDarkModeToggle} toggleCount={toggleCount} />
      </div>
    </div>
  );
}

export default App;