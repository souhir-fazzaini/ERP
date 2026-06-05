import { useState, useEffect } from 'react';
import {LoginCredentials, RegisterData, User, userService} from "@/app/services/userService";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Vérifier si l'utilisateur est déjà connecté
        const currentUser = userService.getCurrentUser();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.login(credentials);
            setUser(response.user);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur de connexion');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: RegisterData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.register(userData);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur d'inscription");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        userService.logout();
        setUser(null);
    };

    return {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };
}
