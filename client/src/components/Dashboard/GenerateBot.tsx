import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Globe, Plus, Bot, Trash2, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import type { Bot as BotType } from '../../types';
import { updateUserData } from '../../utils/api';
import toast from 'react-hot-toast';

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function GenerateBot() {
  const user = useSelector((state: any) => state.user.authUserDetails);
  const [botName, setBotName] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'pdf' | 'link'>('pdf');
  const [documentLink, setDocumentLink] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Refresh user data when component mounts
  useEffect(() => {
    if (user) {
      updateUserData().catch(console.error);
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setUploadMethod('pdf');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadMethod('pdf');
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsCreating(true);
    
    try {
      const formData = new FormData();
      formData.append('botName', botName);
      
      if (uploadMethod === 'pdf' && selectedFile) {
        formData.append('pdfFile', selectedFile);
      } else if (uploadMethod === 'link' && documentLink) {
        formData.append('url', documentLink);
      } else {
        console.error('No file or URL provided');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/v2/bot/uploadpdf`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        
        // Update user data to reflect the new bot
        await updateUserData();
        // Reset the form
        setBotName('');
        setSelectedFile(null);
        setDocumentLink('');
        toast.success('Bot created successfully!');
      }
    } catch (error: any) {
      console.error('Error creating bot:', error);
      const message = error.response?.data?.message || 'Failed to create bot';
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (botId: string) => {
    try {
      setIsDeleting(true);
      // Call the delete bot API
      const response = await axios.get(`${API_BASE_URL}/api/v2/bot/delete/${botId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
     
        // Update user data to reflect the deletion
        await updateUserData();
        toast.success('Bot deleted successfully!');
      }
    } catch (error: any) {
      console.error('Error deleting bot:', error);
      const message = error.response?.data?.message || 'Failed to delete bot';
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canCreateBot = user.bots ? user.bots.length < user.stats.botsLimit : true;

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Generate New Bot
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Create a new AI bot by uploading documents or providing a URL
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Create Bot Form */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Create New Bot</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Bot Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bot Name
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm sm:text-base"
                placeholder="My AI Assistant"
                required
              />
            </div>

            {/* Upload Method Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Upload Method</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setUploadMethod('pdf')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                    uploadMethod === 'pdf'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-white/10 text-gray-400 border border-gray-600 hover:bg-white/20'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('link')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                    uploadMethod === 'link'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-white/10 text-gray-400 border border-gray-600 hover:bg-white/20'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <span>Document URL</span>
                </button>
              </div>
            </div>

            {/* File Upload */}
            {uploadMethod === 'pdf' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Upload PDF Document</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                    dragActive
                      ? 'border-blue-400 bg-blue-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileText className="h-8 w-8 text-green-400 mx-auto" />
                      <p className="text-white text-sm sm:text-base">{selectedFile.name}</p>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-gray-300 text-sm sm:text-base">
                        Drag and drop a PDF file here, or click to select
                      </p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Choose file
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Document URL */}
            {uploadMethod === 'link' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Document URL
                </label>
                <input
                  type="url"
                  value={documentLink}
                  onChange={(e) => setDocumentLink(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm sm:text-base"
                  placeholder="https://example.com/document.pdf"
                  required
                />
              </div>
            )}

            {/* Create Button */}
            <button
              type="submit"
              disabled={isCreating || !botName || (uploadMethod === 'pdf' && !selectedFile) || (uploadMethod === 'link' && !documentLink)}
              className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isCreating ? 'Creating Bot...' : 'Create Bot'}
            </button>
          </form>
        </div>

        {/* Existing Bots */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Your Bots</h2>
          
          {user.bots && user.bots.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {user.bots.map((bot: BotType) => (
                <div
                  key={bot.id}
                  className="bg-white/5 backdrop-blur-md rounded-lg border border-blue-500/20 p-3 sm:p-4 hover:border-blue-400/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                      <div>
                        <h3 className="text-white font-medium text-sm sm:text-base">{bot.name}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          Created {new Date(bot.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/dashboard/bot/${bot.id}`}
                        className="p-1.5 sm:p-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                      <p className='text-sm'> View Details</p>
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(bot.id)}
                        className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-sm sm:text-base">No bots created yet</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Create your first bot to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-gray-900 rounded-xl border border-red-500/30 p-6 max-w-md mx-4">
          <h3 className="text-lg font-semibold text-white mb-4">Delete Bot</h3>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete <strong>{user.bots?.find((b: any) => b.id === deleteConfirm)?.name}</strong>? This action cannot be undone.
          </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}