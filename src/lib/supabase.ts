import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import type { Project, ProjectSubmission } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Initialize Supabase schema and tables
async function initializeSupabase() {
  try {
    // Call the initialize_schema function
    const { error } = await supabase.rpc('initialize_schema');
    
    if (error) {
      console.error('Schema initialization error:', error);
      return false;
    }

    // Check if database connection is working by attempting to query users table
    const { error: testError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Database connection error:', testError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    return false;
  }
}

const projectService = {
  async submitProject(projectData: ProjectSubmission) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          author_id: user.user.id,
          status: 'pending',
          featured: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting project:', error);
      throw error;
    }
  },

  async getAllProjects() {
    try {
      const { data, error } = await supabase
        .from('projects_with_authors')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async getFeaturedProjects() {
    try {
      const { data, error } = await supabase
        .from('projects_with_authors')
        .select('*')
        .eq('status', 'approved')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      return [];
    }
  },

  async getPendingProjects() {
    try {
      const { data, error } = await supabase
        .from('projects_with_authors')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pending projects:', error);
      return [];
    }
  },

  async updateProjectStatus(projectId: string, status: 'approved' | 'rejected', featured: boolean = false) {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          status,
          featured,
          ...(status === 'approved' ? { approved_at: new Date().toISOString() } : {}),
        })
        .eq('id', projectId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating project status:', error);
      throw error;
    }
  },
};

const blogService = {
  async getAllPosts() {
    try {
      const { data, error } = await supabase
        .from('blog_posts_with_authors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  },

  async getPost(slug: string) {
    try {
      const { data, error } = await supabase
        .from('blog_posts_with_authors')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  },

  async createPost(postData: any) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(postData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  async updatePost(postId: string, postData: any) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  async deletePost(postId: string) {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },
};

// Export all services and initialization function
export { supabase, projectService, blogService, initializeSupabase };