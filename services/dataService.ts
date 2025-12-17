
import { YogaStyle, Asana, Course, ClassSession, PricingPlan, BlogPost } from '../types';

// Mock Data for Yoga Styles
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
  },
  {
    slug: 'yin-yoga',
    name: 'Yin Yoga',
    description: 'Slow-paced style with poses held for longer periods to target deep connective tissues.',
    benefits: ['Joint Health', 'Deep Relaxation', 'Flexibility'],
    difficulty: 'Beginner',
    duration: '60-75 min',
    image: 'https://picsum.photos/seed/yin/800/600'
  }
];

// Mock Data for Asanas
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
  },
  {
    slug: 'tree-pose',
    name: 'Tree Pose',
    sanskrit: 'Vrksasana',
    steps: ['Stand tall.', 'Shift weight to left foot.', 'Place right foot on inner thigh.', 'Bring hands to prayer.'],
    benefits: ['Balance', 'Focus', 'Leg Strength'],
    contraindications: ['Low blood pressure', 'Headache'],
    difficulty: 'Beginner',
    image: 'https://picsum.photos/seed/tree/600/400'
  },
  {
    slug: 'warrior-ii',
    name: 'Warrior II',
    sanskrit: 'Virabhadrasana II',
    steps: ['Step feet wide apart.', 'Turn right foot out.', 'Bend right knee.', 'Extend arms parallel to floor.'],
    benefits: ['Hip opening', 'Leg strength', 'Stamina'],
    contraindications: ['Diarrhea', 'High blood pressure'],
    difficulty: 'Beginner',
    image: 'https://picsum.photos/seed/warrior2/600/400'
  }
];

// Mock Data for Courses
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
  },
  {
    slug: 'stress-relief',
    title: 'Stress Relief Protocol',
    description: 'Techniques to manage anxiety and find peace.',
    level: 'All Levels',
    duration: '2 Weeks',
    price: 29,
    image: 'https://picsum.photos/seed/course2/800/600'
  },
  {
    slug: 'advanced-flexibility',
    title: 'Advanced Flexibility',
    description: 'Deep stretching for experienced practitioners.',
    level: 'Advanced',
    duration: '6 Weeks',
    price: 89,
    image: 'https://picsum.photos/seed/course3/800/600',
    badge: 'New Launch'
  }
];

// Mock Schedule
export const schedule: ClassSession[] = [
  { id: '1', day: 'Monday', time: '07:00 AM', classType: 'Morning Flow', instructor: 'Sarah J.', location: 'Studio A', level: 'Open' },
  { id: '2', day: 'Monday', time: '06:00 PM', classType: 'Yin Yoga', instructor: 'Mark D.', location: 'Studio B', level: 'Beginner' },
  { id: '3', day: 'Tuesday', time: '08:00 AM', classType: 'Power Yoga', instructor: 'Sarah J.', location: 'Studio A', level: 'Intermediate' },
  { id: '4', day: 'Wednesday', time: '07:00 PM', classType: 'Meditation', instructor: 'Priya K.', location: 'Zen Room', level: 'All' },
  { id: '5', day: 'Friday', time: '05:30 PM', classType: 'Hatha Align', instructor: 'Mark D.', location: 'Studio A', level: 'Beginner' },
];

// Mock Pricing
export const pricingPlans: PricingPlan[] = [
  {
    id: 'drop-in',
    name: 'Drop-In',
    price: '₹500',
    period: 'per class',
    benefits: ['Access to any single class', 'Mat rental included', 'Valid for 7 days'],
    highlight: false
  },
  {
    id: 'monthly',
    name: 'Unlimited Monthly',
    price: '₹2500',
    period: 'per month',
    benefits: ['Unlimited classes', '10% off workshops', 'Free guest pass (1/mo)', 'Access to online library'],
    highlight: true
  },
  {
    id: 'yearly',
    name: 'Annual Yogi',
    price: '₹25000',
    period: 'per year',
    benefits: ['All monthly benefits', 'Free private session', 'Exclusive merch pack', 'Priority booking'],
    highlight: false
  }
];

// Mock Blog
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
  },
  {
    id: 2,
    slug: 'yoga-for-runners',
    title: 'Yoga for Runners',
    created_at: '2023-10-05T09:00:00Z',
    category: 'Fitness',
    excerpt: 'The essential stretches every runner needs to prevent injury.',
    image: 'https://picsum.photos/seed/blog2/800/400',
    content: 'Running tightens the hamstrings, but yoga can help...',
    published: true,
    likes: 28
  },
  {
    id: 3,
    slug: 'diet-and-practice',
    title: 'Sattvic Diet & Practice',
    created_at: '2023-09-28T14:30:00Z',
    category: 'Diet',
    excerpt: 'What to eat before and after your practice for optimal energy.',
    image: 'https://picsum.photos/seed/blog3/800/400',
    content: 'A sattvic diet consists of fresh, light, and nutritious foods...',
    published: true,
    likes: 55
  }
];
