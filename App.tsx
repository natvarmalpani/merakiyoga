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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (isDashboard) return null;

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

  const INSTAGRAM_URL = "https://www.instagram.com/meraki_yogaandhealing?igsh=MWcweTdwZm8zODk4cQ%3D%3D&utm_source=qr";
  const FACEBOOK_URL = "https://www.facebook.com/share/181EoAbr7H/?mibextid=wwXIfr";

  // More robust home page detection
  const isHomePage = location.pathname === '/' || location.pathname === '' || location.pathname.endsWith('/index.html');
  const isSolid = scrolled || isOpen || !isHomePage;

  return (
    <>
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${isSolid ? 'bg-white shadow-xl py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center h-10">
            <Link to="/" className="flex flex-col items-start group">
              <span className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-none transition-colors text-deep-green`}>
                Meraki
              </span>
              <span className={`font-sans text-[8px] tracking-[0.4em] font-bold uppercase mt-1 transition-colors text-gray-500`}>
                YOGA & HEALING STUDIO
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-sage-green ${
                    isSolid ? 'text-gray-700' : 'text-deep-green'
                  } ${location.pathname === link.path ? 'text-sage-green border-b-2 border-sage-green pb-1' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/admin"
                className={`text-xs font-black transition-all flex items-center gap-2 px-5 py-2 rounded-full border-2 uppercase tracking-widest ${
                  isSolid 
                    ? 'text-gray-600 border-gray-200 hover:border-sage-green hover:text-sage-green'
                    : 'text-deep-green border-deep-green/20 hover:bg-deep-green hover:text-white'
                }`}
              >
                <Lock size={12} /> 
                <span>Admin</span>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center">
              <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)} 
                className={`p-2 transition-all rounded-full focus:outline-none z-[110] ${
                    isOpen ? 'text-deep-green bg-gray-100 shadow-inner' : 'text-deep-green'
                }`}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X size={32} strokeWidth={2.5} /> : <Menu size={32} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 z-[95] bg-white transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <div className="h-full flex flex-col pt-32 pb-12 px-10 overflow-y-auto bg-warm-white">
          <div className="flex-1 space-y-6">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block text-4xl font-serif font-bold transition-all transform ${
                  isOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                } ${location.pathname === link.path ? 'text-sage-green' : 'text-deep-green'}`}
                style={{ transitionDelay: `${idx * 40}ms` }}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-12 border-t border-gray-200 mt-12">
            <Link 
              to="/admin" 
              className="flex items-center gap-4 text-gray-400 hover:text-deep-green font-black uppercase tracking-[0.2em] text-sm mb-10"
            >
              <Lock size={20} /> Access Admin
            </Link>
            <div className="flex gap-10">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-sage-green transition-transform hover:scale-125"><Instagram size={32} /></a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-sage-green transition-transform hover:scale-125"><Facebook size={32} /></a>
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
  const INSTAGRAM_URL = "https://www.instagram.com/meraki_yogaandhealing?igsh=MWcweTdwZm8zODk4cQ%3D%3D&utm_source=qr";
  const FACEBOOK_URL = "https://www.facebook.com/share/181EoAbr7H/?mibextid=wwXIfr";

  if (location.pathname.startsWith('/admin/dashboard')) return null;

  return (
    <footer className="bg-deep-green text-warm-white pt-24 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="col-span-1">
            <Link to="/" className="flex flex-col items-start">
              <span className="font-serif text-3xl font-bold tracking-tight text-white">Meraki</span>
              <span className="font-sans text-[8px] tracking-[0.4em] font-bold uppercase mt-1 text-sage-green">YOGA & HEALING STUDIO</span>
            </Link>
            <p className="mt-8 text-warm-white/60 leading-relaxed max-w-xs font-light">
              Crafting sacred spaces for mindfulness, conscious movement, and collective healing in Navalur.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-xl font-bold text-white mb-8">Navigation</h4>
            <ul className="space-y-4">
              <li><Link to="/styles" className="text-warm-white/60 hover:text-sage-green transition-colors font-medium">Yoga Disciplines</Link></li>
              <li><Link to="/schedule" className="text-warm-white/60 hover:text-sage-green transition-colors font-medium">Studio Timetable</Link></li>
              <li><Link to="/pricing" className="text-warm-white/60 hover:text-sage-green transition-colors font-medium">Memberships</Link></li>
              <li><Link to="/blog" className="text-warm-white/60 hover:text-sage-green transition-colors font-medium">Wellness Journal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold text-white mb-8">Reach Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin size={20} className="text-sage-green shrink-0 mt-1" />
                <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-warm-white/60 hover:text-sage-green transition-colors leading-relaxed text-sm">
                  BMR Mall No 1 / 398,<br/>OMR, Navalur, Chennai 600130
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={20} className="text-sage-green shrink-0" />
                <a href="mailto:meraki.yoga.healing@gmail.com" className="text-warm-white/60 hover:text-sage-green transition-colors break-all text-sm">meraki.yoga.healing@gmail.com</a>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={20} className="text-sage-green shrink-0" />
                <a href="tel:+919769911150" className="text-warm-white/60 hover:text-sage-green transition-colors font-medium text-sm">+91 97699 11150</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold text-white mb-8">Follow</h4>
            <div className="flex items-center gap-6">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-full text-white hover:bg-sage-green hover:text-deep-green transition-all shadow-xl transform hover:-translate-y-2"><Instagram size={24} /></a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-full text-white hover:bg-sage-green hover:text-deep-green transition-all shadow-xl transform hover:-translate-y-2"><Facebook size={24} /></a>
            </div>
          </div>
        </div>
        
        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm text-warm-white/40 font-medium text-center">© {new Date().getFullYear()} Meraki Yoga & Healing. Built for peace.</p>
          <div className="flex gap-10 text-[10px] text-warm-white/20 font-black uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-sage-green transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-sage-green transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-warm-white">
        <Navbar />
        <main className="flex-grow flex flex-col">
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