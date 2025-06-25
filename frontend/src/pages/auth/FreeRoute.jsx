import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Loader2 } from "lucide-react";

const FreeRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation()

    if (isAuthenticated) {
        return <Navigate to={'/'} state={{ from: location }} replace />
    }

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


    return children

}

export default FreeRoute