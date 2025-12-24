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
  
  const isDashboard = location.pathname.startsWith('/admin/dashboard');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when navigating to a new page
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle body scroll locking when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (isDashboard) {
    return null;
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Styles', path: '/styles' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Programs', path: '/programs' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'AI Studio', path: '/knowledge-center' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  // When menu is open, the bar should always be solid to show the close button clearly
  const isSolid = scrolled || isOpen;

  return (
    <>
      <nav className={`fixed w-full z-[100] transition-all duration-300 ${isSolid ? 'bg-white shadow-sm py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <Link to="/" className="flex flex-col items-start group">
              <span className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-none transition-colors ${!isSolid ? 'text-deep-green' : 'text-deep-green'}`}>
                Meraki
              </span>
              <span className="font-sans text-[7px] tracking-[0.4em] font-bold uppercase mt-1 text-gray-400">
                YOGA & HEALING STUDIO
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-sage-green ${
                    location.pathname === link.path ? 'text-sage-green underline underline-offset-4 decoration-2' : 'text-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/admin"
                className={`text-sm font-medium transition-all flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                  location.pathname === '/admin' 
                    ? 'bg-deep-green text-white border-deep-green' 
                    : 'text-gray-500 border-gray-200 hover:border-sage-green hover:text-sage-green'
                }`}
              >
                <Lock size={14} /> 
                <span>Admin</span>
              </Link>
            </div>

            {/* Mobile/Tablet Menu Button */}
            <div className="lg:hidden flex items-center">
              <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                  }} 
                  className="p-2 text-deep-green hover:text-sage-green transition-colors focus:outline-none z-[110]"
                  aria-expanded={isOpen}
                  aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Moved outside nav for cleaner stacking */}
      <div 
        className={`lg:hidden fixed inset-0 z-[90] bg-white transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ paddingTop: '80px' }}
      >
        <div className="h-full overflow-y-auto px-8 pb-12 flex flex-col">
          <div className="space-y-6 flex-grow">
            {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block text-3xl font-serif font-medium transition-colors ${
                      location.pathname === link.path ? 'text-sage-green' : 'text-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-8 mt-auto">
              <Link 
                to="/admin" 
                className="flex items-center gap-3 text-gray-500 hover:text-deep-green font-medium text-xl"
              >
                <Lock size={24} /> Admin Login
              </Link>
              <div className="flex gap-6 mt-8">
                <a href="#" className="text-gray-400 hover:text-sage-green transition-colors"><Instagram size={24} /></a>
                <a href="#" className="text-gray-400 hover:text-sage-green transition-colors"><Facebook size={24} /></a>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Footer = () => {
  const location = useLocation();
  const mapLink = "https://www.google.com/maps/search/?api=1&query=BMR+Mall+No+1+/+398,+OMR,+Navalur,+Chennai+600130";

  if (location.pathname.startsWith('/admin/dashboard')) {
    return null;
  }

  return (
    <footer className="bg-sand-beige/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="col-span-1">
            <Link to="/" className="flex flex-col items-start">
              <span className="font-serif text-2xl font-bold tracking-tight text-deep-green">Meraki</span>
              <span className="font-sans text-[6px] tracking-[0.3em] font-bold uppercase mt-1 text-gray-500">YOGA & HEALING STUDIO</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-xs">
              Curating spaces for mindfulness, breathwork, and holistic physical wellness in the heart of Navalur.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-bold text-deep-green mb-6">Explore</h4>
            <ul className="grid grid-cols-1 gap-3">
              <li><Link to="/styles" className="text-sm text-gray-600 hover:text-sage-green transition-colors">Yoga Styles</Link></li>
              <li><Link to="/schedule" className="text-sm text-gray-600 hover:text-sage-green transition-colors">Class Schedule</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-600 hover:text-sage-green transition-colors">Pricing</Link></li>
              <li><Link to="/blog" className="text-sm text-gray-600 hover:text-sage-green transition-colors">Wellness Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold text-deep-green mb-6">Reach Out</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-sage-green shrink-0 mt-0.5" />
                <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-sage-green transition-colors">
                  BMR Mall No 1 / 398,<br/>OMR, Navalur, Chennai 600130
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-sage-green shrink-0" />
                <a href="mailto:meraki.yoga.healing@gmail.com" className="text-sm text-gray-600 hover:text-sage-green transition-colors">meraki.yoga.healing@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-sage-green shrink-0" />
                <a href="tel:+919769911150" className="text-sm text-gray-600 hover:text-sage-green transition-colors">+91 97699 11150</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold text-deep-green mb-6">Stay Connected</h4>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-white rounded-full text-deep-green hover:bg-sage-green hover:text-white transition-all shadow-sm"><Instagram size={20} /></a>
              <a href="#" className="p-2 bg-white rounded-full text-deep-green hover:bg-sage-green hover:text-white transition-all shadow-sm"><Facebook size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-sand-beige border-opacity-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 text-center md:text-left">© {new Date().getFullYear()} Meraki Yoga & Healing Studio. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* Universal padding-top to account for the fixed navbar height */}
        <main className="flex-grow pt-[60px] lg:pt-[80px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/styles" element={<Styles />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/knowledge-center" element={<KnowledgeCenter />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
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