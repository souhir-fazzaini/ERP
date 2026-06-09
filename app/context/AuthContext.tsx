'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { User, LoginCredentials, RegisterData } from '@/app/services/userService';

// Définition précise du type du contexte
interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<any>;
    register: (userData: RegisterData) => Promise<any>;
    logout: () => void;
    isAuthenticated: boolean;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuth();

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personnalisé pour utiliser le contexte
export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }

    return context;
}
