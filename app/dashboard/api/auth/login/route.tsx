import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Validation des champs
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email et mot de passe requis' },
                { status: 400 }
            );
        }

        // Ici, vous feriez la vérification dans votre base de données
        // Exemple temporaire - À remplacer par votre logique DB
        if (email === 'user@example.com' && password === 'password123') {
            // Créer un token (JWT ou session)
            const token = 'fake-jwt-token-' + Date.now();

            // Stocker le token dans les cookies
            (await cookies()).set('auth-token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 heures
                path: '/',
            });

            return NextResponse.json({
                success: true,
                user: {
                    id: 1,
                    email: email,
                    name: 'Utilisateur Test'
                }
            });
        }

        return NextResponse.json(
            { message: 'Email ou mot de passe incorrect' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Erreur login:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
