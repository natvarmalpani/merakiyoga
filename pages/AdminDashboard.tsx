import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from '../services/dataService.ts';
import { supabase } from '../services/supabaseClient.ts';
import { getStyles, deleteStyle } from '../services/styleService.ts';
import { getSchedule, deleteSession } from '../services/scheduleService.ts';
import { getInquiries, deleteInquiry } from '../services/contactService.ts';
import { getPrograms, deleteProgram } from '../services/programService.ts';
import { getPricingPlans, deletePricingPlan } from '../services/pricingService.ts';
import { getBlogPosts, deleteBlogPost } from '../services/blogService.ts';
import { getFeedback, deleteFeedback } from '../services/feedbackService.ts';
import { YogaStyle, ClassSession, ContactInquiry, Course, PricingPlan, BlogPost, CustomerFeedback } from '../types.ts';
import { 
  Calendar, 
  BookOpen, 
  CreditCard, 
  PenTool, 
  LogOut, 
  Menu, 
  X,
  Leaf,
  Plus,
  Trash2,
  Loader2,
  Database,
  MessageSquare,
  ShieldCheck,
  User as UserIcon,
  CheckSquare,
  Square,
  Trash,
  Quote,
  Clock,
  MapPin,
  MoreHorizontal,
  Eye
} from 'lucide-react';
// @ts-ignore
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
const motion = framerMotion as any;

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-deep-green">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={20} /></button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </motion.div>
    </div>
  );
};

