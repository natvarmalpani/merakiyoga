import React, { useEffect, useState } from 'react';
import { Link } from '../services/dataService.ts';
import { ArrowRight, Leaf, Heart, Sun, Star, User } from 'lucide-react';
// @ts-ignore
import * as framerMotion from 'framer-motion';
import { getFeedback } from '../services/feedbackService.ts';
import { CustomerFeedback } from '../types.ts';

// Robust motion component fallback
const motion = (framerMotion as any).motion || {
  div: ({ children, className, style }: any) => <div className={className} style={style}>{children}</div>,
  p: ({ children, className, style }: any) => <p className={className} style={style}>{children} </p>,
  h1: ({ children, className, style }: any) => <h1 className={className} style={style}>{children}</h1>,
  h2: ({ children, className, style }: any) => <h2 className={className} style={style}>{children}</h2>
};

const Home = () => {
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getFeedback();
        setFeedback(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch feedback", error);
      }
    };
    fetchTestimonials();
  }, []);

  const heroImageUrl = "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2400&auto=format&fit=crop";

  return (
    <div className="w-full flex flex-col bg-warm-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Absolute Background Layer - Fixed visibility issues */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        >
          {/* Subtle gradient to ease text readability without hiding the image */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-warm-white/90"></div>
          <div className="absolute inset-0 bg-black/5"></div>
        </div>
        
        {/* Content Container - Ensure it stays above the background */}
        <div className="relative z-10 text-center max-w-6xl px-6 py-20 mt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-deep-green leading-[1.1] mb-8 tracking-tighter drop-shadow-sm">
              Find Your <br />
              <span className="italic">Sanctuary</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-2xl lg:text-3xl text-gray-900 mb-12 max-w-3xl mx-auto leading-relaxed font-bold drop-shadow-sm"
          >
            A dedicated space for <span className="text-deep-green font-black underline decoration-sage-green/40 underline-offset-4">mindful movement</span>, breathwork, and holistic growth in Chennai.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link 
              to="/schedule" 
              className="w-full sm:w-auto bg-deep-green text-white py-4 px-10 rounded-full hover:bg-black transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 shadow-xl transform hover:scale-105"
            >
              Book Your Class <ArrowRight size={20} />
            </Link>
            <Link 
              to="/knowledge-center" 
              className="w-full sm:w-auto bg-white/90 backdrop-blur-md text-deep-green border-2 border-deep-green/10 py-4 px-10 rounded-full hover:bg-white transition-all duration-300 font-bold text-lg flex items-center justify-center shadow-lg transform hover:scale-105"
            >
              AI Yoga Studio
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 text-deep-green/60">
          <span className="text-[10px] uppercase tracking-[0.6em] font-black">Explore</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-deep-green/60 to-transparent"></div>
        </div>
      </section>

      {/* Path Selection Section */}
      <section className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-serif text-5xl md:text-7xl text-deep-green mb-8">Choose Your Practice</h2>
            <p className="text-gray-500 text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">Tailored experiences for every body, every mind, and every soul.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Leaf size={48} />, title: "Stress Relief", desc: "Gentle restorative flows designed to quiet the noise and restore your inner calm." },
              { icon: <Heart size={48} />, title: "Flexibility", desc: "Expand your physical and mental horizons through intentional, flowing movements." },
              { icon: <Sun size={48} />, title: "Power & Flow", desc: "Build sustainable strength and find your rhythmic flow in dynamic sequences." }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-warm-white p-12 rounded-[3rem] shadow-sm border border-gray-100 text-center hover:shadow-2xl transition-all duration-500 cursor-default group"
              >
                <div className="text-sage-green mb-8 flex justify-center group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h3 className="font-serif text-3xl font-bold mb-6 text-deep-green">{item.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {feedback.length > 0 && (
        <section className="bg-sand-beige/5 py-32 border-t border-sand-beige/10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="font-serif text-5xl md:text-7xl text-deep-green mb-24 italic">Voices from the Community</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {feedback.map((item) => (
                <div key={item.id} className="bg-white p-12 rounded-[3.5rem] shadow-sm text-left flex flex-col h-full border border-gray-100">
                  <div className="flex text-yellow-400 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill={i < item.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-gray-700 italic leading-relaxed mb-10 flex-grow text-lg">"{item.quote}"</p>
                  <div className="flex items-center gap-5 pt-8 border-t border-gray-50">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <User className="w-full h-full p-3 text-gray-300" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base uppercase tracking-tight">{item.name}</h4>
                      <span className="text-xs text-sage-green font-black uppercase tracking-widest">{item.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;