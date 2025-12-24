import React, { useState, useEffect, useContext, createContext } from 'react';
import { YogaStyle, Asana, Course, ClassSession, PricingPlan, BlogPost } from '../types.ts';

// --- MINIMAL ROUTER IMPLEMENTATION ---
const RouterContext = createContext<any>({ path: '/', state: null, navigate: () => {} });

export const BrowserRouter = ({ children }: { children?: React.ReactNode }) => {
  const [path, setPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');
  const [state, setState] = useState<any>(typeof window !== 'undefined' ? window.history.state : null);

  useEffect(() => {
    const onPop = () => {
      setPath(window.location.pathname);
      setState(window.history.state);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (to: string, opts?: { state?: any }) => {
    window.history.pushState(opts?.state, '', to);
    setPath(to);
    setState(opts?.state);
    window.scrollTo(0, 0);
  };

  return React.createElement(RouterContext.Provider, { value: { path, state, navigate } }, children);
};

export const Routes = ({ children }: { children?: React.ReactNode }) => {
  const { path } = useContext(RouterContext);
  let match: React.ReactNode = null;

  // Normalize current path for comparison
  const normalizedPath = path.replace(/\/$/, '') || '/';

  React.Children.forEach(children, (child) => {
    if (match) return;
    if (React.isValidElement(child)) {
      const props = child.props as any;
      const routePath = props.path;
      
      // Normalize route path
      const normalizedRoutePath = routePath ? (routePath.replace(/\/$/, '') || '/') : null;
      
      if (normalizedRoutePath === normalizedPath) {
         match = props.element;
      } else if (routePath && routePath.includes('/:')) {
         const base = routePath.split('/:')[0];
         if (path.startsWith(base) && path.split('/').length === routePath.split('/').length) {
             match = props.element;
         }
      } else if (routePath === '*') {
          match = props.element;
      }
    }
  });
  return match ? React.cloneElement(match as React.ReactElement) : null;
};

export const Route = (_props: { path: string, element: React.ReactNode }) => null;

export const Link = ({ to, children, className, ...props }: any) => {
  const { navigate } = useContext(RouterContext);
  return React.createElement('a', {
    href: to,
    className,
    onClick: (e: any) => {
      e.preventDefault();
      navigate(to);
    },
    ...props
  }, children);
};

export const useLocation = () => {
  const { path, state } = useContext(RouterContext);
  return { pathname: path, state };
};

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext);
  return navigate;
};

export const useParams = <T extends Record<string, string>>(): T => {
    const { path } = useContext(RouterContext);
    const parts = path.split('/');
    if (parts[1] === 'blog' && parts[2]) {
        return { slug: parts[2] } as any;
    }
    return {} as any;
};

// --- Mock Data ---
export const yogaStyles: YogaStyle[] = [
  {
    slug: 'hatha-yoga',
    name: 'Hatha Yoga',
    description: 'A gentle introduction to foundational yoga postures, focusing on alignment and breath.',
    benefits: ['Flexibility', 'Stress Relief', 'Calm Mind'],
    difficulty: 'Beginner',
    duration: '45-60 min',
    image: 'https://picsum.photos/seed/hatha/800/600'
  },
  {
    slug: 'vinyasa-flow',
    name: 'Vinyasa Flow',
    description: 'A dynamic practice connecting breath with movement in a continuous sequence.',
    benefits: ['Cardio Health', 'Strength', 'Endurance'],
    difficulty: 'Intermediate',
    duration: '60 min',
    image: 'https://picsum.photos/seed/vinyasa/800/600'
  }
];

export const asanas: Asana[] = [
  {
    slug: 'downward-dog',
    name: 'Downward Facing Dog',
    sanskrit: 'Adho Mukha Svanasana',
    steps: ['Start on hands and knees.', 'Lift hips upward.', 'Straighten legs and arms.'],
    benefits: ['Strengthens shoulders', 'Stretches hamstrings'],
    contraindications: ['Carpal tunnel', 'High blood pressure'],
    difficulty: 'Beginner',
    image: 'https://picsum.photos/seed/downdog/600/400'
  }
];

export const courses: Course[] = [
  {
    slug: 'beginners-journey',
    title: 'Beginner’s Journey',
    description: 'A 4-week program to build your foundation.',
    level: 'Beginner',
    duration: '4 Weeks',
    price: 49,
    image: 'https://picsum.photos/seed/course1/800/600',
    badge: 'Most Popular'
  }
];

export const schedule: ClassSession[] = [
  { id: '1', day: 'Monday', time: '07:00 AM', classType: 'Morning Flow', instructor: 'Sarah J.', location: 'Studio A', level: 'Open' }
];

export const pricingPlans: PricingPlan[] = [
  {
    id: 'drop-in',
    name: 'Drop-In',
    price: '₹500',
    period: 'per class',
    benefits: ['Access to any single class', 'Mat rental included', 'Valid for 7 days'],
    highlight: false
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'mindfulness-in-chaos',
    title: 'Finding Mindfulness in Chaos',
    created_at: '2023-10-12T10:00:00Z',
    category: 'Wellness',
    excerpt: 'How to maintain your zen when the world around you is spinning fast.',
    image: 'https://picsum.photos/seed/blog1/800/400',
    content: 'Mindfulness is not just about sitting in silence...',
    published: true,
    likes: 42
  }
];