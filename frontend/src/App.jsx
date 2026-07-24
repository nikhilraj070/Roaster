import React from 'react'
import {BrowserRouter, Navigate, Route, Routes  } from "react-router-dom";
import RegisterForm from './components/RegisterForm';
import LoginPage from './components/LoginPage';
import RoastPage from './components/RoastPage';
import FavoritesPage from './components/FavoritesPage';
import { useAuth } from './context/authContext';

function AuthLoading() {
  return (
    <div>
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
