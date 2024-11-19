import React, { useEffect, useState } from 'react';
import { projectService } from '../lib/supabase';
import ProjectCard from '../components/ProjectCard';
import ProjectSidebar from '../components/projects/ProjectSidebar';
import ProjectSearch from '../components/projects/ProjectSearch';
import ProjectSort from '../components/projects/ProjectSort';
import type { Project } from '../types';
import { Loader } from 'lucide-react';

type SortOption = 'latest' | 'popular';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, selectedCategories, searchQuery, sortBy]);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAllProjects();
      setProjects(data.filter(p => p.status === 'approved'));
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProjects = () => {
    let filtered = [...projects];

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(project =>
        project.categories.some(cat => selectedCategories.includes(cat))
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return b.likes - a.likes;
      }
    });

    setFilteredProjects(filtered);
  };

  if (loading) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <div className="flex items-center space-x-4">
            <ProjectSearch onSearch={setSearchQuery} />
            <ProjectSort value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        <div className="flex gap-8">
          <ProjectSidebar
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />
          
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-12 bg-gray-900 rounded-lg">
                <p className="text-gray-400">No projects found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}