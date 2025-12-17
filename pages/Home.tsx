import React, { useEffect, useState } from 'react';
import { Link } from '../services/dataService';
import { ArrowRight, Leaf, Heart, Sun, Star, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { getFeedback } from '../services/feedbackService';
import { CustomerFeedback } from '../types';

const Home = () => {
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
        try {
            const data = await getFeedback();
            // Take the most recent 3 testimonials
            setFeedback(data.slice(0, 3));
        } catch (error) {
            console.error("Failed to fetch feedback", error);
            // Fallback or leave empty
        }
    };
    fetchTestimonials();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=1920&auto=format&fit=crop" 
                alt="Yoga background" 
                className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-warm-white/90"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl font-medium text-deep-green mb-6"
          >
            Find Your Inner <span className="italic text-sage-green">Sanctuary</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto"
          >
            Join a community dedicated to mindful movement, breathwork, and holistic wellness. Experience yoga that transforms body and mind.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/schedule" className="bg-sage-green text-white px-8 py-3 rounded-full hover:bg-deep-green transition-colors font-medium flex items-center justify-center gap-2">
              Book a Class <ArrowRight size={18} />
            </Link>
            <Link to="/knowledge-center" className="bg-white text-deep-green border border-sage-green px-8 py-3 rounded-full hover:bg-sage-green/10 transition-colors font-medium">
              Try AI Routine
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Goal Selection */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-deep-green mb-4">Choose Your Path</h2>
          <p className="text-gray-600">Whatever your goal, we have a practice for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Leaf size={32} />, title: "Stress Relief", desc: "Calming flows to unburden your mind." },
            { icon: <Heart size={32} />, title: "Flexibility", desc: "Open up your body and improve mobility." },
            { icon: <Sun size={32} />, title: "Strength", desc: "Build power and endurance mindfully." }
          ].map((item, idx) => (
            <motion.div 
              whileHover={{ y: -10 }}
              key={idx} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-all"
            >
              <div className="text-sage-green mb-6 flex justify-center">{item.icon}</div>
              <h3 className="font-serif text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-sage-green/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl md:text-4xl text-center text-deep-green mb-12">Stories from the Mat</h2>
            
            {feedback.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {feedback.map((item) => (
                        <div key={item.id} className="bg-white p-8 rounded-xl shadow-sm border border-white hover:border-sage-green/20 transition-all">
                            <div className="flex text-yellow-400 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < item.rating ? "currentColor" : "none"} className={i >= item.rating ? "text-gray-300" : ""} />
                                ))}
                            </div>
                            <p className="text-gray-600 italic mb-6">"{item.quote}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-full h-full p-2 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-deep-green">{item.name}</h4>
                                    <span className="text-xs text-gray-500">{item.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center text-gray-500 italic">
                     <p>Our community is growing. Be the first to share your story!</p>
                 </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default Home;
