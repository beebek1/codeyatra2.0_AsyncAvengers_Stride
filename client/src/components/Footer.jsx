import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import Logo from "../assets/logo_invert.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0b0b0c] text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-12 gap-x-16">

          {/* Brand Section */}
          <div className="lg:col-span-2 max-w-sm">
            <button
              onClick={() => navigate("/")}
              className="flex items-center mb-6"
            >
              <img
                src={Logo}
                alt="Stride"
                className="h-6 w-auto object-contain"
              />
            </button>

            <p className="text-sm leading-relaxed text-gray-500 mb-8">
              Empowering students and professionals to navigate their careers
              with clarity, purpose, and data-driven roadmaps.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
              Product
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Features
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Roadmaps
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
              Company
            </h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
              Resources
            </h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">Community</a></li>
              <li><a href="#" className="hover:text-white transition">Support</a></li>
              <li><a href="#" className="hover:text-white transition">API Status</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Copyright */}
          <div className="text-sm text-gray-500 text-center md:text-left">
            © {currentYear} Stride, Inc. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
          </div>

          {/* Social */}
          <div className="flex space-x-5">
            <a href="#" className="hover:text-white transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:contact@stride.com" className="hover:text-white transition">
              <Mail className="w-5 h-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;