import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BiLogoLinkedin, 
  BiLogoGithub, 
  BiLogoInstagram,
  BiLogoDiscord 
} from 'react-icons/bi';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gfg-black text-gfg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gfgsc-green">GFGSC</h3>
            <p className="text-sm text-gray-400 max-w-xs">
              Empowering students through technology, innovation, and collaborative learning.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gfgsc-green transition-colors duration-200">
                <BiLogoLinkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gfgsc-green transition-colors duration-200">
                <BiLogoGithub className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gfgsc-green transition-colors duration-200">
                <BiLogoInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gfgsc-green transition-colors duration-200">
                <BiLogoDiscord className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/teams" className="text-gray-400 hover:text-gfgsc-green transition-colors duration-200">
                  Teams
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="text-gray-400 hover:text-gfgsc-green transition-colors duration-200">
                  Events Calendar
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-gray-400 hover:text-gfgsc-green transition-colors duration-200">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Join Our Community</h4>
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Stay updated with our latest events and achievements.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-gfgsc-green"
                />
                <button className="px-4 py-2 bg-gfgsc-green text-white rounded-r-md hover:bg-opacity-90 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center text-sm text-gray-400">
            <p>© {year} GeeksforGeeks Student Chapter. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;