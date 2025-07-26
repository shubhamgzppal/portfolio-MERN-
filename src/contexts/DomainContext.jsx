import { createContext, useContext, useState } from 'react';

const DomainContext = createContext();

export const domains = {
  FULL_STACK: {
    title: "Full Stack Developer",
    icon: "💻",
    description: "passionate about building seamless, high-performance web experiences from concept to deployment",
    skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Tailwind CSS', 'Git']
  },
  DATA_SCIENCE: {
    title: "Data Scientist",
    icon: "📊",
    description: "dedicated to extracting insights from data and building intelligent solutions using machine learning",
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn']
  }
};

export function DomainProvider({ children }) {
  const [currentDomain, setCurrentDomain] = useState('FULL_STACK');

  const toggleDomain = () => {
    setCurrentDomain(prev => prev === 'FULL_STACK' ? 'DATA_SCIENCE' : 'FULL_STACK');
  };

  return (
    <DomainContext.Provider value={{ currentDomain, toggleDomain, domainData: domains[currentDomain] }}>
      {children}
    </DomainContext.Provider>
  );
}

export const useDomain = () => useContext(DomainContext);
