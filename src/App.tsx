import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminDashboard from './pages/admin/Dashboard';
import UserProfile from './pages/UserProfile';
import { useAuthStore } from './store/authStore';
import { initializeSupabase } from './lib/supabase';
import LoadingSpinner from './components/LoadingSpinner';
import EnhancedAuthModal from './components/auth/EnhancedAuthModal';
import ProjectUploadForm from './components/upload/ProjectUploadForm';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { initialize, loading } = useAuthStore();
  const [dbInitialized, setDbInitialized] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isUploadFormVisible, setIsUploadFormVisible] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initialize();
        const initialized = await initializeSupabase();
        setDbInitialized(initialized);
        
        if (!initialized) {
          console.error('Database initialization failed');
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setInitializing(false);
      }
    };

    init();
  }, [initialize]);

  const handleOpenUploadForm = () => {
    setIsUploadFormVisible(true);
  };

  const handleCloseUploadForm = () => {
    setIsUploadFormVisible(false);
  };

  if (initializing || loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-950">
        <Toaster position="top-right" />
        <Navbar onUploadClick={handleOpenUploadForm} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/:userId" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
        </Routes>

        <Footer />
        {showAuthModal && (
          <EnhancedAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        )}
        {isUploadFormVisible && <ProjectUploadForm onClose={handleCloseUploadForm} />}
      </div>
    </Router>
  );
}