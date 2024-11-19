import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import ProjectReviewList from '../components/admin/ProjectReviewList';
import { Shield } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Pending Projects</h2>
          <ProjectReviewList />
        </div>
      </div>
    </div>
  );
}