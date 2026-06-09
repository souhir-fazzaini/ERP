'use client';

import Link from 'next/link';
import Button from "@/app/components/Button";
import {useAuthContext} from "@/app/context/AuthContext";

export default function Home() {
    const { isAuthenticated, user, logout } = useAuthContext();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Bienvenue sur notre application
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Une application moderne avec authentification
                    </p>

                    {isAuthenticated ? (
                        <div className="space-y-4">
                            <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
                                <p className="text-lg">
                                    Bonjour, <strong>{user?.name || user?.email}</strong> !
                                </p>
                                <Button
                                    onClick={logout}
                                    className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Se déconnecter
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link href="/dashboard/auth/login">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Se connecter
                                </Button>
                            </Link>
                            <Link href="/dashboard/auth/register">
                                <Button className="bg-green-600 hover:bg-green-700 text-white">
                                    Inscriber
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
