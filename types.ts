
export interface YogaStyle {
  id?: number;
  created_at?: string;
  slug: string;
  name: string;
  description: string;
  benefits: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  image: string;
}

export interface Asana {
  slug: string;
  name: string;
  sanskrit: string;
  steps: string[];
  benefits: string[];
  contraindications: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  price: number;
  image: string;
  badge?: string;
  pdf_url?: string;
}

export interface ClassSession {
  id: string;
  day: string;
  time: string;
  classType: string;
  instructor: string;
  location: string;
  level: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  created_at: string;
  category: string;
  excerpt: string;
  image: string;
  content: string; 
  published: boolean;
  likes: number;
  comment_count?: number;
}

export interface BlogComment {
  id: number;
  post_id: number;
  user_name: string;
  user_email?: string; // Private, not shown in UI
  content: string;
  is_admin: boolean;
  created_at: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  benefits: string[];
  highlight: boolean;
}

// Contact Form Types
export interface ContactInquiry {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message: string;
  inquiry_type: string; 
}

// Customer Feedback / Testimonials
export interface CustomerFeedback {
  id: number;
  name: string;
  role: string; // e.g. "Member since 2021"
  quote: string;
  rating: number; // 1-5
  image: string;
  created_at?: string;
}

// AI Types
export interface AIRoutineStep {
  poseName: string;
  duration: string;
  instruction: string;
}

export interface AIRoutineResponse {
  routineName: string;
  targetGoal: string;
  steps: AIRoutineStep[];
}

// Auth Types
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'superadmin' | 'editor';
  lastLogin: string;
}
