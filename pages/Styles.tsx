
import React, { useEffect, useState } from 'react';
import { getStyles } from '../services/styleService'; // Changed source to Supabase service
import { YogaStyle } from '../types';
import { motion } from 'framer-motion';
import { Loader2, Clock, Info, AlertCircle, RefreshCcw } from 'lucide-react';

const Styles = () => {
  const [styles, setStyles] = useState<YogaStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStyles = async () => {
    setLoading(true);
    setError(null);
    try {
      // Now fetching from Supabase database
      const data = await getStyles();
      setStyles(data);
    } catch (err: any) {
      console.error("Failed to load styles", err);
      setError(err.message || "Failed to load styles from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStyles();
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (e.currentTarget.src !== 'https://picsum.photos/800/600?grayscale') {
        e.currentTarget.src = 'https://picsum.photos/800/600?grayscale'; 
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl text-deep-green mb-4">Yoga Styles</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-4">Explore our diverse range of classes designed to meet you where you are.</p>
        
        {!loading && !error && (
          <div className="inline-block bg-sage-green/10 text-deep-green px-4 py-1 rounded-full text-sm font-medium">
            Showing {styles.length} {styles.length === 1 ? 'Style' : 'Styles'}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-sage-green" size={48} />
        </div>
      ) : error ? (
        <div className="max-w-2xl mx-auto text-center py-12 bg-red-50 rounded-2xl border border-red-200 px-6">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-medium text-red-800 mb-2">Connection Error</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={loadStyles}
            className="inline-flex items-center gap-2 bg-white border border-red-300 text-red-700 px-6 py-2 rounded-full hover:bg-red-50 transition-colors font-medium"
          >
            <RefreshCcw size={16} /> Try Again
          </button>
        </div>
      ) : styles.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <Info size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900">No styles found</h3>
          <p className="text-gray-500 mt-2">Check back later for our updated class offerings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {styles.map((style, index) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              key={style.slug || index} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col h-full"
            >
              <div className="h-64 overflow-hidden bg-gray-100 relative">
                <img 
                  src={style.image || 'https://picsum.photos/800/600?grayscale'} 
                  alt={style.name} 
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-serif text-2xl font-medium text-deep-green leading-tight">{style.name}</h3>
                  <span className={`flex-shrink-0 ml-2 px-3 py-1 rounded-full text-xs font-medium 
                    ${style.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' : 
                      style.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800'}`}>
                    {style.difficulty}
                  </span>
                </div>

                {/* Duration Display */}
                {style.duration && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock size={16} className="text-sage-green" />
                    <span>{style.duration}</span>
                  </div>
                )}

                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">{style.description}</p>
                
                <div className="space-y-3 mt-auto">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Benefits:</h4>
                  <div className="flex flex-wrap gap-2">
                    {style.benefits.map((b, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{b}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Styles;