const DashboardSection = ({ title, description, onAdd, children, hideAddButton, bulkActions }: any) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="text-left">
        <h2 className="font-serif text-2xl sm:text-3xl text-deep-green">{title}</h2>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {bulkActions}
        {!hideAddButton && (
            <button onClick={onAdd} className="bg-sage-green text-white px-4 py-2.5 rounded-lg font-medium hover:bg-deep-green transition-all flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center">
              <Plus size={18} /> Add New
            </button>
        )}
      </div>
    </div>
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">{children}</div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('styles');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Data State
  const [styles, setStyles] = useState<YogaStyle[]>([]);
  const [scheduleData, setScheduleData] = useState<ClassSession[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [programs, setPrograms] = useState<Course[]>([]);
  const [pricingPlansData, setPricingPlansData] = useState<PricingPlan[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);

  // Selection State
  const [selectedInquiryIds, setSelectedInquiryIds] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/admin'); return; }
      setUserEmail(session.user.email || 'Admin User');
      try { await fetchAllData(); } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    init();
  }, [navigate]);

  const fetchAllData = async () => {
    const [fetchedStyles, fetchedSchedule, fetchedInquiries, fetchedPrograms, fetchedPricing, fetchedPosts, fetchedFeedback] = await Promise.all([
      getStyles(), getSchedule(), getInquiries(), getPrograms(), getPricingPlans(), getBlogPosts(false), getFeedback()
    ]);
    setStyles(fetchedStyles);
    setScheduleData(fetchedSchedule);
    setInquiries(fetchedInquiries);
    setPrograms(fetchedPrograms);
    setPricingPlansData(fetchedPricing);
    setBlogPosts(fetchedPosts);
    setFeedback(fetchedFeedback);
  };

  const handleLogout = async () => { 
    if(window.confirm('Are you sure you want to log out?')) {
        await supabase.auth.signOut(); 
        navigate('/admin'); 
    }
  };

  // --- Deletion Handlers ---

  const handleDeleteStyle = async (slug: string, image: string) => {
    if(!window.confirm('Delete this yoga style?')) return;
    setIsLoading(true);
    await deleteStyle(slug, image);
    await fetchAllData();
    setIsLoading(false);
  };

  const handleDeleteSession = async (id: string) => {
    if(!window.confirm('Remove this class session?')) return;
    setIsLoading(true);
    await deleteSession(id);
    await fetchAllData();
    setIsLoading(false);
  };

  const handleDeleteProgram = async (slug: string) => {
    if(!window.confirm('Delete this program?')) return;
    setIsLoading(true);
    await deleteProgram(slug);
    await fetchAllData();
    setIsLoading(false);
  };

  const handleDeletePricing = async (id: string) => {
    if(!window.confirm('Delete this pricing plan?')) return;
    setIsLoading(true);
    await deletePricingPlan(id);
    await fetchAllData();
    setIsLoading(false);
  };

  const handleDeleteFeedback = async (id: number) => {
    if(!window.confirm('Delete this testimonial?')) return;
    setIsLoading(true);
    await deleteFeedback(id);
    await fetchAllData();
    setIsLoading(false);
  };

  const handleDeletePost = async (id: number) => {
    if(!window.confirm('Delete this blog post?')) return;
    setIsLoading(true);
    await deleteBlogPost(id);
    await fetchAllData();
    setIsLoading(false);
  };

  // --- Message Bulk Selection ---

  const toggleInquirySelection = (id: string) => {
    setSelectedInquiryIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteInquiries = async () => {
    if (!window.confirm(`Delete ${selectedInquiryIds.length} messages permanently?`)) return;
    setIsLoading(true);
    try {
      await Promise.all(selectedInquiryIds.map(id => deleteInquiry(id)));
      await fetchAllData();
      setSelectedInquiryIds([]);
    } catch (err) {
      alert("Error during bulk delete.");
    } finally {
      setIsLoading(false);
    }
  };

  const navItems = [
    { id: 'styles', label: 'Yoga Styles', icon: <Leaf size={20} /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={20} /> },
    { id: 'programs', label: 'Programs', icon: <BookOpen size={20} /> },
    { id: 'pricing', label: 'Pricing', icon: <CreditCard size={20} /> },
    { id: 'messages', label: 'Inquiries', icon: <MessageSquare size={20} /> },
    { id: 'feedback', label: 'Feedback', icon: <Quote size={20} /> },
    { id: 'blog', label: 'Blog', icon: <PenTool size={20} /> },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-deep-green text-white">
      <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
        <Link to="/" className="font-serif text-2xl font-bold flex items-center gap-2">
          <ShieldCheck size={28} className="text-sage-green" />
          <span className="tracking-tight">Meraki Admin</span>
        </Link>
        {isMobile && (
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-white">
            <X size={24} />
          </button>
        )}
      </div>

      <nav className="flex-1 min-h-0 py-6 px-4 space-y-2 overflow-y-auto hide-scrollbar">
        {navItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => { setActiveTab(item.id); if(isMobile) setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all text-left ${activeTab === item.id ? 'bg-white/10 text-white font-bold ring-1 ring-white/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            {item.icon} <span className="flex-1">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 bg-black/20">
        <div className="px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sage-green/20 flex items-center justify-center text-sage-green font-bold text-sm border border-sage-green/10">
            {userEmail?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0 overflow-hidden text-left">
            <p className="text-xs font-bold text-sage-green uppercase tracking-widest truncate">Logged in as</p>
            <p className="text-sm font-medium text-white/80 truncate">{userEmail}</p>
          </div>
        </div>

        <div className="p-4 pt-0 pb-6">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-xs font-black text-white bg-red-600/90 hover:bg-red-600 rounded-xl transition-all shadow-lg active:scale-95 border border-red-500/30 uppercase tracking-[0.2em]"
          >
            <LogOut size={18} /> <span>LOG OUT</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
      // Darker table header as requested
      const TableHeader = ({ cols }: { cols: string[] }) => (
        <div className="grid gap-4 px-6 py-4 bg-gray-200 border-b border-gray-300 font-bold text-xs uppercase tracking-widest text-gray-800" style={{ gridTemplateColumns: cols.join(' ') }}>
          {cols.map((_, i) => <div key={i}>{_}</div>)}
        </div>
      );

      switch (activeTab) {
          case 'styles':
              return (
                <DashboardSection title="Yoga Styles" description="Manage studio class types." onAdd={() => setModalType('styles')}>
                   <div className="overflow-x-auto">
                     <div className="min-w-[800px]">
                       <TableHeader cols={['80px', '200px', '150px', '1fr', '100px']} />
                       <div className="divide-y divide-gray-50">
                         {styles.map(style => (
                           <div key={style.slug} className="grid gap-4 px-6 py-4 items-center hover:bg-gray-50 text-sm" style={{ gridTemplateColumns: '80px 200px 150px 1fr 100px' }}>
                             <img src={style.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                             <div className="font-bold text-gray-900">{style.name}</div>
                             <div>
                               <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${style.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : style.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}`}>
                                 {style.difficulty}
                               </span>
                             </div>
                             <div className="text-gray-500 truncate">{style.description}</div>
                             <div className="flex justify-end gap-2">
                               <button onClick={() => handleDeleteStyle(style.slug, style.image)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                </DashboardSection>
              );

          case 'schedule':
              return (
                <DashboardSection title="Schedule" description="Manage weekly timetable." onAdd={() => setModalType('schedule')}>
                   <div className="overflow-x-auto">
                     <div className="min-w-[800px]">
                       <TableHeader cols={['120px', '120px', '200px', '150px', '1fr', '100px']} />
                       <div className="divide-y divide-gray-50">
                         {scheduleData.map(session => (
                           <div key={session.id} className="grid gap-4 px-6 py-4 items-center hover:bg-gray-50 text-sm" style={{ gridTemplateColumns: '120px 120px 200px 150px 1fr 100px' }}>
                             <div className="font-medium text-sage-green flex items-center gap-2"><Calendar size={14} />{session.day}</div>
                             <div className="text-gray-600 flex items-center gap-2"><Clock size={14} />{session.time}</div>
                             <div className="font-bold text-deep-green">{session.classType}</div>
                             <div className="text-gray-600 flex items-center gap-2"><UserIcon size={14} />{session.instructor}</div>
                             <div className="text-gray-500 text-xs flex items-center gap-2"><MapPin size={14} />{session.location}</div>
                             <div className="flex justify-end gap-2">
                               <button onClick={() => handleDeleteSession(session.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                </DashboardSection>
              );

          case 'programs':
              return (
                <DashboardSection title="Programs" description="Manage structured courses." onAdd={() => setModalType('programs')}>
                   <div className="overflow-x-auto">
                     <div className="min-w-[800px]">
                       <TableHeader cols={['80px', '200px', '120px', '120px', '1fr', '100px']} />
                       <div className="divide-y divide-gray-50">
                         {programs.map(prog => (
                           <div key={prog.slug} className="grid gap-4 px-6 py-4 items-center hover:bg-gray-50 text-sm" style={{ gridTemplateColumns: '80px 200px 120px 120px 1fr 100px' }}>
                             <img src={prog.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                             <div className="font-bold text-gray-900">{prog.title}</div>
                             <div className="text-gray-600">{prog.level}</div>
                             <div className="font-mono font-medium text-sage-green">₹{prog.price}</div>
                             <div className="text-gray-500 truncate">{prog.description}</div>
                             <div className="flex justify-end gap-2">
                               <button onClick={() => handleDeleteProgram(prog.slug)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                </DashboardSection>
              );

          case 'pricing':
              return (
                <DashboardSection title="Pricing" description="Manage membership plans." onAdd={() => setModalType('pricing')}>
                   <div className="overflow-x-auto">
                     <div className="min-w-[800px]">
                       <TableHeader cols={['200px', '150px', '150px', '1fr', '100px']} />
                       <div className="divide-y divide-gray-50">
                         {pricingPlansData.map(plan => (
                           <div key={plan.id} className="grid gap-4 px-6 py-4 items-center hover:bg-gray-50 text-sm" style={{ gridTemplateColumns: '200px 150px 150px 1fr 100px' }}>
                             <div className="font-bold text-gray-900 flex items-center gap-2">
                                {plan.highlight && <span className="w-2 h-2 rounded-full bg-sage-green" title="Highlighted"></span>}
                                {plan.name}
                             </div>
                             <div className="font-mono font-medium text-sage-green">{plan.price}</div>
                             <div className="text-gray-500">{plan.period}</div>
                             <div className="flex gap-2 flex-wrap">
                                {plan.benefits.slice(0, 2).map((b, i) => <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{b}</span>)}
                                {plan.benefits.length > 2 && <span className="text-xs text-gray-400">+{plan.benefits.length - 2} more</span>}
                             </div>
                             <div className="flex justify-end gap-2">
                               <button onClick={() => handleDeletePricing(plan.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                </DashboardSection>
              );

          case 'feedback':
              return (
                <DashboardSection title="Feedback" description="Manage customer testimonials." onAdd={() => setModalType('feedback')}>
                   <div className="overflow-x-auto">
                     <div className="min-w-[800px]">
                       <TableHeader cols={['60px', '180px', '150px', '1fr', '100px']} />
                       <div className="divide-y divide-gray-50">
                         {feedback.map(item => (
                           <div key={item.id} className="grid gap-4 px-6 py-4 items-center hover:bg-gray-50 text-sm" style={{ gridTemplateColumns: '60px 180px 150px 1fr 100px' }}>
                             <img src={item.image || 'https://picsum.photos/100'} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                             <div>
                               <div className="font-bold text-gray-900">{item.name}</div>
                               <div className="text-xs text-gray-500">{item.role}</div>
                             </div>
                             <div className="flex text-yellow-400 text-xs">
                                {'★'.repeat(item.rating)}{'☆'.repeat(5-item.rating)}
                             </div>
                             <div className="text-gray-600 italic truncate">"{item.quote}"</div>
                             <div className="flex justify-end gap-2">
                               <button onClick={() => handleDeleteFeedback(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                </DashboardSection>
              );

          case 'blog':
              return (
                <DashboardSection title="Blog" description="Manage articles and posts." onAdd={() => setModalType('blog')}>
                   <div className="overflow-x-auto">
                     <div className="min-w-[800px]">
                       <TableHeader cols={['80px', '1fr', '120px', '100px', '100px']} />
                       <div className="divide-y divide-gray-50">
                         {blogPosts.map(post => (
                           <div key={post.id} className="grid gap-4 px-6 py-4 items-center hover:bg-gray-50 text-sm" style={{ gridTemplateColumns: '80px 1fr 120px 100px 100px' }}>
                             <img src={post.image || 'https://picsum.photos/100'} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                             <div>
                                <div className="font-bold text-gray-900">{post.title}</div>
                                <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</div>
                             </div>
                             <div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                  {post.published ? 'Published' : 'Draft'}
                                </span>
                             </div>
                             <div className="text-gray-500 text-xs text-center">{post.likes} Likes</div>
                             <div className="flex justify-end gap-2">
                               <button onClick={() => handleDeletePost(post.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                </DashboardSection>
              );

          case 'messages':
              return (
                <DashboardSection 
                  title="Inquiries" 
                  description="Member messages and booking requests." 
                  hideAddButton 
                  bulkActions={
                    selectedInquiryIds.length > 0 && (
                      <button 
                        onClick={handleBulkDeleteInquiries}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-100 border border-red-200 transition-all"
                      >
                        <Trash size={16} /> Delete ({selectedInquiryIds.length})
                      </button>
                    )
                  }
                >
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                      <TableHeader cols={['40px', '120px', '160px', '120px', '1fr', '80px']} />
                      <div className="divide-y divide-gray-50">
                        {inquiries.length === 0 ? (
                          <div className="p-20 text-center text-gray-400">
                            <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No messages received yet.</p>
                          </div>
                        ) : (
                          inquiries.map((inq) => (
                            <div key={inq.id} className={`grid gap-4 px-6 py-4 items-center hover:bg-gray-50/80 transition-colors text-sm ${selectedInquiryIds.includes(inq.id) ? 'bg-sage-green/5' : ''}`} style={{ gridTemplateColumns: '40px 120px 160px 120px 1fr 80px' }}>
                              <button onClick={() => toggleInquirySelection(inq.id)} className="text-gray-400 hover:text-sage-green transition-colors">
                                {selectedInquiryIds.includes(inq.id) ? <CheckSquare size={20} className="text-sage-green" /> : <Square size={20} />}
                              </button>
                              <div className="text-gray-400 font-mono text-xs">{new Date(inq.created_at).toLocaleDateString()}</div>
                              <div>
                                <div className="font-bold text-gray-900">{inq.first_name} {inq.last_name}</div>
                                <div className="text-xs text-gray-400">{inq.email}</div>
                              </div>
                              <div><span className="bg-gray-100 px-2 py-1 rounded text-[10px] font-black uppercase text-gray-500 tracking-tighter">{inq.inquiry_type || 'General'}</span></div>
                              <div className="text-gray-600 line-clamp-2 italic text-xs">"{inq.message}"</div>
                              <div className="flex justify-end gap-2">
                                <button onClick={() => { if(window.confirm('Delete this message?')) { deleteInquiry(inq.id).then(fetchAllData); } }} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </DashboardSection>
              );
          
          default:
            return null;
      }
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin text-sage-green" size={48} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-deep-green text-white fixed top-0 w-full z-[80] shadow-md h-[64px]">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <Menu size={24} />
        </button>
        <div className="font-serif text-xl font-bold tracking-tight">Meraki Admin</div>
        <div className="w-8"></div>
      </header>

      <aside className="hidden md:block w-72 fixed inset-y-0 left-0 z-40 border-r border-gray-100 shadow-2xl overflow-hidden">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-[100]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute top-0 left-0 w-[300px] h-full shadow-2xl overflow-hidden">
              <SidebarContent isMobile />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 md:ml-72 min-h-screen flex flex-col">
        <div className="hidden md:flex items-center justify-between px-10 py-5 bg-white border-b border-gray-100 sticky top-0 z-30">
            <h1 className="font-serif text-2xl text-deep-green capitalize">{activeTab}</h1>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    <UserIcon size={16} className="text-sage-green" />
                    <span className="text-sm font-medium text-gray-700">Studio Manager</span>
                </div>
            </div>
        </div>

        <div className="flex-1 p-6 md:p-10 pt-24 md:pt-10">
            <div className="max-w-6xl mx-auto">
                {renderContent()}
            </div>
        </div>
      </main>

      <Modal isOpen={!!modalType} onClose={() => setModalType(null)} title={`${editingItem ? 'Edit' : 'Add'} ${modalType}`}>
        <p className="text-gray-500 mb-6">Form fields for {modalType} will go here.</p>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={() => setModalType(null)} className="px-4 py-2 text-gray-400 hover:text-gray-600">Cancel</button>
          <button className="bg-deep-green text-white px-6 py-2 rounded-xl">Save Changes</button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;