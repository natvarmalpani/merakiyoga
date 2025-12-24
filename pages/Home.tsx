import React, { useEffect, useState } from 'react';
import { Link } from '../services/dataService.ts';
import { ArrowRight, Leaf, Heart, Sun, Star, User } from 'lucide-react';
// @ts-ignore - bypassing broken framer-motion types in this environment
import { motion as framerMotion } from 'framer-motion';
const motion = framerMotion as any;
import { getFeedback } from '../services/feedbackService.ts';
import { CustomerFeedback } from '../types.ts';

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
    <div className="overflow-x-hidden">
      {/* Hero Section - Full width, flat design */}
      <section className="relative h-[calc(100vh-60px)] lg:h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-warm-white">
        {/* Background Layer - Removed all rounding and shadows */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImageUrl} 
            alt="Yoga Sanctuary" 
            className="w-full h-full object-cover opacity-90"
          />
          {/* Subtle overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-warm-white/20"></div>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 text-center max-w-5xl px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl text-deep-green leading-tight mb-8 tracking-tight drop-shadow-sm">
              Find Your Inner <br className="hidden md:block" />
              <span className="italic text-deep-green/80">Sanctuary</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-xl lg:text-2xl text-gray-800 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Join a community dedicated to <span className="font-semibold">mindful movement</span>, breathwork, and holistic wellness in the heart of Navalur.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link 
              to="/schedule" 
              className="w-full sm:w-auto bg-sage-green text-white py-4 px-10 rounded-full hover:bg-deep-green transition-all duration-300 font-medium text-lg flex items-center justify-center gap-2 shadow-lg transform hover:-translate-y-1"
            >
              Book a Class <ArrowRight size={20} />
            </Link>
            <Link 
              to="/knowledge-center" 
              className="w-full sm:w-auto bg-white/90 backdrop-blur-md text-deep-green border border-gray-200 py-4 px-10 rounded-full hover:bg-white transition-all duration-300 font-medium text-lg flex items-center justify-center shadow-md transform hover:-translate-y-1"
            >
              AI Routine
            </Link>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-deep-green/30"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-deep-green/30 to-transparent"></div>
        </motion.div>
      </section>

      {/* Choose Your Path Section */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-warm-white">
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl md:text-6xl text-deep-green mb-6">Choose Your Path</h2>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">Whether you seek stillness or strength, we have the space for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            { icon: <Leaf size={40} />, title: "Stress Relief", desc: "Calming flows and restorative practices designed to unburden your mind." },
            { icon: <Heart size={40} />, title: "Flexibility", desc: "Open up your body and improve mobility through purposeful movement." },
            { icon: <Sun size={40} />, title: "Strength", desc: "Build functional power and inner stability through intentional poses." }
          ].map((item, idx) => (
            <motion.div 
              whileHover={{ y: -10 }}
              key={idx} 
              className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 text-center hover:shadow-xl transition-all duration-500"
            >
              <div className="text-sage-green mb-6 flex justify-center">{item.icon}</div>
              <h3 className="font-serif text-2xl font-semibold mb-4 text-deep-green">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-sand-beige/10 py-24 md:py-32 border-t border-sand-beige/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-4xl md:text-6xl text-deep-green mb-20">Stories from the Mat</h2>
            
            {feedback.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {feedback.map((item) => (
                        <div key={item.id} className="bg-white p-10 rounded-[2.5rem] shadow-sm text-left flex flex-col h-full border border-transparent hover:border-sage-green/20 transition-all">
                            <div className="flex text-yellow-400 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < item.rating ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-8 flex-grow">"{item.quote}"</p>
                            <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-full h-full p-2 text-gray-300" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                                    <span className="text-xs text-sage-green font-semibold uppercase tracking-wider">{item.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center text-gray-400 py-10">
                     <p>Our community stories are blooming soon...</p>
                 </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default Home;