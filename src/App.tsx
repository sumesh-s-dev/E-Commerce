import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/orders" element={<div className="p-4">Orders Page</div>} />
              <Route path="/reports" element={<div className="p-4">Reports Page</div>} />
              <Route path="/users" element={<div className="p-4">Users Page</div>} />
              <Route path="/settings" element={<div className="p-4">Settings Page</div>} />
            </Route>
          </Route>
          
          {/* Redirect root to dashboard or login */}
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
          
          {/* Catch all for non-existent routes */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <h1 className="text-4xl font-bold text-gray-800">404</h1>
                <p className="text-gray-600 mt-2">Page not found</p>
                <a 
                  href="/dashboard" 
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Go back to dashboard
                </a>
              </div>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;