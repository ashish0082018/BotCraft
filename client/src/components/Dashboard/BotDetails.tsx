import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bot, Calendar, Copy, Key, Send, MessageCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function BotDetails() {
  const user = useSelector((state: any) => state.user.authUserDetails);
  const { botId } = useParams();
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', content: 'Hello! I\'m your AI assistant trained on your documents. How can I help you today?' }
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const bot = user.bots?.find((b: any) => b.id === botId);

  if (!bot) {
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
    navigator.clipboard.writeText(user.apiKey.key);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage('');
    setIsLoading(true);

    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Simulate API response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'bot',
        content: `I understand you're asking about "${userMessage}". Based on the documents I've been trained on, I can provide relevant information. This is a demo response showing how the bot would interact with your trained content.`
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Bot className="h-8 w-8 text-blue-400 mr-3" />
          {bot.name}
        </h1>
        <p className="text-gray-400 flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Created {formatDate(bot.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bot Information */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Key className="h-5 w-5 text-blue-400 mr-2" />
              API Key
            </h3>
            <div className="bg-gray-900/80 rounded-lg p-4 relative group">
              <code className="text-green-400 text-sm break-all">
                {user.apiKey.key}
              </code>
              <button
                onClick={copyApiKey}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Use this API key to integrate your bot with external applications.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Bot Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Queries</span>
                <span className="text-white font-medium">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Activity</span>
                <span className="text-white font-medium">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Chatbot */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 text-white p-4 flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">{bot.name} - Demo</span>
          </div>
          
          <div className="h-96 overflow-y-auto bg-gray-50 p-4">
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Ask me anything about your documents..."
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}