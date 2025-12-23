import React, { useEffect, useState } from 'react';
import { Link } from '../services/dataService.ts';
import { ArrowRight, Leaf, Heart, Sun, Star, User } from 'lucide-react';
// @ts-ignore - bypassing broken framer-motion types
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

  // Standard Unsplash Yoga Image
  const heroImageUrl = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section 
        className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-warm-white"
        style={{
          backgroundImage: `url(${heroImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlays for that premium airy aesthetic */}
        <div className="absolute inset-0 bg-white/40 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-warm-white/100 z-0"></div>
        
        {/* Content Container - Higher z-index to ensure visibility */}
        <div className="relative z-10 text-center max-w-4xl px-6 pt-20 md:pt-0">
          <motion.div
            initial={{ opacity: 0.01, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1 className="font-serif text-5xl md:text-8xl text-deep-green leading-tight mb-0 tracking-tight">
              Find Your Inner
            </h1>
            <h1 className="font-serif text-6xl md:text-9xl italic text-deep-green/90 font-normal leading-none mb-10">
              Sanctuary
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0.01, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-xl text-deep-green/80 mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Join a community dedicated to <span className="font-semibold text-deep-green">mindful</span> movement, breathwork, and holistic wellness. Experience yoga that transforms body and mind.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0.01, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-4 justify-center items-center w-full max-w-xs mx-auto"
          >
            <Link 
              to="/schedule" 
              className="w-full bg-sage-green text-white py-4 px-8 rounded-full hover:bg-deep-green transition-all duration-500 font-medium text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Book a Class <ArrowRight size={20} />
            </Link>
            <Link 
              to="/knowledge-center" 
              className="w-full bg-white text-deep-green border border-gray-200 py-4 px-8 rounded-full hover:bg-gray-50 transition-all duration-500 font-medium text-lg flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Try AI Routine
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Goal Selection */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-warm-white">
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl md:text-5xl text-deep-green mb-4">Choose Your Path</h2>
          <p className="text-gray-500 text-lg">Whatever your goal, we have a practice for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: <Leaf size={40} />, title: "Stress Relief", desc: "Calming flows to unburden your mind and restore your central nervous system." },
            { icon: <Heart size={40} />, title: "Flexibility", desc: "Open up your body and improve mobility through purposeful movement." },
            { icon: <Sun size={40} />, title: "Strength", desc: "Build power, balance, and endurance mindfully without the burnout." }
          ].map((item, idx) => (
            <motion.div 
              whileHover={{ y: -10 }}
              key={idx} 
              className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all duration-500"
            >
              <div className="text-sage-green mb-8 flex justify-center">{item.icon}</div>
              <h3 className="font-serif text-2xl font-semibold mb-4 text-deep-green">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-sand-beige/10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-4xl md:text-5xl text-center text-deep-green mb-16">Stories from the Mat</h2>
            
            {feedback.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {feedback.map((item) => (
                        <div key={item.id} className="bg-white p-10 rounded-3xl shadow-sm border border-white hover:border-sage-green/20 transition-all duration-300">
                            <div className="flex text-yellow-400 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill={i < item.rating ? "currentColor" : "none"} className={i >= item.rating ? "text-gray-200" : ""} />
                                ))}
                            </div>
                            <p className="text-gray-700 italic mb-8 text-lg leading-relaxed">"{item.quote}"</p>
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-warm-white">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-full h-full p-3 text-gray-300" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                                    <span className="text-sm text-sage-green font-medium">{item.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center text-gray-400 py-10">
                     <p className="font-serif italic text-xl">Our community stories are blooming soon...</p>
                 </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default Home;