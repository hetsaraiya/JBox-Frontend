import { FC } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from './Button';

export const UserProfile: FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex items-center">
      <div className="mr-4 flex items-center">
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <UserIcon size={16} />
        </div>
        <span className="ml-2 font-medium text-gray-700 dark:text-gray-200">
          {user.username}
        </span>
      </div>
      <Button 
        variant="secondary" 
        onClick={handleLogout}
        className="flex items-center space-x-1 py-1"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </Button>
    </div>
  );
};