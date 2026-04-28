import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = sessionStorage.getItem('authToken');
  const currentUser = sessionStorage.getItem('currentUser');
  
  if (!token || !currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
