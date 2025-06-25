
import axios from 'axios';

// Configuration globale d'axios pour gérer les erreurs d'authentification
export const setupAuthInterceptor = (logout) => {
    // Intercepteur pour les réponses
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            // Vérifier si l'erreur est liée à l'authentification
            if (error.response?.status === 401) {
                // Token expiré ou invalide
                console.warn('Token expiré ou invalide, déconnexion automatique');
                logout();

                // Rediriger vers la page de login
                window.location.href = '/login';
            }

            return Promise.reject(error);
        }
    );

    // Intercepteur pour les requêtes (ajouter automatiquement le token)
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

// Fonction utilitaire pour vérifier si l'utilisateur est authentifié
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    return !!(token && user);
};

// Fonction utilitaire pour obtenir l'utilisateur actuel
export const getCurrentUser = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return null;
    }
};

// Fonction utilitaire pour vérifier les permissions
export const hasRole = (requiredRole) => {
    const user = getCurrentUser();
    if (!user) return false;

    if (Array.isArray(requiredRole)) {
        return requiredRole.includes(user.role);
    }

    return user.role === requiredRole;
};

// Fonction utilitaire pour vérifier si l'utilisateur est admin
export const isAdmin = () => {
    return hasRole('admin');
};

// Fonction utilitaire pour vérifier si l'utilisateur est consultant
export const isConsultant = () => {
    return hasRole('consultant');
};

// Hook personnalisé pour la navigation protégée
export const useAuthNavigation = () => {
    const navigate = (path, options = {}) => {
        if (!isAuthenticated()) {
            window.location.href = '/login';
            return;
        }

        // Si react-router-dom est disponible
        if (window.history && window.history.pushState) {
            window.history.pushState(null, '', path);
        } else {
            window.location.href = path;
        }
    };

    return { navigate };
};

// Fonction pour nettoyer les données d'authentification
export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
};