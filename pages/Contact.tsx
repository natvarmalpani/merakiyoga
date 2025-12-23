import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, AlertCircle } from 'lucide-react';
import { useLocation } from '../services/dataService.ts';
import { createInquiry } from '../services/contactService.ts';

const Contact = () => {
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Header that will be saved to DB and sent to WhatsApp
  const [inquiryHeading, setInquiryHeading] = useState('General Inquire');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });

  useEffect(() => {
    // Check if we have incoming state from Schedule or Programs
    if (location.state && location.state.booking) {
      const { type, classType, day, time, location: loc, title } = location.state.booking;
      
      if (type === 'class') {
         const heading = `Book Now ${day}, ${time}, ${classType}, ${loc}`;
         setInquiryHeading(heading);
         setFormData(prev => ({ ...prev, message: `I would like to confirm my booking for ${classType}.` }));
      } else if (type === 'course') {
         const heading = `Book Course ${title}`;
         setInquiryHeading(heading);
         setFormData(prev => ({ ...prev, message: `I am interested in joining the ${title} program.` }));
      }
    } else {
        setInquiryHeading('General Inquire');
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Save to Database (Heading goes into 'inquiry_type')
      await createInquiry({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        message: formData.message,
        inquiry_type: inquiryHeading 
      });

      // 2. Construct WhatsApp Message
      const whatsappText = `${inquiryHeading}, ${formData.firstName} ${formData.lastName}, ${formData.phoneNumber}, ${formData.email}, ${formData.message}`;
      
      window.open(`https://wa.me/919769911150?text=${encodeURIComponent(whatsappText)}`, '_blank');

    } catch (error: any) {
      console.error("Database Error:", error.message);
      
      // Fallback: Open WhatsApp even if DB save fails
      const whatsappText = `${inquiryHeading}, ${formData.firstName} ${formData.lastName}, ${formData.phoneNumber}, ${formData.email}, ${formData.message}`;
      window.open(`https://wa.me/919769911150?text=${encodeURIComponent(whatsappText)}`, '_blank');

      if (!error.message.includes('row-level security') && !error.message.includes('column')) {
         setSubmitError("Message sent via WhatsApp, but we had trouble saving a copy.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapLink = "https://www.google.com/maps/search/?api=1&query=BMR+Mall+No+1+/+398,+OMR,+Navalur,+Chennai+600130";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
            <h1 className="font-serif text-4xl text-deep-green mb-6">Get in Touch</h1>
            <p className="text-gray-600 mb-8">We'd love to hear from you. Visit our studio or send us a message.</p>
            
            <div className="space-y-6 text-left">
                <div className="flex items-start gap-4">
                    <div className="bg-sage-green/10 p-3 rounded-full text-deep-green">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h3 className="font-serif text-lg font-medium">Visit Us</h3>
                        <a 
                            href={mapLink}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-sage-green transition-colors block"
                        >
                            BMR Mall No 1 / 398,<br/>OMR, Navalur, Chennai 600130
                        </a>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-sage-green/10 p-3 rounded-full text-deep-green">
                        <Mail size={24} />
                    </div>
                    <div>
                        <h3 className="font-serif text-lg font-medium">Email Us</h3>
                        <a href="mailto:meraki.yoga.healing@gmail.com" className="text-gray-600 hover:text-sage-green transition-colors">meraki.yoga.healing@gmail.com</a>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-sage-green/10 p-3 rounded-full text-deep-green">
                        <Phone size={24} />
                    </div>
                    <div>
                        <h3 className="font-serif text-lg font-medium">Call Us</h3>
                        <a href="tel:+919769911150" className="text-gray-600 hover:text-sage-green transition-colors">+91 97699 11150</a>
                    </div>
                </div>
            </div>

            <div className="mt-12 w-full h-96 bg-gray-100 rounded-3xl overflow-hidden shadow-sm border border-gray-200">
                <iframe 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://maps.google.com/maps?q=BMR%20Mall%20No%201%20%2F%20398%2C%20OMR%2C%20Navalur%2C%20Chennai%20600130&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    title="Meraki Yoga Studio Location"
                    className="w-full h-full object-cover"
                ></iframe>
            </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h2 className="font-serif text-2xl mb-2">Send a Message</h2>
            <p className="text-sm text-gray-500 mb-6 font-medium bg-gray-50 p-2 rounded block">
                Subject: <span className="text-deep-green">{inquiryHeading}</span>
            </p>
            
            {submitError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">First Name <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage-green outline-none" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">Last Name <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage-green outline-none" 
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">Email <span className="text-red-500">*</span></label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage-green outline-none" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">Contact Number <span className="text-red-500">*</span></label>
                        <input 
                            type="tel" 
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage-green outline-none" 
                            required 
                            placeholder="+91..."
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">Message <span className="text-red-500">*</span></label>
                    <textarea 
                        rows={4} 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage-green outline-none" 
                        required
                    ></textarea>
                </div>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-deep-green text-white py-4 rounded-xl font-medium hover:bg-opacity-90 transition-all flex justify-center items-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <><span className="mr-1">Send via WhatsApp</span> <Send size={18} /></>}
                </button>
                <p className="text-xs text-center text-gray-400 mt-4">We will capture your inquiry and then open WhatsApp to send this message directly to +91 97699 11150.</p>
            </form>
        </div>
      </div>
    </div>
  );
};
export default Contact;