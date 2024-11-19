import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProjectCard from '../components/ProjectCard';
import type { Project, User } from '../types';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        // Fetch user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (userError) {
          throw userError;
        }

        if (!userData) {
          toast.error('User not found');
          setLoading(false);
          return;
        }

        setUser(userData);

        // Fetch user's projects using the view
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects_with_authors')
          .select('*')
          .eq('author_id', userId)
          .order('created_at', { ascending: false });

        if (projectsError) {
          throw projectsError;
        }

        setProjects(projectsData || []);
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-white">User not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
              alt={user.name}
              className="h-20 w-20 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-gray-400">{user.email}</p>
              {user.bio && <p className="text-gray-300 mt-2">{user.bio}</p>}
              {user.website && (
                <a 
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400 mt-2 inline-block"
                >
                  {user.website}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Projects</h2>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-900 rounded-lg">
                <p className="text-gray-400">No projects uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}