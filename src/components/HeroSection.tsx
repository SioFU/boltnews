import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import ProjectUploadForm from './upload/ProjectUploadForm'; // 确保导入路径正确

export default function HeroSection() {
  const [showModal, setShowModal] = useState(false);

  const handleUploadClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          Discover AI-Powered<br />Web Applications
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Explore amazing projects built with AI assistance. Share your creations and get inspired by the community.
        </p>
        <button
          onClick={handleUploadClick}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
        >
          <Upload className="h-5 w-5 mr-2" />
          Share Your Project
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg relative max-w-3xl w-full mx-4">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <ProjectUploadForm onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </section>
  );
}
