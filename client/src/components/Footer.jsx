import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-gray-300 py-12 border-t border-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Grid for Links and Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand & Mission */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <Compass className="w-8 h-8 text-white mr-2" />
              <span className="text-2xl font-bold text-white tracking-tight">Stride</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Empowering students and professionals to navigate their careers with clarity, purpose, and data-driven roadmaps.
            </p>
            {/* Newsletter Signup (Visual only for hackathon) */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Stay Updated</h3>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-white rounded-l-md focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-white text-black hover:bg-gray-200 px-4 py-2 text-sm font-medium rounded-r-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-base hover:text-white transition-colors">Features</Link></li>
              <li><a href="#" className="text-base hover:text-white transition-colors">Roadmaps</a></li>
              <li><a href="#" className="text-base hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="text-base hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-base hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-base hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-base hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-base hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 4: Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-base hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-base hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="text-base hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="text-base hover:text-white transition-colors">API Status</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 md:flex md:items-center md:justify-between">
          
          {/* Social Media Icons */}
          <div className="flex space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Twitter</span>
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">GitHub</span>
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="mailto:contact@stride.com" className="text-gray-400 hover:text-white">
              <span className="sr-only">Email</span>
              <Mail className="w-6 h-6" />
            </a>
          </div>
          
          {/* Copyright & Legal */}
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-base text-gray-400 text-center md:text-left">
              &copy; {currentYear} Stride, Inc. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center md:justify-start space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;