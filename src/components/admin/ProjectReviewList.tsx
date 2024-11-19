import React, { useEffect, useState } from 'react';
import { Check, X, Star } from 'lucide-react';
import { projectService } from '../../lib/supabase';
import type { Project } from '../../types';
import toast from 'react-hot-toast';

export default function ProjectReviewList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingProjects();
  }, []);

  const loadPendingProjects = async () => {
    try {
      const pendingProjects = await projectService.getPendingProjects();
      setProjects(pendingProjects);
    } catch (error) {
      toast.error('Failed to load pending projects');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectReview = async (projectId: string, status: 'approved' | 'rejected', featured: boolean = false) => {
    try {
      await projectService.updateProjectStatus(projectId, status, featured);
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success(`Project ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No pending projects to review</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={project.author.avatar}
                  alt={project.author.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <p className="text-sm text-gray-400">by {project.author.name}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <p className="text-gray-300 mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View Project →
              </a>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <button
                onClick={() => handleProjectReview(project.id, 'approved', true)}
                className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                title="Approve and Feature"
              >
                <Star className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleProjectReview(project.id, 'approved')}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title="Approve"
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleProjectReview(project.id, 'rejected')}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                title="Reject"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}