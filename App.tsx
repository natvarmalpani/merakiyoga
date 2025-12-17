import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from './services/dataService';
import { Menu, X, Instagram, Facebook, MapPin, Mail, Phone, Lock } from 'lucide-react';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Styles from './pages/Styles';
import Programs from './pages/Programs';
import Schedule from './pages/Schedule';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost'; // Imported BlogPost component
import Contact from './pages/Contact';
import KnowledgeCenter from './pages/KnowledgeCenter';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Determine if we should hide the navbar, but DO NOT return yet
  const isHidden = location.pathname.startsWith('/admin/dashboard');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // SAFE TO RETURN HERE: All hooks have been called
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

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex flex-col items-start group">
            <span className={`font-serif text-2xl font-bold tracking-tight leading-none ${scrolled ? 'text-deep-green' : 'text-deep-green'}`}>
              Meraki
            </span>
            <span className={`font-sans text-[10px] tracking-[0.2em] font-medium uppercase mt-0.5 ${scrolled ? 'text-sage-green' : 'text-sage-green'}`}>
              Yoga & Healing Studio
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
            {/* Admin Login Link (Desktop) */}
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
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-sage-green">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-lg py-4 px-6 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-700 hover:text-sage-green font-medium"
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-2 mt-2">
            <Link 
              to="/admin" 
              className="flex items-center gap-2 text-gray-500 hover:text-deep-green font-medium text-sm"
            >
              <Lock size={14} /> Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  const mapLink = "https://www.google.com/maps/search/?api=1&query=BMR+Mall+No1%2F398+OMR+Navalur+Chennai+600130";

  // Hide Footer on Admin Dashboard
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
        <main className="flex-grow pt-20 transition-all">
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
