import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bot, ChevronDown, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import axios from 'axios';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.authUserDetails);
  const isAuthenticated = !!user;
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/api/v1/user/signout', {
        withCredentials: true,
      });
      
      // Clear Redux store
      dispatch(logout());
      
      // Navigate to home page
      navigate('/');
      
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear the store even if API call fails
      dispatch(logout());
      navigate('/');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Bot className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
            <span className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
              BotCraft
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/docs"
              className={`text-sm font-medium transition-colors hover:text-blue-300 ${
                isActive('/docs') ? 'text-blue-400' : 'text-gray-300'
              }`}
            >
              Docs
            </Link>
            
            {!isAuthenticated ? (
              <>
                <a href="#features" className="text-sm font-medium text-gray-300 hover:text-blue-300 transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-sm font-medium text-gray-300 hover:text-blue-300 transition-colors">
                  Pricing
                </a>
                <Link
                  to="/signin"
                  className="text-sm font-medium text-gray-300 hover:text-blue-300 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
               
                <a href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-blue-300 transition-colors">
                 Dashboard
                </a>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-blue-300 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">{user?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md rounded-lg border border-blue-500/20 shadow-lg">
                      <Link
                        to="/dashboard/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          handleLogout();
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-300 hover:text-blue-300 transition-colors"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-blue-500/20">
            <div className="px-4 py-4 space-y-4">
              <Link
                to="/docs"
                className={`block text-sm font-medium transition-colors hover:text-blue-300 ${
                  isActive('/docs') ? 'text-blue-400' : 'text-gray-300'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Docs
              </Link>
              
              {!isAuthenticated ? (
                <>
                  <a href="#features" className="block text-sm font-medium text-gray-300 hover:text-blue-300 transition-colors" onClick={() => setShowMobileMenu(false)}>
                    Features
                  </a>
                  <a href="#pricing" className="block text-sm font-medium text-gray-300 hover:text-blue-300 transition-colors" onClick={() => setShowMobileMenu(false)}>
                    Pricing
                  </a>
                  <Link
                    to="/signin"
                    className="block text-sm font-medium text-gray-300 hover:text-blue-300 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg hover:shadow-blue-500/25 text-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <a href="#features" className="block text-sm font-medium text-gray-300 hover:text-blue-300 transition-colors" onClick={() => setShowMobileMenu(false)}>
                    Features
                  </a>
                  <a href="#pricing" className="block text-sm font-medium text-gray-300 hover:text-blue-300 transition-colors" onClick={() => setShowMobileMenu(false)}>
                    Pricing
                  </a>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex items-center space-x-2 text-gray-300 mb-4">
                      <User className="h-5 w-5" />
                      <span className="text-sm font-medium">{user?.name}</span>
                    </div>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-blue-300 hover:bg-blue-500/10 transition-colors rounded-lg"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        handleLogout();
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-lg"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}