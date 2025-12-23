import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from './services/dataService.ts';
import { Menu, X, Instagram, Facebook, MapPin, Mail, Phone, Lock } from 'lucide-react';

// Pages
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Styles from './pages/Styles.tsx';
import Programs from './pages/Programs.tsx';
import Schedule from './pages/Schedule.tsx';
import Pricing from './pages/Pricing.tsx';
import Blog from './pages/Blog.tsx';
import BlogPost from './pages/BlogPost.tsx'; 
import Contact from './pages/Contact.tsx';
import KnowledgeCenter from './pages/KnowledgeCenter.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  const isHidden = location.pathname.startsWith('/admin/dashboard');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  if (isHidden) {
    return null;
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Styles', path: '/styles' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Programs', path: '/programs' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'AI Studio', path: '/knowledge-center' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isSolid = scrolled || isOpen;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isSolid ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex flex-col items-start group">
            <span className="font-serif text-3xl font-bold tracking-tight leading-none text-deep-green">
              Meraki
            </span>
            <span className="font-sans text-[7px] tracking-[0.4em] font-bold uppercase mt-1 text-gray-400">
              YOGA & HEALING STUDIO
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-sage-green ${
                  location.pathname === link.path ? 'text-sage-green' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/admin"
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                location.pathname === '/admin' ? 'text-sage-green' : 'text-gray-400 hover:text-deep-green'
              }`}
            >
              <Lock size={14} /> 
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 -mr-2 text-gray-700 hover:text-sage-green transition-colors focus:outline-none"
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-2xl border-t border-gray-100 flex flex-col max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="py-8 px-8 space-y-6">
            {navLinks.map((link) => (
                <Link
                key={link.name}
                to={link.path}
                className={`block text-xl font-medium transition-colors ${
                    location.pathname === link.path ? 'text-sage-green' : 'text-gray-800 hover:text-sage-green'
                }`}
                >
                {link.name}
                </Link>
            ))}
            <div className="border-t border-gray-100 pt-6 mt-4">
                <Link 
                to="/admin" 
                className="flex items-center gap-2 text-gray-500 hover:text-deep-green font-medium text-lg"
                >
                <Lock size={20} /> Admin Login
                </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  const mapLink = "https://www.google.com/maps/search/?api=1&query=BMR+Mall+No1%2F398+OMR+Navalur+Chennai+600130";

  if (location.pathname.startsWith('/admin/dashboard')) {
    return null;
  }

  return (
    <footer className="bg-sand-beige/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <span className="font-serif text-2xl font-bold text-deep-green">Meraki</span>
            <p className="text-gray-600 text-sm leading-relaxed">
              Cultivating peace, strength, and flexibility in body and mind through ancient traditions and modern science.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/meraki_yogaandhealing?igsh=bzh1Zm9hd3I1bGxo" target="_blank" rel="noopener noreferrer">
                <Instagram className="text-gray-500 hover:text-sage-green cursor-pointer" size={20} />
              </a>
              <a href="https://www.facebook.com/share/19VnybP71Z/" target="_blank" rel="noopener noreferrer">
                <Facebook className="text-gray-500 hover:text-sage-green cursor-pointer" size={20} />
              </a>
              <a href={mapLink} target="_blank" rel="noopener noreferrer" title="View on Google Maps">
                <MapPin className="text-gray-500 hover:text-sage-green cursor-pointer" size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-gray-900 mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-sage-green">About Us</Link></li>
              <li><Link to="/styles" className="hover:text-sage-green">Yoga Styles</Link></li>
              <li><Link to="/pricing" className="hover:text-sage-green">Membership</Link></li>
              <li><Link to="/blog" className="hover:text-sage-green">Wellness Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <a href={mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-sage-green transition-colors">
                  <span>BMR Mall No1/398<br />OMR, Navalur, Chennai 600130</span>
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+91 97699 11150</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>sunayanamundra@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-gray-900 mb-4">Newsletter</h3>
            <p className="text-sm text-gray-600 mb-4">Subscribe for weekly wellness tips.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="bg-white px-4 py-2 w-full text-sm outline-none border border-transparent focus:border-sage-green" />
              <button className="bg-sage-green text-white px-4 py-2 hover:bg-deep-green transition-colors">
                →
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 text-center text-xs text-gray-500">
          <p>© 2024 Meraki Yoga Studio. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-warm-white">
        <Navbar />
        <main className="flex-grow transition-all">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/styles" element={<Styles />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/knowledge-center" element={<KnowledgeCenter />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;