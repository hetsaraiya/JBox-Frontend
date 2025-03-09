import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { FolderView } from './pages/FolderView';
import { FileView } from './pages/FileView';
import { ThemeToggle } from './components/ThemeToggle';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const { token, fetchCurrentUser } = useAuthStore();

  // Try to fetch user data on app start if token exists
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token, fetchCurrentUser]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <ThemeToggle />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/folder" 
            element={
              <ProtectedRoute>
                <FolderView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/file" 
            element={
              <ProtectedRoute>
                <FileView />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}