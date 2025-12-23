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

  // Premium sanctuary background image
  const heroImageUrl = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2400&auto=format&fit=crop";

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section 
        className="relative h-[90vh] md:h-screen min-h-[600px] md:min-h-[800px] flex items-center justify-center overflow-hidden bg-warm-white"
        style={{
          backgroundImage: `url(${heroImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: window.innerWidth > 768 ? 'fixed' : 'scroll'
        }}
      >
        {/* Subtler Overlays for Desktop Clarity */}
        <div className="absolute inset-0 bg-white/20 md:bg-white/10 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-warm-white/100 z-0"></div>
        
        {/* Content Container */}
        <div className="relative z-10 text-center max-w-4xl px-6 pt-10 md:pt-0">
          <motion.div
            initial={{ opacity: 0.01, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl text-deep-green leading-tight mb-0 tracking-tight drop-shadow-sm">
              Find Your Inner
            </h1>
            <h1 className="font-serif text-6xl md:text-9xl lg:text-[10rem] italic text-deep-green/90 font-normal leading-none mb-10 drop-shadow-sm">
              Sanctuary
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0.01, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-2xl text-deep-green/80 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Join a community dedicated to <span className="font-semibold text-deep-green">mindful</span> movement, breathwork, and holistic wellness in the heart of Navalur.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0.01, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto"
          >
            <Link 
              to="/schedule" 
              className="w-full sm:w-auto min-w-[200px] bg-sage-green text-white py-4 px-10 rounded-full hover:bg-deep-green transition-all duration-500 font-medium text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Book a Class <ArrowRight size={20} />
            </Link>
            <Link 
              to="/knowledge-center" 
              className="w-full sm:w-auto min-w-[200px] bg-white/80 backdrop-blur-sm text-deep-green border border-gray-200 py-4 px-10 rounded-full hover:bg-white transition-all duration-500 font-medium text-lg flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              Explore AI Studio
            </Link>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-deep-green/40"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-deep-green/40 to-transparent"></div>
        </motion.div>
      </section>

      {/* Goal Selection */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-warm-white relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-deep-green mb-6">Choose Your Path</h2>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">Whatever your journey, we provide the space, guidance, and community to help you thrive.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {[
            { icon: <Leaf size={44} />, title: "Stress Relief", desc: "Calming flows and restorative practices designed to unburden your mind and restore balance." },
            { icon: <Heart size={44} />, title: "Flexibility", desc: "Open up your body and improve mobility through purposeful, mindful movement and alignment." },
            { icon: <Sun size={44} />, title: "Strength", desc: "Build functional power and inner stability through intentional poses and breath control." }
          ].map((item, idx) => (
            <motion.div 
              whileHover={{ y: -12 }}
              key={idx} 
              className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-50 text-center hover:shadow-2xl hover:shadow-sage-green/10 transition-all duration-500"
            >
              <div className="text-sage-green mb-10 flex justify-center drop-shadow-sm">{item.icon}</div>
              <h3 className="font-serif text-3xl font-semibold mb-6 text-deep-green">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-sand-beige/5 py-24 md:py-32 border-t border-sand-beige/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-4xl md:text-6xl text-deep-green mb-20">Stories from the Mat</h2>
            
            {feedback.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {feedback.map((item) => (
                        <div key={item.id} className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-transparent hover:border-sage-green/20 transition-all duration-500 text-left flex flex-col h-full">
                            <div className="flex text-yellow-400 mb-8">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill={i < item.rating ? "currentColor" : "none"} className={i >= item.rating ? "text-gray-100" : ""} />
                                ))}
                            </div>
                            <p className="text-gray-700 italic mb-10 text-xl leading-relaxed flex-grow font-serif">"{item.quote}"</p>
                            <div className="flex items-center gap-5 pt-6 border-t border-gray-50">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-warm-white shadow-sm">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-full h-full p-4 text-gray-300" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                                    <span className="text-sm text-sage-green font-semibold uppercase tracking-wider">{item.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center text-gray-400 py-10">
                     <p className="font-serif italic text-2xl">Our community stories are blooming soon...</p>
                 </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default Home;