import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupForm } from '../components/SignupForm';
import { useAuthStore } from '../store/useAuthStore';

export const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Redirect to home page if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignupForm />
    </div>
  );
};