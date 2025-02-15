import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const content = {
  'getting-started': {
    title: 'Getting Started',
    subsections: {
      'installation': { title: 'Installation', content: 'Instructions for installation.' },
      'quick-start': { title: 'Quick Start', content: 'A quick overview of the initial setup.' },
      'basic-usage': { title: 'Basic Usage', content: 'How to use the basic features of the framework.' }
    }
  },
  'advanced-engine': {
    title: 'Advanced Usage',
    subsections: {
      'configuration': { title: 'Configuration', content: 'Detailed instructions for configuration.' },
      'performance-tuning': { title: 'Performance Tuning', content: 'How to optimize the performance.' }
    }
  }
};

const NavigationMenu = ({ activeSection, handleNavigation, onClose }) => (
  <div className="h-full overflow-y-auto">
    {Object.entries(content).map(([key, section], index) => (
      <div key={key} className="mb-4">
        <div className="flex justify-between items-center">
          <h2
            className="text-xl font-semibold text-emerald-600 cursor-pointer hover:text-emerald-400"
            onClick={() => handleNavigation(key)}
          >
            {section.title}
          </h2>
          
          {index === 0 && (
            <button
              onClick={onClose}
              className="md:hidden p-0 hover:bg-emerald-50 rounded-lg text-emerald-600"
            >
              <FaTimes size={24} />
            </button>
          )}
        </div>
        {activeSection === key && (
          <ul className="space-y-2 mt-2 ml-4">
            {Object.entries(section.subsections).map(([subKey, sub]) => (
              <li key={subKey} className="text-sm text-gray-600">
                {sub.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
);

const UserManual = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [currentSection, setCurrentSection] = useState('getting-started');

  useEffect(() => {
    if (content[currentSection]) {
      setActiveSection('getting-started');
    } else {
      setCurrentSection('getting-started');
    }
  }, [currentSection]);

  const handleNavigation = (section) => {
    if (section === activeSection) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
    setCurrentSection(section);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('mobile-sidebar');
      if (isMenuOpen && sidebar && !sidebar.contains(event.target) && !event.target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <div className="flex flex-col h-full bg-white">
        {/* Navigation bar with aligned padding */}
        <nav className="flex items-center justify-between py-4 border-b border-gray-200 px-4 md:px-8">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-4xl font-bold text-black">User Manual</h1>
          </div>
          <button
            className="md:hidden p-0 hover:bg-emerald-50 rounded-lg text-emerald-600 menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars size={24} />
          </button>
        </nav>

        <div className="flex flex-1 relative overflow-hidden">
          <div
            className={`absolute inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          />

          <div
            id="mobile-sidebar"
            className={`absolute md:hidden top-0 left-0 h-full w-full bg-white transform transition-transform duration-300 ease-in-out z-50 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="p-4 h-full overflow-y-auto">
              <NavigationMenu
                activeSection={activeSection}
                handleNavigation={handleNavigation}
                onClose={handleCloseMenu}
              />
            </div>
          </div>

          <aside className="hidden md:block w-64 bg-white border-r border-gray-200">
            <div className="p-4 h-full overflow-y-auto">
              <NavigationMenu
                activeSection={activeSection}
                handleNavigation={handleNavigation}
              />
            </div>
          </aside>

          {/* Main content with aligned padding */}
          <main className="flex-1 overflow-y-auto px-4">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-600">
                {content[currentSection]?.title || 'Section Not Found'}
              </h2>
            </div>
            <div className="space-y-6">
              {Object.entries(content[currentSection]?.subsections || {}).map(([subKey, sub]) => (
                <div key={subKey}>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-emerald-600 mb-2">
                    {sub.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">{sub.content}</p>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserManual;