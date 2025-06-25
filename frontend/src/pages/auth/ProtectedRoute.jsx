import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, roles = null }) => {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();

    // Afficher un loader pendant la vérification
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Vérification de l'authentification...</p>
                </div>
            </div>
        );
    }

    // Rediriger vers login si non authentifié
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Vérifier les rôles si spécifiés
    if (roles && user) {
        const userHasRequiredRole = Array.isArray(roles)
            ? roles.includes(user.role)
            : roles === user.role;

        if (!userHasRequiredRole) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center max-w-md mx-auto p-6">
                        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès refusé</h2>
                        <p className="text-gray-600 mb-4">
                            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                        </p>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Retour
                        </button>
                    </div>
                </div>
            );
        }
    }

    return children;
};

export default ProtectedRoute;