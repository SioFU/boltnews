import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import ProjectManagement from '../../components/admin/ProjectManagement';
import BlogManagement from '../../components/admin/BlogManagement';
import { Shield, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('projects');
  const { isAdmin, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="projects" className="flex items-center space-x-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Projects</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center space-x-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Blog</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <ProjectManagement />
            </TabsContent>

            <TabsContent value="blog">
              <BlogManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}