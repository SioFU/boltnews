import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, ThumbsUp, MessageSquare } from 'lucide-react';
import { projectService } from '../../lib/supabase';
import type { Project } from '../../types';
import toast from 'react-hot-toast';

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const allProjects = await projectService.getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-6 py-3 text-sm font-semibold text-gray-400">Project</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-400">Author</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-400">Status</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-400">Metrics</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-gray-800">
                <td className="px-6 py-4">
                  <div>
                    <h3 className="font-medium text-white">{project.title}</h3>
                    <p className="text-sm text-gray-400">{project.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={project.author.avatar}
                      alt={project.author.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="text-gray-300">{project.author.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                    project.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                    'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-gray-400">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{project.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <MessageSquare className="h-4 w-4" />
                      <span>{project.comments}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {/* TODO: Implement edit */}}
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}