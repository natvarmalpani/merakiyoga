import React, { useState, useMemo } from 'react';
import { generateAsanaInfo } from '../services/geminiService';
import { ASANA_LIST } from '../services/asanaList';
import { Sparkles, Loader2, BookOpen, AlertCircle, Feather } from 'lucide-react';

const KnowledgeCenter = () => {
  // Input State
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAsana, setSelectedAsana] = useState<string>('');
  
  // Output State
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Derived Data for Dropdowns
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(ASANA_LIST.map(item => item.category)));
    return uniqueCategories.sort();
  }, []);

  const filteredAsanas = useMemo(() => {
    if (!selectedCategory) return [];
    return ASANA_LIST
      .filter(item => item.category === selectedCategory)
      .sort((a, b) => a.english_name.localeCompare(b.english_name));
  }, [selectedCategory]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsana) return;

    setLoading(true);
    setGeneratedContent(null);
    
    // Find the full object to pass clear name (English + Sanskrit usually helps context)
    const asanaObj = ASANA_LIST.find(a => a.sanskrit_name === selectedAsana);
    const searchTerm = asanaObj ? `${asanaObj.english_name} (${asanaObj.sanskrit_name})` : selectedAsana;

    const result = await generateAsanaInfo(searchTerm);
    setGeneratedContent(result);
    setLoading(false);
  };

  // Helper to format the output.
  const renderFormattedContent = (htmlContent: string) => {
    if (!htmlContent) return null;

    // Clean up if AI wraps it in ```html ... ``` or other artifacts
    let cleanHtml = htmlContent
        .replace(/```html/g, '')
        .replace(/```/g, '')
        .trim();

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
            {/* Header / Title Area */}
            <div className="bg-deep-green text-white p-6 md:p-8 pb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                    <Feather size={140} />
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-medium relative z-10">
                    {ASANA_LIST.find(a => a.sanskrit_name === selectedAsana)?.english_name || 'Asana Guide'}
                </h2>
                <p className="text-sage-green mt-1 text-base md:text-lg italic relative z-10">
                    {ASANA_LIST.find(a => a.sanskrit_name === selectedAsana)?.sanskrit_name || selectedAsana}
                </p>
            </div>

            {/* Content Body - Rendering HTML directly with specific styling classes */}
            <div className="p-6 md:p-10 -mt-6 bg-white rounded-t-3xl relative z-20">
                <div 
                    className="
                        text-gray-700 leading-relaxed
                        
                        /* Headings Styling */
                        [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:text-deep-green [&_h3]:mt-8 [&_h3]:mb-4 [&_h3]:border-b [&_h3]:border-gray-100 [&_h3]:pb-2
                        
                        /* Paragraphs */
                        [&_p]:mb-4 [&_p]:text-base [&_p]:leading-7
                        
                        /* Lists */
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-6 [&_ul]:space-y-2
                        [&_li]:pl-1
                        
                        /* Strong/Bold text */
                        [&_strong]:font-semibold [&_strong]:text-deep-green
                        
                        /* End Note Box */
                        [&_.end-note]:bg-amber-50 [&_.end-note]:p-6 [&_.end-note]:rounded-xl [&_.end-note]:border [&_.end-note]:border-amber-100 
                        [&_.end-note]:text-amber-900 [&_.end-note]:text-sm [&_.end-note]:mt-8 [&_.end-note]:italic [&_.end-note]:flex [&_.end-note]:items-center
                    "
                    dangerouslySetInnerHTML={{ __html: cleanHtml }}
                />
            </div>
        </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="font-serif text-3xl md:text-4xl text-deep-green mb-2">AI Studio</h1>
        <p className="text-gray-600 text-base md:text-lg">Deepen your knowledge with our AI-powered asana encyclopedia.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: Controls */}
            <div className="lg:col-span-4 space-y-6 sticky top-24">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="font-serif text-2xl text-deep-green mb-6 flex items-center gap-2">
                        <BookOpen size={24} className="text-sage-green"/> Know your Asanas
                    </h2>
                    
                    <form onSubmit={handleGenerate} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Asanas Category</label>
                            <div className="relative">
                                <select 
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        setSelectedAsana(''); 
                                    }}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-green focus:border-transparent outline-none bg-gray-50 text-gray-700 appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Asanas Name</label>
                            <div className="relative">
                                <select 
                                    value={selectedAsana}
                                    onChange={(e) => setSelectedAsana(e.target.value)}
                                    disabled={!selectedCategory}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-green focus:border-transparent outline-none bg-gray-50 text-gray-700 appearance-none disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <option value="">Select Asana</option>
                                    {filteredAsanas.map((asana) => (
                                        <option key={asana.sanskrit_name} value={asana.sanskrit_name}>
                                            {asana.english_name} ({asana.sanskrit_name})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || !selectedAsana}
                            className="w-full bg-deep-green text-white py-3 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 font-medium text-base shadow-md shadow-deep-green/10 mt-2 transform active:scale-95"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                            {loading ? 'Consulting AI...' : 'Know Your Asana'}
                        </button>
                    </form>
                </div>
                
                <div className="bg-sage-green/10 p-5 rounded-xl border border-sage-green/20 text-deep-green text-sm flex gap-3">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <p>Select a pose to generate a comprehensive, safe, and easy-to-understand guide instantly.</p>
                </div>
            </div>

            {/* Right Content Area: Results */}
            <div className="lg:col-span-8 min-h-[600px]">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-6 bg-white rounded-3xl border border-gray-100 shadow-sm p-12">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-sage-green/30 border-t-deep-green rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles size={24} className="text-sage-green animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-serif text-deep-green mb-2">Consulting the ancient texts...</p>
                            <p className="text-gray-400">Curating detailed knowledge for {selectedAsana}...</p>
                        </div>
                    </div>
                ) : generatedContent ? (
                    <div>
                       {renderFormattedContent(generatedContent)}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <BookOpen size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-serif text-gray-600 mb-3">Ready to Learn?</h3>
                        <p className="max-w-md text-gray-500 leading-relaxed">
                            Select a category and pose from the left menu to generate a beautifully detailed guide tailored for your practice.
                        </p>
                    </div>
                )}
            </div>
      </div>
    </div>
  );
};

export default KnowledgeCenter;