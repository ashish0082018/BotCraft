import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Apple as Api, Bot, Zap, FileText, Globe, Check } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Build your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AI Bot
            </span>
            <br />in Minutes
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Upload your website docs or PDFs, and instantly get a chatbot API for your customers.
            Transform your documents into intelligent conversational experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border-2 border-blue-500 text-blue-400 font-semibold rounded-lg hover:bg-blue-500/10 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Powerful Features for Modern Businesses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all group hover:shadow-lg hover:shadow-blue-500/10">
              <Upload className="h-12 w-12 text-blue-400 mb-4 group-hover:text-blue-300 transition-colors" />
              <h3 className="text-xl font-semibold text-white mb-2">Upload & Train</h3>
              <p className="text-gray-400">
                Upload PDFs or provide document links to train your bot instantly with your content.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all group hover:shadow-lg hover:shadow-blue-500/10">
              <Api className="h-12 w-12 text-blue-400 mb-4 group-hover:text-blue-300 transition-colors" />
              <h3 className="text-xl font-semibold text-white mb-2">API Endpoint</h3>
              <p className="text-gray-400">
                Get a ready-to-use API endpoint to integrate directly with your applications.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all group hover:shadow-lg hover:shadow-blue-500/10">
              <Bot className="h-12 w-12 text-blue-400 mb-4 group-hover:text-blue-300 transition-colors" />
              <h3 className="text-xl font-semibold text-white mb-2">Multi-Bot Support</h3>
              <p className="text-gray-400">
                Create and manage multiple specialized bots for different use cases.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all group hover:shadow-lg hover:shadow-blue-500/10">
              <Zap className="h-12 w-12 text-blue-400 mb-4 group-hover:text-blue-300 transition-colors" />
              <h3 className="text-xl font-semibold text-white mb-2">Free & Pro Plans</h3>
              <p className="text-gray-400">
                Start free with essential features, upgrade anytime for advanced capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all">
              <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
              <p className="text-gray-400 mb-6">Perfect for getting started</p>
              <div className="text-4xl font-bold text-white mb-6">$0<span className="text-lg font-normal text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  Up to 2 Bots
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  1,000 API requests
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  Basic support
                </li>
              </ul>
              <Link
                to="/signup"
                className="w-full px-6 py-3 border-2 border-blue-500 text-blue-400 font-semibold rounded-lg hover:bg-blue-500/10 transition-all text-center block"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border-2 border-blue-500/40 hover:border-blue-400/60 transition-all relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
              <p className="text-gray-400 mb-6">For growing businesses</p>
              <div className="text-4xl font-bold text-white mb-6">$29<span className="text-lg font-normal text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  Up to 10 Bots
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  15,000 API requests
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  Priority support
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  Advanced analytics
                </li>
              </ul>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-blue-500/25 transform hover:scale-105">
                Upgrade with Razorpay
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}