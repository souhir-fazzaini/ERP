export interface User {
    id: number;
    email: string;
    name: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export const userService = {
    async login(credentials: LoginCredentials) {
        const response = await fetch('/dashboard/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur de connexion');
        }

        // Stocker l'utilisateur dans localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    async register(userData: RegisterData) {
        const response = await fetch('/dashboard/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur d\'inscription');
        }

        return data;
    },

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
        // Appeler l'API de déconnexion si nécessaire
        fetch('/dashboard/api/auth/logout', { method: 'POST' }).catch(console.error);
    },

    getCurrentUser(): User | null {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                return JSON.parse(userStr);
            }
        }
        return null;
    },
};
