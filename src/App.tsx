import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import {  Routes, Route } from 'react-router-dom';
import { store } from './app/store/store';
import './styles/index.css';
import Loader from './components/loader';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ToastContainer from './components/ToastContainer';
// Lazy loaded pages
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const NotFoundPage = lazy(() => import('./pages/PageNotFound'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));

const App: React.FC = () => {
  return (      
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="reset-password" element={<ForgotPasswordPage />} />
              <Route path="oauth-callback" element={<OAuthCallback />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
              
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>

            
         
        
    
  );
};

export default App;
