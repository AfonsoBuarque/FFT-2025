import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Features } from './components/Features';
import { ChatDemo } from './components/ChatDemo';
import { OtherProjects } from './components/OtherProjects';
import { CTA } from './components/CTA';
import { TypebotChat } from './components/TypebotChat';
import { WaveBackground } from './components/WaveBackground';
import { ToastContainer } from './components/ui/ToastContainer';
import { ProfileCompletion } from './pages/ProfileCompletion';
import { ProfileUpdate } from './pages/ProfileUpdate';
import { Dashboard } from './pages/Dashboard';
import { useAuthContext } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  
  if (loading) return null;
  
  return user ? <>{children}</> : <Navigate to="/" />;
}

function LandingPage() {
  return (
    <>
      <Header />
      <Features />
      <ChatDemo />
      <OtherProjects />
      <CTA />
      <TypebotChat />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#D3D3D3] relative overflow-hidden">
        <WaveBackground />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile/complete" 
              element={
                <PrivateRoute>
                  <ProfileCompletion />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile/update" 
              element={
                <PrivateRoute>
                  <ProfileUpdate />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}