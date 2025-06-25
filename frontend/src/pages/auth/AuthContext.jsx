import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('Auth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Vérifier l'authentification au chargement
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Configurer axios avec le token
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const checkAuthStatus = async () => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                // Vérifier si le token est encore valide
                const apiUrl = import.meta.env.VITE_API_URL

                try {
                    // Optionnel : vérifier la validité du token avec l'API
                    const response = await axios.get(`${apiUrl}/verify-token`, {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    });

                    if (response.data.valid) {
                        setToken(storedToken);
                        setUser(response.data.user);
                        setIsAuthenticated(true);

                    } else {
                        // Token invalide, nettoyer le localStorage
                        logout();
                    }
                } catch (error) {
                    // Si l'endpoint de vérification n'existe pas, on fait confiance au localStorage
                    console.warn('Endpoint de vérification non disponible, utilisation du token local');
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'authentification:', error);
            logout();
        }

        setLoading(false);
    };

    const login = (userData, authToken) => {
        // Stocker les données dans le localStorage
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));

        // Mettre à jour l'état
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        // Nettoyer le localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Réinitialiser l'état
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);

        // Nettoyer les headers axios
        delete axios.defaults.headers.common['Authorization'];
    };

    const updateUser = (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};