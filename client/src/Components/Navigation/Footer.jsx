import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BiLogoLinkedin, 
  BiLogoInstagram 
} from 'react-icons/bi';
import { FaXTwitter } from 'react-icons/fa6';
import { SiGeeksforgeeks } from 'react-icons/si';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gfg-black text-gfg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <SiGeeksforgeeks className="w-12 h-12 text-gfgsc-green-400" />
              <h3 className="text-2xl font-bold text-gfgsc-green-400">SRM Ramapuram</h3>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Empowering students through technology, innovation, and collaborative learning.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gfgsc-green transition-colors duration-200">
                <BiLogoLinkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gfgsc-green transition-colors duration-200">
                <BiLogoInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gfgsc-green transition-colors duration-200">
                <FaXTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gfgsc-green-400">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-gfgsc-green-400 transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-gray-400 hover:text-gfgsc-green-400 transition-colors duration-200">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/teams" className="text-gray-400 hover:text-gfgsc-green-400 transition-colors duration-200">
                  Teams
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-400 hover:text-gfgsc-green-400 transition-colors duration-200">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gfgsc-green-400">Support & Policies</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/support/report-issue" className="text-gray-400 hover:text-gfgsc-green-400 transition-colors duration-200">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link to="/support/terms" className="text-gray-400 hover:text-gfgsc-green-400 transition-colors duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/user-manual" className="text-gray-400 hover:text-gfgsc-green-400 transition-colors duration-200">
                  User Manual
                </Link>
              </li>
              <li>
                <Link to="/support/privacy" className="text-gray-400 hover:text-gfgsc-green-400 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
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