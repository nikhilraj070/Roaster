import React from 'react'
import {BrowserRouter, Navigate, Route, Routes  } from "react-router-dom";
import RegisterForm from './components/RegisterForm';
import LoginPage from './components/LoginPage';
import RoastPage from './components/RoastPage';
import FavoritesPage from './components/FavoritesPage';
import { useAuth } from './context/authContext';

function AuthLoading() {
  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-80 h-80 rounded-full bg-orange-500/10 blur-3xl animate-pulse" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-orange-500/30">
          <span className="text-4xl">🔥</span>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-3xl font-bold text-white tracking-wide">
          Roaster
        </h1>

        {/* Spinner */}
        <Loader2 className="w-10 h-10 mt-8 text-orange-400 animate-spin" />

        {/* Status */}
        <p className="mt-5 text-gray-400 text-sm tracking-wide animate-pulse">
          Checking your session...
        </p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, checkingAuth } = useAuth();

  if (checkingAuth) {
    return <AuthLoading />;
  }

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const { user, checkingAuth } = useAuth();

  if (checkingAuth) {
    return <AuthLoading />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
      <BrowserRouter>
           <Routes>
              <Route path='/register' element={<GuestRoute><RegisterForm /></GuestRoute>} />
              <Route path='/login' element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path='/' element={<ProtectedRoute><RoastPage /></ProtectedRoute>} />
              <Route path='/favorites' element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
              <Route path='*' element={<Navigate to="/register" replace />} />

           </Routes>
      </BrowserRouter>
  )
}   

export default App
