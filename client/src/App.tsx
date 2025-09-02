
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
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



function App() {
  const authUser = useSelector((state: any) => state.user.authUserDetails);
  const isAuthenticated = !!authUser;

  const handleSignIn = (email: string, password: string) => {
    // This is now handled in the SignIn component
  };

  const handleSignUp = (name: string, email: string, password: string) => {
    // This is now handled in the SignUp component
  };

  return (
    <Router>
      <div className="min-h-screen font-inter">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              style: {
                background: '#065f46',
                border: '1px solid #10b981',
              },
            },
            error: {
              style: {
                background: '#7f1d1d',
                border: '1px solid #ef4444',
              },
            },
          }}
        />
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