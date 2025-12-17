import React, { useEffect, useState } from 'react';
import { getSchedule } from '../services/scheduleService';
import { ClassSession } from '../types';
import { Calendar, Clock, MapPin, User, Loader2, Info } from 'lucide-react';
import { useNavigate } from '../services/dataService';

const Schedule = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getSchedule();
        // Sort by Day (Mon-Sun) and Time
        const daysOrder: { [key: string]: number } = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7 };
        
        const sorted = [...data].sort((a, b) => {
          const dayDiff = (daysOrder[a.day] || 8) - (daysOrder[b.day] || 8);
          if (dayDiff !== 0) return dayDiff;
          return a.time.localeCompare(b.time);
        });
        
        setSessions(sorted);
      } catch (err: any) {
        setError(err.message || 'Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const handleBookNow = (session: ClassSession) => {
    navigate('/contact', { 
      state: { 
        booking: {
          type: 'class',
          classType: session.classType,
          day: session.day,
          time: session.time,
          location: session.location
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl text-deep-green mb-4">Class Schedule</h1>
        <p className="text-gray-600">Join us on the mat. Book your spot in advance.</p>
      </div>

      {error ? (
        <div className="text-center text-red-600 p-8 bg-red-50 rounded-xl border border-red-100">
           <p>Unable to load schedule. Please try again later.</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <Info size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">No classes scheduled</h3>
            <p className="text-gray-500 mt-2">Check back soon for updates.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-6 gap-4 p-6 bg-sage-green/20 font-semibold text-deep-green">
                <div className="col-span-1">Day</div>
                <div className="col-span-1">Time</div>
                <div className="col-span-2">Class</div>
                <div className="col-span-1">Instructor</div>
                <div className="col-span-1">Action</div>
            </div>

            <div className="divide-y divide-gray-100">
                {sessions.map((session) => (
                    <div key={session.id} className="p-6 grid grid-cols-1 md:grid-cols-6 gap-4 items-center hover:bg-gray-50 transition-colors">
                        <div className="md:col-span-1 flex items-center gap-2 font-medium text-gray-900">
                            <Calendar size={16} className="md:hidden text-sage-green" />
                            {session.day}
                        </div>
                        <div className="md:col-span-1 flex items-center gap-2 text-gray-600">
                            <Clock size={16} className="md:hidden text-sage-green" />
                            {session.time}
                        </div>
                        <div className="md:col-span-2">
                            <h4 className="font-semibold text-lg text-deep-green">{session.classType}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <MapPin size={12} /> {session.location} • {session.level}
                            </div>
                        </div>
                        <div className="md:col-span-1 flex items-center gap-2 text-gray-700">
                            <User size={16} className="md:hidden text-sage-green" />
                            {session.instructor}
                        </div>
                        <div className="md:col-span-1">
                            <button 
                                onClick={() => handleBookNow(session)}
                                className="w-full bg-sage-green text-white py-2 rounded-lg hover:bg-deep-green transition-colors text-sm font-medium"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
