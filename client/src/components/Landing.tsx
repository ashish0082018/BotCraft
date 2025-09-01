import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Apple as Api, Bot, Zap, FileText, Globe, Check } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:pt-32 sm:pb-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Build your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AI Bot
            </span>
            <br />in Minutes
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Upload your website docs or PDFs, and instantly get a chatbot API for your customers.
            Transform your documents into intelligent conversational experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link
              to="/signup"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-500 text-blue-400 font-semibold rounded-lg hover:bg-blue-500/10 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12 sm:mb-16">
            Powerful Features for Modern Businesses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all group hover:shadow-lg hover:shadow-blue-500/10">
              <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400 mb-4 group-hover:text-blue-300 transition-colors" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Upload & Train</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Upload PDFs or provide document links to train your bot instantly with your content.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all group hover:shadow-lg hover:shadow-blue-500/10">
              <Api className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400 mb-4 group-hover:text-blue-300 transition-colors" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">API Endpoint</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Get a ready-to-use API endpoint to integrate directly with your applications.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all group hover:shadow-lg hover:shadow-blue-500/10">
              <Bot className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400 mb-4 group-hover:text-blue-300 transition-colors" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Multi-Bot Support</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Create and manage multiple specialized bots for different use cases.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all group hover:shadow-lg hover:shadow-blue-500/10">
              <Zap className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400 mb-4 group-hover:text-blue-300 transition-colors" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Free & Pro Plans</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Start free with essential features, upgrade anytime for advanced capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12 sm:mb-16">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Free Plan</h3>
              <p className="text-gray-400 mb-6">Perfect for getting started</p>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-6">₹0<span className="text-base sm:text-lg font-normal text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300 text-sm sm:text-base">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3 flex-shrink-0" />
                  Up to 2 Bots
                </li>
                <li className="flex items-center text-gray-300 text-sm sm:text-base">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3 flex-shrink-0" />
                  1,000 queries
                </li>
                <li className="flex items-center text-gray-300 text-sm sm:text-base">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3 flex-shrink-0" />
                  Basic customization
                </li>
                <li className="flex items-center text-gray-300 text-sm sm:text-base">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3 flex-shrink-0" />
                  Email support
                </li>
              </ul>
              <Link
                to="/signup"
                className="block w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all text-center"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Pro Plan</h3>
              <p className="text-gray-400 mb-6">For growing businesses</p>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-6">₹2,000<span className="text-base sm:text-lg font-normal text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300 text-sm sm:text-base">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3 flex-shrink-0" />
                  Up to 10 Bots
                </li>
                <li className="flex items-center text-gray-300 text-sm sm:text-base">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3 flex-shrink-0" />
                  15000 queries 
                </li>
                <li className="flex items-center text-gray-300 text-sm sm:text-base">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3 flex-shrink-0" />
                  Advanced customization
                </li>
                <li className="flex items-center text-gray-300 text-sm sm:text-base">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3 flex-shrink-0" />
                  Priority support
                </li>
                <li className="flex items-center text-gray-300 text-sm sm:text-base">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3 flex-shrink-0" />
                  Analytics dashboard
                </li>
              </ul>
              <Link
                to="/signup"
                className="block w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all text-center"
              >
                Start Pro Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">BotCraft</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base mb-4 max-w-md">
                Transform your documents into intelligent conversational experiences. 
                Build AI-powered chatbots in minutes with our advanced platform.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/ashish0082018" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-300 transition-colors"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-blue-300 transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-blue-300 transition-colors">Pricing</a></li>
                <li><Link to="/docs" className="text-gray-400 hover:text-blue-300 transition-colors">Documentation</Link></li>
                <li><Link to="/signin" className="text-gray-400 hover:text-blue-300 transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* Developer Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Developer Contact</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Developer:</span>
                  <span className="text-white">Ashish Verma</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">GitHub:</span>
                  <a 
                    href="https://github.com/ashish0082018" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    @ashish0082018
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">India 🇮🇳</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-8 border-t border-blue-500/20 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 BotCraft. Built with ❤️ by{' '}
              <a 
                href="https://github.com/ashish0082018" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Ashish Verma
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}