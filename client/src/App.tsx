import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Docs from './components/Docs';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './components/Dashboard/Dashboard';
import GenerateBot from './components/Dashboard/GenerateBot';
import BotDetails from './components/Dashboard/BotDetails';
import Billing from './components/Dashboard/Billing';
import Settings from './components/Dashboard/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import type { Bot } from './types/';
import { dummyUser } from './utils/dummyData';

function App() {
  const authUser = useSelector((state: any) => state.user.authUserDetails);
  const isAuthenticated = !!authUser;

  const handleSignIn = (email: string, password: string) => {
    // This is now handled in the SignIn component
  };

  const handleSignUp = (name: string, email: string, password: string) => {
    // This is now handled in the SignUp component
  };

  const handleSignOut = () => {
    // This will be handled by Redux
  };

  const handleCreateBot = (name: string, file?: File, link?: string) => {
    if (!authUser) return;

    const newBot: Bot = {
      id: `bot-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      userId: authUser.id
    };

    // This would need to be handled by Redux or API call
    console.log('Bot created:', newBot);
  };

  const handleDeleteBot = (botId: string) => {
    if (!authUser) return;

    // This would need to be handled by Redux or API call
    console.log('Bot deleted:', botId);
  };

  const handleUpdatePassword = (currentPassword: string, newPassword: string) => {
    // Simulate password update
    console.log('Password updated');
  };

  const handleDeleteAccount = () => {
    // This would need to be handled by Redux
    console.log('Account deleted');
  };

  return (
    <Router>
      <div className="min-h-screen font-inter">
        <Navbar />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/docs" element={<Docs />} />
          <Route 
            path="/signin" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <SignIn onSignIn={handleSignIn} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <SignUp onSignUp={handleSignUp} />
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/generate" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <GenerateBot />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/bot/:botId" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <BotDetails />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/billing" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Billing />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/settings" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;