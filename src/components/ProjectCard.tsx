import React from 'react';
import { Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react';
import type { Project } from '../types';
import CommentSection from './comments/CommentSection';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [showComments, setShowComments] = React.useState(false);

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl">
      <div className="relative aspect-video">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{project.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-gray-400 hover:text-pink-500">
              <Heart className="h-4 w-4" />
              <span>{project.likes}</span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-400 hover:text-blue-500"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{project.comments}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-400 hover:text-green-500">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        
        {showComments && (
          <div className="mt-6 pt-6 border-t border-gray-800">
            <CommentSection projectId={project.id} />
          </div>
        )}
      </div>
    </div>
  );
}