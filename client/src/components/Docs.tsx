import React, { useState } from 'react';
import { Check, Copy, MessageCircle, Send, Menu, X } from 'lucide-react';

export default function Docs() {
  const [activeTab, setActiveTab] = useState('sdk');
  const [demoMessage, setDemoMessage] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const sidebarItems = [
    {
      title: 'Integrate with SDK',
      items: [
        { id: 'sdk', label: 'Example Usage' },
        { id: 'ui-demo', label: 'UI Demo' }
      ]
    },
    {
      title: 'Integrate with API',
      items: [
        { id: 'api', label: 'Example Request' },
        { id: 'custom-ui', label: 'Custom UI Integration' }
      ]
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="flex items-center space-x-2 text-gray-300 hover:text-blue-300 transition-colors"
          >
            <Menu className="h-6 w-6" />
            <span className="text-lg font-semibold text-white">Documentation</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile Sidebar Overlay */}
          {showMobileSidebar && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/5 backdrop-blur-md border-r border-blue-500/20 transform transition-transform duration-300 ease-in-out lg:transform-none ${
            showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } lg:w-64 lg:shrink-0`}>
            <div className="p-4 sm:p-6 lg:sticky lg:top-24">
              {/* Mobile close button */}
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-lg font-semibold text-white">Documentation</h2>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <h2 className="text-lg font-semibold text-white mb-6 hidden lg:block">Documentation</h2>
              {sidebarItems.map((section) => (
                <div key={section.title} className="mb-6">
                  <h3 className="text-sm font-medium text-blue-400 mb-3">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            setActiveTab(item.id);
                            setShowMobileSidebar(false);
                          }}
                          className={`text-sm transition-colors hover:text-blue-300 ${
                            activeTab === item.id ? 'text-blue-400' : 'text-gray-400'
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6 lg:p-8">
              {activeTab === 'sdk' && (
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">SDK Integration</h1>
                  <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                    Embed the BotCraft chatbot widget directly into your website using our CDN script.
                  </p>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Installation</h3>
                  <div className="bg-gray-900/80 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 relative group">
                    <code className="text-green-400 text-xs sm:text-sm">
{`<script 
  src="http://localhost:3000/api/v2/bot/widget.js" 
  data-api-key="sa-74e0e564-05e6-428f-9620-c949b3d5e242" 
  defer>
</script>`}
                    </code>
                    <button
                      onClick={() => copyToClipboard(`<script src="http://localhost:3000/api/v2/bot/widget.js" data-api-key="sa-74e0e564-05e6-428f-9620-c949b3d5e242" defer></script>`)}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
                    <p className="text-blue-300 text-xs sm:text-sm">
                      <strong>Note:</strong> Replace the API key with your actual bot's API key from your dashboard.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'ui-demo' && (
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Chatbot UI Demo</h1>
                  <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                    Preview how the chatbot widget will appear on your website.
                  </p>
                  
                  {/* Demo Chatbot */}
                  <div className="bg-white rounded-lg shadow-xl max-w-md mx-auto">
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-semibold">BotCraft Assistant</span>
                    </div>
                    <div className="p-4 h-64 overflow-y-auto bg-gray-50">
                      <div className="space-y-3">
                        <div className="bg-blue-100 text-blue-900 p-3 rounded-lg max-w-xs">
                          Hello! I'm your AI assistant. How can I help you today?
                        </div>
                        <div className="bg-gray-200 text-gray-900 p-3 rounded-lg max-w-xs ml-auto">
                          What are your operating hours?
                        </div>
                        <div className="bg-blue-100 text-blue-900 p-3 rounded-lg max-w-xs">
                          We're open Monday to Friday, 9 AM to 6 PM EST. Feel free to ask any questions!
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t bg-white rounded-b-lg">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          disabled
                        />
                        <button
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          disabled
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">Demo mode - chat disabled</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div>
                  <h1 className="text-3xl font-bold text-white mb-6">API Integration</h1>
                  <p className="text-gray-300 mb-6">
                    Use our REST API to build your own custom chatbot interface.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-4">Example Request</h3>
                  <div className="bg-gray-900/80 rounded-lg p-4 mb-6 relative group">
                    <code className="text-green-400 text-sm whitespace-pre">
{`POST http://localhost:3000/api/v/bot
Headers: { 
  "Authorization": "Bearer <API_KEY>",
  "Content-Type": "application/json"
}
Body: { 
  "question": "College name and location ?" 
}`}
                    </code>
                    <button
                      onClick={() => copyToClipboard('POST http://localhost:3000/api/v/bot\nHeaders: { "Authorization": "Bearer <API_KEY>", "Content-Type": "application/json" }\nBody: { "question": "College name and location ?" }')}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-300 text-sm">
                      <strong>Important:</strong> Your API Key can be found at Dashboard → Get Chatbot Key.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'custom-ui' && (
                <div>
                  <h1 className="text-3xl font-bold text-white mb-6">Custom UI Integration</h1>
                  <p className="text-gray-300 mb-6">
                    With our API, you have complete freedom to build your own custom chatbot UI that matches your brand perfectly.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-4">Benefits</h3>
                  <ul className="space-y-2 text-gray-300 mb-6">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Complete design control
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Custom branding and styling
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Advanced conversation flows
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Integration with existing systems
                    </li>
                  </ul>
                  
                  <p className="text-gray-300">
                    Use the API endpoint provided in your dashboard to send questions and receive intelligent responses based on your trained documents.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}