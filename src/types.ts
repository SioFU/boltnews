export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  categories: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  likes: number;
  comments: number;
  createdAt: string;
  approvedAt?: string;
}

export interface ProjectSubmission {
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  categories: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  bio?: string;
  website?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}