import React, { useEffect, useState } from 'react';
import { getPrograms } from '../services/programService';
import { Course } from '../types';
import { Clock, BarChart, Loader2, Info, Download, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from '../services/dataService';

const Programs = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getPrograms();
        setCourses(data);
      } catch (error) {
        console.error("Failed to load programs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleBookCourse = (course: Course) => {
    navigate('/contact', { 
        state: { 
            booking: { 
                type: 'course', 
                title: course.title 
            } 
        } 
    });
  };

  if (loading) {
     return (
       <div className="min-h-[50vh] flex items-center justify-center">
         <Loader2 className="animate-spin text-sage-green" size={48} />
       </div>
     );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
            <h1 className="font-serif text-4xl text-deep-green mb-4">Curated Programs</h1>
            <p className="text-gray-600">Structured courses to help you deepen your practice.</p>
        </div>

        {courses.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <Info size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900">No programs available yet</h3>
                <p className="text-gray-500 mt-2">New courses are being crafted. Stay tuned!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map(course => (
                    <div key={course.slug} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col h-full">
                        <div className="relative h-56 bg-gray-100">
                            {course.image && <img src={course.image} alt={course.title} className="w-full h-full object-cover" />}
                            {course.badge && (
                                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-deep-green text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {course.badge}
                                </span>
                            )}
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 mt-auto">
                                <span className="flex items-center gap-1"><Clock size={14}/> {course.duration}</span>
                                <span className="flex items-center gap-1"><BarChart size={14}/> {course.level}</span>
                            </div>
                            
                            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-2xl font-serif text-deep-green font-medium">₹{course.price}</span>
                                    {course.pdf_url && (
                                        <a 
                                            href={course.pdf_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-sage-green hover:text-deep-green transition-colors flex items-center gap-1 text-sm font-medium"
                                        >
                                            <Download size={14} /> Brochure
                                        </a>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={() => handleBookCourse(course)}
                                    className="w-full bg-deep-green text-white py-2.5 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                                >
                                    Book Course <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};
export default Programs;
