import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[] | null;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = null }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading text="Verifying authentication credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes((user as any).role))) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white border border-rose-200 rounded-2xl shadow-xs text-center">
        <h2 className="text-xl font-bold text-rose-700 mb-2">Access Restricted</h2>
        <p className="text-sm text-slate-600 mb-6">
          You do not have the required permissions ({allowedRoles.join(' or ')}) to view this page.
        </p>
        <Navigate to="/events" replace />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
