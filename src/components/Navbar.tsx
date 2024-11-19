import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AuthModal from './auth/AuthModal'; // 确保导入路径正确

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate(`/user/${user.id}`);
      }
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-white">bolt<span className="text-blue-500">news</span></span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                <Link to="/projects" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Projects</Link>
                <Link to="/blog" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Blog</Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={handleUserClick}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white"
                  >
                    <img
                      src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || '')}`}
                      alt={user.email || ''}
                      className="h-8 w-8 rounded-full"
                    />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-gray-300 hover:text-white flex items-center space-x-1"
                >
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* 登录弹窗 */}
      {showAuthModal && (
        <AuthModal isOpen={showAuthModal} onClose={handleAuthClose} />
      )}
    </nav>
  );
}
