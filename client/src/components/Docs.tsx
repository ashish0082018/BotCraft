import React, { useState } from 'react';
import { Check, Copy, MessageCircle, Send, Menu, X, Code, Terminal } from 'lucide-react';

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Docs() {
  const [activeTab, setActiveTab] = useState('sdk');
  const [demoMessage, setDemoMessage] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  const sidebarItems = [
    {
      title: 'Integrate with SDK',
      items: [
        { id: 'sdk', label: 'React Integration' },
        { id: 'ui-demo', label: 'UI Demo' }
      ]
    },
    {
      title: 'Integrate with API',
      items: [
        { id: 'api', label: 'API Request' },
        { id: 'code-examples', label: 'Code Examples' }
      ]
    }
  ];

  const languageOptions = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'curl', label: 'cURL' },
    { id: 'react', label: 'React' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderCodeExample = () => {
    switch (selectedLanguage) {
      case 'javascript':
        return `// Using fetch API
async function askBot(question) {
  const response = await fetch('${API_BASE_URL}/api/v/bot', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question })
  });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  return response.json();
}

// Example usage
askBot('How do I use this?')
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;
      
      case 'python':
        return `import requests

def ask_bot(question):
    url = "${API_BASE_URL}/api/v/bot"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    payload = {
        "question": question
    }
    
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()

# Example usage
response = ask_bot("How do I use this?")
print(response)`;
      
      case 'curl':
        return `curl -X POST ${API_BASE_URL}/api/v/bot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "How do I use this?"
  }'`;
      
      case 'react':
        return `import React, { useState } from 'react';

function BotIntegration() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch('${API_BASE_URL}/api/v/bot', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
      });
      
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={askQuestion} disabled={loading}>
        {loading ? 'Asking...' : 'Ask'}
      </button>
      {response && <div>{JSON.stringify(response)}</div>}
    </div>
  );
}

export default BotIntegration;`;
      
      default:
        return '';
    }
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
              {/* SDK Integration */}
              {activeTab === 'sdk' && (
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">React SDK Integration</h1>
                  <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                    Easily integrate the BotCraft chatbot into your React application with our component.
                  </p>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">React Component</h3>
                  <div className="bg-gray-900/80 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 relative group">
                    <code className="text-green-400 text-xs sm:text-sm whitespace-pre">
{`import React, { useEffect } from 'react';

const BotcraftWidget = ({ apiKey }) => {
  useEffect(() => {
    if (document.getElementById('botcraft-widget-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'botcraft-widget-script';
    script.src = '${API_BASE_URL}/api/v2/bot/widget.js';
    script.setAttribute('data-api-key', apiKey);
    script.defer = true;
    
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById('botcraft-widget-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      
      const icon = document.getElementById('botcraft-chat-icon');
      const widget = document.getElementById('botcraft-widget-container');
      if (icon) icon.remove();
      if (widget) widget.remove();
    };
  }, [apiKey]);

  return null;
};

export default BotcraftWidget;`}
                    </code>
                    <button
                      onClick={() => copyToClipboard(`import React, { useEffect } from 'react';\n\nconst BotcraftWidget = ({ apiKey }) => {\n  useEffect(() => {\n    if (document.getElementById('botcraft-widget-script')) {\n      return;\n    }\n\n    const script = document.createElement('script');\n    script.id = 'botcraft-widget-script';\n    script.src = '${API_BASE_URL}/api/v2/bot/widget.js';\n    script.setAttribute('data-api-key', apiKey);\n    script.defer = true;\n    \n    document.body.appendChild(script);\n\n    return () => {\n      const existingScript = document.getElementById('botcraft-widget-script');\n      if (existingScript) {\n        document.body.removeChild(existingScript);\n      }\n      \n      const icon = document.getElementById('botcraft-chat-icon');\n      const widget = document.getElementById('botcraft-widget-container');\n      if (icon) icon.remove();\n      if (widget) widget.remove();\n    };\n  }, [apiKey]);\n\n  return null;\n};\n\nexport default BotcraftWidget;`)}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Usage in Your App</h3>
                  <div className="bg-gray-900/80 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 relative group">
                    <code className="text-green-400 text-xs sm:text-sm whitespace-pre">
{`import React from 'react';
import BotcraftWidget from './components/BotcraftWidget';

function App() {
  return (
    <div className="App">
      {/* Your app content */}
      <BotcraftWidget apiKey="sa-3f7011c6-f958-4d0b-aafd-1d9e23359683" />
    </div>
  );
}

export default App;`}
                    </code>
                    <button
                      onClick={() => copyToClipboard(`import React from 'react';\nimport BotcraftWidget from './components/BotcraftWidget';\n\nfunction App() {\n  return (\n    <div className="App">\n      {/* Your app content */}\n      <BotcraftWidget apiKey="sa-3f7011c6-f958-4d0b-aafd-1d9e23359683" />\n    </div>\n  );\n}\n\nexport default App;`)}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
                    <p className="text-blue-300 text-xs sm:text-sm">
                      <strong>Note:</strong> Replace the API key with your actual bot's API key from your dashboard. The widget will automatically appear as a chat icon in your application.
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
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">API Integration</h1>
                  <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                    Use our REST API to build your own custom chatbot interface.
                  </p>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">API Request</h3>
                  <div className="bg-gray-900/80 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 relative group">
                    <code className="text-green-400 text-xs sm:text-sm whitespace-pre">
{`POST ${API_BASE_URL}/api/v/bot
Headers: { 
  "Authorization": "Bearer <API_KEY>",
  "Content-Type": "application/json"
}
Body: { 
  "question": "Your question here" 
}`}
                    </code>
                    <button
                      onClick={() => copyToClipboard('POST ${API_BASE_URL}/api/v/bot\nHeaders: { "Authorization": "Bearer <API_KEY>", "Content-Type": "application/json" }\nBody: { "question": "Your question here" }')}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 sm:p-4">
                    <p className="text-yellow-300 text-xs sm:text-sm">
                      <strong>Important:</strong> Your API Key can be found at Dashboard → Get Chatbot Key.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'code-examples' && (
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">API Code Examples</h1>
                  <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                    Use our API directly in your client-side code with these examples.
                  </p>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Language Examples</h3>
                  
                  {/* Language Selector */}
                  <div className="flex space-x-2 mb-4 overflow-x-auto py-2">
                    {languageOptions.map((language) => (
                      <button
                        key={language.id}
                        onClick={() => setSelectedLanguage(language.id)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          selectedLanguage === language.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {language.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-gray-900/80 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 relative group">
                    <code className="text-green-400 text-xs sm:text-sm whitespace-pre">
                      {renderCodeExample()}
                    </code>
                    <button
                      onClick={() => copyToClipboard(renderCodeExample())}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
                    <p className="text-blue-300 text-xs sm:text-sm">
                      <strong>Note:</strong> Replace YOUR_API_KEY with your actual API key. For client-side implementations, consider using environment variables to keep your API key secure.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}