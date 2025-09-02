import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Bot, Calendar, Copy, Key, Send, MessageCircle, Palette, Type, MessageSquare, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

// API base URL from environment variable
const API_BASE_URL = 'https://botcraft-k4ri.onrender.com';

interface BotDetails {
  id: string;
  name: string;
  createdAt: string;
  apiKey: string;
  stats: {
    status: 'ACTIVE' | 'INACTIVE';
    totalQueries: number;
    lastActivityAt: string | null;
  };
  customization: {
    primaryColor: string;
    headerText: string;
    initialMessage: string;
  };
  trainedSources: string[];
}

export default function BotDetails() {
  const user = useSelector((state: any) => state.user.authUserDetails);
  const { botId } = useParams();
  const [botDetails, setBotDetails] = useState<BotDetails | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'bot'; content: string }>>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Customization state
  const [customization, setCustomization] = useState({
    primaryColor: '#007bff',
    headerText: 'Chat with AI',
    initialMessage: 'Hi! How can I help you today?'
  });

  // Load bot details on component mount
  useEffect(() => {
    if (botId) {
      loadBotDetails();
    }
  }, [botId]);

  // Update chat messages when customization changes
  useEffect(() => {
    if (botDetails) {
      setChatMessages([
        { role: 'bot', content: customization.initialMessage }
      ]);
    }
  }, [customization.initialMessage, botDetails]);

  // Auto-scroll to bottom when chat messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadBotDetails = async () => {
    try {
      setIsLoadingDetails(true);
      const response = await axios.get(`${API_BASE_URL}/api/v2/bot/get-bot-details/${botId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        const details = response.data.data;
        setBotDetails(details);
        setCustomization(details.customization);
        setChatMessages([
          { role: 'bot', content: details.customization.initialMessage }
        ]);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to load bot details';
      toast.error(message);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (isLoadingDetails) {
    return (
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-8 sm:h-10 bg-gray-700/50 rounded-lg w-64 mb-2"></div>
          <div className="h-4 sm:h-5 bg-gray-700/50 rounded w-48"></div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column Skeleton */}
          <div className="space-y-4 sm:space-y-6">
            {/* API Key Skeleton */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6">
              <div className="h-5 sm:h-6 bg-gray-700/50 rounded w-24 mb-3 sm:mb-4"></div>
              <div className="h-12 sm:h-16 bg-gray-700/50 rounded-lg w-full mb-2"></div>
              <div className="h-4 bg-gray-700/50 rounded w-80"></div>
            </div>

            {/* Bot Statistics Skeleton */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6">
              <div className="h-5 sm:h-6 bg-gray-700/50 rounded w-32 mb-3 sm:mb-4"></div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-700/50 rounded w-20"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-16"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-700/50 rounded w-24"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-12"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-700/50 rounded w-24"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-20"></div>
                </div>
              </div>
            </div>

            {/* Customization Skeleton */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6">
              <div className="h-5 sm:h-6 bg-gray-700/50 rounded w-36 mb-3 sm:mb-4"></div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="h-4 bg-gray-700/50 rounded w-24 mb-2"></div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-10 h-8 sm:w-12 sm:h-10 bg-gray-700/50 rounded"></div>
                    <div className="flex-1 h-8 sm:h-10 bg-gray-700/50 rounded-lg"></div>
                  </div>
                </div>
                <div>
                  <div className="h-4 bg-gray-700/50 rounded w-20 mb-2"></div>
                  <div className="h-8 sm:h-10 bg-gray-700/50 rounded-lg"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-700/50 rounded w-28 mb-2"></div>
                  <div className="h-20 sm:h-24 bg-gray-700/50 rounded-lg"></div>
                </div>
                <div className="h-10 sm:h-12 bg-gray-700/50 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Right Column - Chat Skeleton */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md mx-auto xl:mx-0 flex flex-col h-[400px] sm:h-[500px]">
            <div className="h-12 sm:h-16 bg-gray-700/50 flex items-center space-x-2 p-3 sm:p-4">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-600 rounded"></div>
              <div className="h-4 sm:h-5 bg-gray-600 rounded w-32"></div>
            </div>
            
            <div className="flex-1 bg-gray-50 p-3 sm:p-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-start">
                  <div className="max-w-[180px] sm:max-w-[200px] h-12 sm:h-16 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[180px] sm:max-w-[200px] h-8 sm:h-10 bg-gray-700/50 rounded-lg"></div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[180px] sm:max-w-[200px] h-16 sm:h-20 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
            
            <div className="p-3 sm:p-4 border-t bg-white">
              <div className="flex space-x-2">
                <div className="flex-1 h-10 sm:h-12 bg-gray-200 rounded-lg"></div>
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gray-700/50 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!botDetails) {
    return (
      <div className="text-center py-12">
        <Bot className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Bot not found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyApiKey = () => {
    if (botDetails.apiKey && botDetails.apiKey !== 'Not available') {
      navigator.clipboard.writeText(botDetails.apiKey);
      toast.success('API key copied to clipboard!');
    } else {
      toast.error('API key not available');
    }
  };

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      const newStatus = botDetails.stats.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      
      const response = await axios.post(`${API_BASE_URL}/api/v2/bot/toggle-status/${botDetails.id}`, {
        status: newStatus
      }, {
        withCredentials: true,
      });

      if (response.data.success) {
        setBotDetails(prev => prev ? {
          ...prev,
          stats: {
            ...prev.stats,
            status: newStatus
          }
        } : null);
        toast.success(`Bot ${newStatus.toLowerCase()} successfully`);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to toggle bot status';
      toast.error(message);
    } finally {
      setIsToggling(false);
    }
  };

  const handleSaveCustomization = async () => {
    try {
      setIsSaving(true);
      const response = await axios.post(`${API_BASE_URL}/api/v2/bot/update-customization/${botDetails.id}`, {
        primaryColor: customization.primaryColor,
        headerText: customization.headerText,
        initialMessage: customization.initialMessage
      }, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success('Customization saved successfully!');
        // Update bot details with new customization
        setBotDetails(prev => prev ? {
          ...prev,
          customization: customization
        } : null);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save customization';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage('');
    setIsLoading(true);

    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v2/bot/test-bot/${botDetails.id}`, {
        question: userMessage
      }, {
        withCredentials: true,
      });

      if (response.data.success) {
        setChatMessages(prev => [...prev, {
          role: 'bot',
          content: response.data.answer
        }]);
      } else {
        setChatMessages(prev => [...prev, {
          role: 'bot',
          content: 'Sorry, I encountered an error. Please try again.'
        }]);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to get response';
      setChatMessages(prev => [...prev, {
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to adjust color brightness
  const adjustColorBrightness = (hex: string, percent: number) => {
    // Remove the # if it's there
    hex = hex.replace(/\s|#/g, '');
    
    // Convert to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Adjust brightness
    r = Math.min(255, Math.max(0, parseInt(String(r * (100 + percent) / 100))));
    g = Math.min(255, Math.max(0, parseInt(String(g * (100 + percent) / 100))));
    b = Math.min(255, Math.max(0, parseInt(String(b * (100 + percent) / 100))));

    // Convert back to hex
    const rHex = r.toString(16).padStart(2, '0');
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  };

  // Calculate lighter and darker shades
  const primaryLight = `${customization.primaryColor}1a`;
  const primaryDark = adjustColorBrightness(customization.primaryColor, -20);

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center">
          <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mr-2 sm:mr-3" />
          {botDetails.name}
        </h1>
        <p className="text-gray-400 flex items-center text-sm sm:text-base">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          Created {formatDate(botDetails.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Left Column - Bot Information and Customization */}
        <div className="space-y-4 sm:space-y-6">
          {/* Bot Information */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <Key className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mr-2" />
              API Key
            </h3>
            <div className="bg-gray-900/80 rounded-lg p-3 sm:p-4 relative group">
              <code className="text-green-400 text-xs sm:text-sm break-all">
                {botDetails.apiKey}
              </code>
              <button
                onClick={copyApiKey}
                className="absolute top-2 right-2 p-1.5 sm:p-2 text-gray-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              Use this API key to integrate your bot with external applications.
            </p>
          </div>

          {/* Bot Statistics */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Bot Statistics</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm sm:text-base">Status</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium text-sm sm:text-base ${botDetails.stats.status === 'ACTIVE' ? 'text-green-400' : 'text-red-400'}`}>
                    {botDetails.stats.status}
                  </span>
                  <button
                    onClick={handleToggleStatus}
                    disabled={isToggling}
                    className="p-1 rounded transition-colors hover:bg-white/10 disabled:opacity-50"
                  >
                    {botDetails.stats.status === 'ACTIVE' ? 
                      <ToggleRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" /> : 
                      <ToggleLeft className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                    }
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Total Queries</span>
                <span className="text-white font-medium text-sm sm:text-base">{botDetails.stats.totalQueries}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Last Activity</span>
                <span className="text-white font-medium text-sm sm:text-base">
                  {botDetails.stats.lastActivityAt ? formatDate(botDetails.stats.lastActivityAt) : 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* Bot Customization */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mr-2" />
              Bot Customization
            </h3>
            
            <div className="space-y-3 sm:space-y-4">
              {/* Primary Color */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <Palette className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Primary Color
                </label>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <input
                    type="color"
                    value={customization.primaryColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-10 h-8 sm:w-12 sm:h-10 rounded border border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customization.primaryColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
                    placeholder="#007bff"
                  />
                </div>
              </div>

              {/* Header Text */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <Type className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Header Text
                </label>
                <input
                  type="text"
                  value={customization.headerText}
                  onChange={(e) => setCustomization(prev => ({ ...prev, headerText: e.target.value }))}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
                  placeholder="Chat with AI"
                />
              </div>

              {/* Initial Message */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Initial Message
                </label>
                <textarea
                  value={customization.initialMessage}
                  onChange={(e) => setCustomization(prev => ({ ...prev, initialMessage: e.target.value }))}
                  rows={3}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none text-xs sm:text-sm"
                  placeholder="Hi! How can I help you today?"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveCustomization}
                disabled={isSaving}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
              >
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Customization'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Demo Chatbot */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md mx-auto xl:mx-0 flex flex-col h-[500px] sm:h-[600px]">
          {/* Chat Header */}
          <div 
            className="text-white p-4 flex items-center gap-3 flex-shrink-0"
            style={{ backgroundColor: customization.primaryColor }}
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <span className="font-semibold text-sm">{customization.headerText}</span>
              <div className="text-xs opacity-80">Online</div>
            </div>
            <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            <div className="space-y-4">
              {/* Welcome message with avatar */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
                  </svg>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg rounded-tl-none p-3 max-w-[80%] text-sm">
                  {customization.initialMessage}
                </div>
              </div>

              {/* Chat messages */}
              {chatMessages.slice(1).map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
                      </svg>
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg text-sm max-w-[80%] ${
                      msg.role === 'user'
                        ? 'text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                    }`}
                    style={msg.role === 'user' ? { backgroundColor: customization.primaryColor } : {}}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
                    </svg>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg rounded-tl-none p-3 flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
          
          {/* Chat Footer */}
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex-shrink-0">
            <div className="flex items-center bg-gray-100 rounded-full pl-4 pr-1 py-1 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm py-2"
                placeholder="Type your message here..."
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="w-10 h-10 flex items-center justify-center rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: customization.primaryColor }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}