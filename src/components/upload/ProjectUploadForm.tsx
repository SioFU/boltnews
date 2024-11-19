import React, { useState } from 'react';
import { PROJECT_CATEGORIES } from '../projects/Project_categories';
import { useAuthStore } from '../../store/authStore';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProjectUploadFormProps {
  onClose: () => void;
}

function ProjectUploadForm({ onClose }: ProjectUploadFormProps) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    categories: [] as string[],
    url: '',
    description: '',
    screenshot: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((cat) => cat !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setUploadedImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 提交逻辑
      onClose(); // 关闭表单
      toast.success('Project submitted successfully!');
    } catch (error) {
      toast.error('Error submitting project.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg w-full max-w-2xl relative shadow-lg max-h-screen overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
        <form className="space-y-4 text-white" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-gray-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1">
              Project Categories <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_CATEGORIES.map((category) => (
                <label key={category.id} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    value={category.id}
                    checked={formData.categories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="form-checkbox h-4 w-4 text-blue-500 border-gray-700 bg-gray-900"
                  />
                  <span className="text-gray-300">{category.icon} {category.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="url" className="block mb-1">
              Project URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-gray-300"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1">
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-gray-300"
              rows={4}
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="screenshot" className="block mb-1">
              Project Screenshot
            </label>
            <input
              type="file"
              id="screenshot"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-gray-300 bg-gray-900 border border-gray-700 rounded cursor-pointer"
            />
          </div>

          {uploadedImage && (
            <div>
              <label className="block mb-1">Uploaded Screenshot Preview</label>
              <img
                src={uploadedImage}
                alt="Project Screenshot"
                className="w-full max-h-64 border border-gray-700 rounded object-contain"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
          >
            Submit Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProjectUploadForm;
