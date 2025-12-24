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

  const heroImageUrl = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2400&auto=format&fit=crop";

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section - Height adjusted to account for Navbar offset in App.tsx */}
      <section className="relative min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-warm-white p-4 md:p-6 lg:p-8">
        {/* The "Set Border" Frame */}
        <div 
          className="relative w-full h-full min-h-[70vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden flex items-center justify-center shadow-2xl"
          style={{
            backgroundImage: `url(${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Overlays for readability */}
          <div className="absolute inset-0 bg-white/10 md:bg-transparent z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-warm-white/20 z-0"></div>
          
          <div className="relative z-10 text-center max-w-5xl px-4 sm:px-6 py-12 md:py-20">
            <motion.div
              initial={{ opacity: 0.01, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-deep-green leading-tight mb-0 tracking-tight drop-shadow-md">
                Find Your Inner
              </h1>
              <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] italic text-deep-green/90 font-normal leading-none mb-10 drop-shadow-md">
                Sanctuary
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0.01, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="text-base sm:text-lg md:text-2xl text-deep-green mb-10 max-w-2xl mx-auto leading-relaxed font-normal bg-white/20 backdrop-blur-sm md:bg-transparent rounded-2xl p-4 md:p-0 shadow-sm md:shadow-none"
            >
              Join a community dedicated to <span className="font-semibold text-deep-green">mindful</span> movement, breathwork, and holistic wellness in the heart of Navalur.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0.01, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm sm:max-w-md mx-auto"
            >
              <Link 
                to="/schedule" 
                className="w-full sm:w-auto bg-sage-green text-white py-3.5 px-8 sm:px-10 rounded-full hover:bg-deep-green transition-all duration-500 font-medium text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Book a Class <ArrowRight size={20} />
              </Link>
              <Link 
                to="/knowledge-center" 
                className="w-full sm:w-auto bg-white/80 backdrop-blur-sm text-deep-green border border-gray-200 py-3.5 px-8 sm:px-10 rounded-full hover:bg-white transition-all duration-500 font-medium text-base sm:text-lg flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                AI Studio
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-deep-green/40 pointer-events-none"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-deep-green/40 to-transparent"></div>
        </motion.div>
      </section>

      {/* Goal Selection */}
      <section className="py-16 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-warm-white relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-deep-green mb-4 md:mb-6">Choose Your Path</h2>
          <p className="text-gray-500 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">Whatever your journey, we provide the space, guidance, and community to help you thrive.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          {[
            { icon: <Leaf size={44} />, title: "Stress Relief", desc: "Calming flows and restorative practices designed to unburden your mind and restore balance." },
            { icon: <Heart size={44} />, title: "Flexibility", desc: "Open up your body and improve mobility through purposeful, mindful movement and alignment." },
            { icon: <Sun size={44} />, title: "Strength", desc: "Build functional power and inner stability through intentional poses and breath control." }
          ].map((item, idx) => (
            <motion.div 
              whileHover={{ y: -12 }}
              key={idx} 
              className={`bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-50 text-center hover:shadow-2xl hover:shadow-sage-green/10 transition-all duration-500 ${idx === 2 && 'sm:col-span-2 lg:col-span-1'}`}
            >
              <div className="text-sage-green mb-8 flex justify-center drop-shadow-sm">{item.icon}</div>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold mb-4 md:mb-6 text-deep-green">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-sand-beige/5 py-16 md:py-32 border-t border-sand-beige/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-deep-green mb-12 md:mb-20">Stories from the Mat</h2>
            
            {feedback.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {feedback.map((item, idx) => (
                        <div key={item.id} className={`bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-transparent hover:border-sage-green/20 transition-all duration-500 text-left flex flex-col h-full ${idx === 2 && 'sm:col-span-2 lg:col-span-1'}`}>
                            <div className="flex text-yellow-400 mb-6 md:mb-8">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill={i < item.rating ? "currentColor" : "none"} className={i >= item.rating ? "text-gray-100" : ""} />
                                ))}
                            </div>
                            <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-8 md:mb-10 flex-grow font-sans">"{item.quote}"</p>
                            <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-warm-white shadow-sm">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-full h-full p-4 text-gray-300" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-base md:text-lg">{item.name}</h4>
                                    <span className="text-xs text-sage-green font-semibold uppercase tracking-wider">{item.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center text-gray-400 py-10">
                     <p className="text-gray-500 leading-relaxed text-base md:text-lg">Our community stories are blooming soon...</p>
                 </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default Home;