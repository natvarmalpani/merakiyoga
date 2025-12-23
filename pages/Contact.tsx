import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, AlertCircle } from 'lucide-react';
import { useLocation } from '../services/dataService.ts';
import { createInquiry } from '../services/contactService.ts';

const Contact = () => {
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [inquiryHeading, setInquiryHeading] = useState('General Inquiry');
  
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', message: '' });

  useEffect(() => {
    if (location.state && location.state.booking) {
      const { type, classType, day, time, location: loc, title } = location.state.booking;
      if (type === 'class') {
         setInquiryHeading(`Booking: ${day}, ${time}, ${classType}`);
         setFormData(prev => ({ ...prev, message: `I would like to confirm my booking for ${classType} on ${day} at ${time}.` }));
      } else if (type === 'course') {
         setInquiryHeading(`Course: ${title}`);
         setFormData(prev => ({ ...prev, message: `I am interested in joining the ${title} program.` }));
      }
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createInquiry({ first_name: formData.firstName, last_name: formData.lastName, email: formData.email, phone_number: formData.phoneNumber, message: formData.message, inquiry_type: inquiryHeading });
      const whatsappText = `*${inquiryHeading}*\nName: ${formData.firstName} ${formData.lastName}\nPhone: ${formData.phoneNumber}\nEmail: ${formData.email}\nMessage: ${formData.message}`;
      window.open(`https://wa.me/919769911150?text=${encodeURIComponent(whatsappText)}`, '_blank');
    } catch (error: any) {
      setSubmitError("We had trouble saving your message, but we'll open WhatsApp for you.");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        <div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-deep-green mb-6 text-center lg:text-left">Get in Touch</h1>
            <p className="text-gray-600 mb-10 text-center lg:text-left text-base md:text-lg">We'd love to hear from you. Visit our sanctuary or send us a message.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 sm:gap-8 text-left mb-12">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-50">
                    <div className="bg-sage-green/10 p-3 rounded-full text-deep-green shrink-0"><MapPin size={24} /></div>
                    <div>
                        <h3 className="font-serif text-lg font-medium text-deep-green mb-1">Our Sanctuary</h3>
                        <a href="https://www.google.com/maps/search/?api=1&query=BMR+Mall+No+1+/+398,+OMR,+Navalur,+Chennai+600130" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-sage-green transition-colors leading-relaxed">
                            BMR Mall No 1 / 398,<br/>OMR, Navalur, Chennai 600130
                        </a>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-50">
                    <div className="bg-sage-green/10 p-3 rounded-full text-deep-green shrink-0"><Mail size={24} /></div>
                    <div>
                        <h3 className="font-serif text-lg font-medium text-deep-green mb-1">Email Support</h3>
                        <a href="mailto:meraki.yoga.healing@gmail.com" className="text-sm text-gray-500 hover:text-sage-green transition-colors break-all">meraki.yoga.healing@gmail.com</a>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-50 sm:col-span-2 lg:col-span-1">
                    <div className="bg-sage-green/10 p-3 rounded-full text-deep-green shrink-0"><Phone size={24} /></div>
                    <div>
                        <h3 className="font-serif text-lg font-medium text-deep-green mb-1">Direct Call</h3>
                        <a href="tel:+919769911150" className="text-sm text-gray-500 hover:text-sage-green transition-colors">+91 97699 11150</a>
                    </div>
                </div>
            </div>

            <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-100 rounded-[2rem] overflow-hidden shadow-inner border border-gray-200">
                <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src="https://maps.google.com/maps?q=BMR%20Mall%20No%201%20%2F%20398%2C%20OMR%2C%20Navalur%2C%20Chennai%20600130&t=&z=15&ie=UTF8&iwloc=&output=embed" title="Meraki Yoga Studio Location"></iframe>
            </div>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-xl border border-gray-50 relative -mt-8 lg:mt-0">
            <h2 className="font-serif text-2xl sm:text-3xl text-deep-green mb-2 text-left">Connect With Us</h2>
            <p className="text-sm text-gray-400 mb-8 text-left font-medium">Subject: <span className="text-sage-green">{inquiryHeading}</span></p>
            
            {submitError && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-3 border border-red-100"><AlertCircle size={20} /> {submitError}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:border-sage-green/30 rounded-xl focus:bg-white outline-none transition-all" required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:border-sage-green/30 rounded-xl focus:bg-white outline-none transition-all" required />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:border-sage-green/30 rounded-xl focus:bg-white outline-none transition-all" required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Phone</label>
                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:border-sage-green/30 rounded-xl focus:bg-white outline-none transition-all" required />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Your Message</label>
                    <textarea rows={4} name="message" value={formData.message} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:border-sage-green/30 rounded-xl focus:bg-white outline-none transition-all resize-none" required></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-deep-green text-white py-4 rounded-2xl font-medium hover:bg-opacity-90 transition-all flex justify-center items-center gap-3 shadow-lg shadow-deep-green/10 active:scale-[0.98]">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><span className="text-lg">Send via WhatsApp</span> <Send size={20} /></>}
                </button>
                <p className="text-[10px] text-center text-gray-400 mt-6 leading-relaxed">By submitting this form, we'll open WhatsApp to connect you directly with our studio team.</p>
            </form>
        </div>
      </div>
    </div>
  );
};
export default Contact;