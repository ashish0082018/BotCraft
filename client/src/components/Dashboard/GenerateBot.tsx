import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Globe, Plus, Bot, Trash2, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import type { Bot as BotType } from '../../types';

export default function GenerateBot() {
  const user = useSelector((state: any) => state.user.authUserDetails);
  const [botName, setBotName] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'pdf' | 'link'>('pdf');
  const [documentLink, setDocumentLink] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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

      const response = await axios.post('http://localhost:3000/api/v2/bot/uploadpdf', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        console.log('Bot created successfully:', response.data.bot);
        // TODO: Update Redux store with new bot
        // For now, just reset the form
        setBotName('');
        setSelectedFile(null);
        setDocumentLink('');
        alert('Bot created successfully!');
      }
    } catch (error: any) {
      console.error('Error creating bot:', error);
      const message = error.response?.data?.message || 'Failed to create bot';
      alert(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = (botId: string) => {
    // TODO: Implement bot deletion API call
    console.log('Bot deleted:', botId);
    setDeleteConfirm(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canCreateBot = user.bots ? user.bots.length < (user.plan === 'FREE' ? 2 : 10) : true;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Generate Bot</h1>
        <p className="text-gray-400">
          Create a new AI chatbot from your documents
        </p>
      </div>

      {/* Create Bot Form */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-8 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">Create New Bot</h2>
        
        {!canCreateBot && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">
              You've reached the maximum number of bots for your {user.plan} plan. 
              <Link to="/dashboard/billing" className="text-red-400 hover:text-red-300 underline ml-1">
                Upgrade to create more bots.
              </Link>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bot Name
            </label>
            <input
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="e.g., Customer Support Bot"
              required
              disabled={!canCreateBot}
            />
          </div>

          {/* Upload Method Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Document Source
            </label>
            <div className="flex space-x-4 mb-6">
              <button
                type="button"
                onClick={() => {
                  setUploadMethod('pdf');
                  setDocumentLink('');
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  uploadMethod === 'pdf'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-white/5 text-gray-400 border border-gray-600 hover:border-blue-500/30'
                }`}
                disabled={!canCreateBot}
              >
                <FileText className="h-4 w-4" />
                <span>Upload PDF</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadMethod('link');
                  setSelectedFile(null);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  uploadMethod === 'link'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-white/5 text-gray-400 border border-gray-600 hover:border-blue-500/30'
                }`}
                disabled={!canCreateBot}
              >
                <Globe className="h-4 w-4" />
                <span>Document Link</span>
              </button>
            </div>

            {uploadMethod === 'pdf' ? (
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-500/10' 
                    : 'border-gray-600 hover:border-blue-500/50'
                } ${!canCreateBot ? 'opacity-50 pointer-events-none' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={!canCreateBot}
                />
                <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                {selectedFile ? (
                  <div>
                    <p className="text-white font-medium">{selectedFile.name}</p>
                    <p className="text-gray-400 text-sm">File selected - ready to create bot</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-medium mb-2">Drop your PDF here</p>
                    <p className="text-gray-400 text-sm">or click to browse files</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  value={documentLink}
                  onChange={(e) => setDocumentLink(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="https://example.com/docs"
                  disabled={!canCreateBot}
                />
                <p className="text-gray-400 text-sm mt-2">
                  Provide a link to your documentation or website
                </p>
              </div>
            )}
          </div>

                      <button
              type="submit"
              disabled={!canCreateBot || !botName || (!selectedFile && !documentLink) || isCreating}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Plus className="h-5 w-5 inline mr-2" />
              {isCreating ? 'Creating Bot...' : 'Create Bot'}
            </button>
        </form>
      </div>

      {/* Existing Bots */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Your Bots</h2>
        
        {user.bots && user.bots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.bots.map((bot) => (
              <div key={bot.id} className="bg-white/5 rounded-lg border border-gray-700 p-6 hover:border-blue-500/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <Bot className="h-8 w-8 text-blue-400" />
                  <button
                    onClick={() => setDeleteConfirm(bot.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{bot.name}</h3>
                <div className="flex items-center text-gray-400 text-sm mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created {formatDate(bot.createdAt)}
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/dashboard/bot/${bot.id}`}
                    className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 text-center rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bot className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No bots created yet. Create your first bot above!</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-red-500/30 p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Delete Bot</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this bot? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}