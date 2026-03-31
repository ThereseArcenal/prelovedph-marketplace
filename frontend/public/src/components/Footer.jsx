import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="container-custom text-center">
          <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
          <p className="mb-6 text-emerald-50">Get the latest deals and sustainability tips delivered to your inbox</p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 text-slate-900"
            />
            <button
              type="submit"
              className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">♻️</span>
              <span className="text-2xl font-bold text-white">PrelovedPH</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Give items a second chance. Buy and sell pre-loved items sustainably in the Philippines.
            </p>
            <div className="flex items-center space-x-2 text-emerald-400">
              <FiHeart className="fill-current" />
              <span className="text-sm">Sustainable shopping made easy</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/listings" className="hover:text-emerald-400 transition-colors">Browse Items</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">For Sellers</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/create-listing" className="hover:text-emerald-400 transition-colors">Sell an Item</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Selling Tips</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Pricing Guide</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Help Center</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Safety Tips</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Report Issue</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Get in Touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <FiMail className="text-emerald-400 mt-1 flex-shrink-0" />
                <span>support@prelovedph.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiPhone className="text-emerald-400 mt-1 flex-shrink-0" />
                <span>+63 (32) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiMapPin className="text-emerald-400 mt-1 flex-shrink-0" />
                <span>Cebu City, Philippines</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <span className="text-white font-semibold">Follow Us:</span>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <FiTwitter size={20} />
              </a>
            </div>

            <div className="text-center md:text-right text-sm text-slate-500">
              <p>&copy; {currentYear} PrelovedPH. All rights reserved.</p>
              <div className="flex justify-center md:justify-end gap-4 mt-2">
                <Link to="/" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 bg-opacity-50 py-4 border-t border-slate-700">
        <div className="container-custom text-center text-sm text-slate-500">
          <p>Made with <span className="inline-block animate-pulse">❤️</span> for sustainable living in the Philippines</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
