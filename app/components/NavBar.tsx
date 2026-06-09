'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {useAuthContext} from "@/app/context/AuthContext";

export default function NavBar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthContext();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = async () => {
        logout();
        router.push('/');
        setIsUserMenuOpen(false);
    };

    const navLinks = [
        { href: '/', label: 'Accueil', icon: '🏠' },
        { href: '/dashboard', label: 'Dashboard', icon: '📊', protected: true },
        { href: '/dashboard/profile', label: 'Profil', icon: '👤', protected: true },
        { href: '/dashboard/settings', label: 'Paramètres', icon: '⚙️', protected: true },
    ];

    // Filtrer les liens selon l'authentification
    const visibleLinks = navLinks.filter(link => {
        if (link.protected && !isAuthenticated) return false;
        return true;
    });

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">

                    {/* Logo et marque */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-2xl">🚀</span>
                            <span className="font-bold text-xl text-gray-800 hidden sm:inline-block">
                MonApp
              </span>
                        </Link>

                        {/* Navigation desktop - liens principaux */}
                        <div className="hidden md:flex ml-10 space-x-4">
                            {visibleLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            isActive
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        <span className="mr-2">{link.icon}</span>
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section droite - Auth/User Menu */}
                    <div className="flex items-center space-x-3">
                        {isAuthenticated ? (
                            // Menu utilisateur connecté
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                    {user?.name || user?.email?.split('@')[0] || 'Utilisateur'}
                  </span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${
                                            isUserMenuOpen ? 'transform rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {/* Menu déroulant */}
                                {isUserMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {user?.name || 'Utilisateur'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user?.email}
                                                </p>
                                            </div>

                                            <Link
                                                href="/dashboard/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <span className="mr-2">👤</span>
                                                Mon profil
                                            </Link>

                                            <Link
                                                href="/dashboard/settings"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <span className="mr-2">⚙️</span>
                                                Paramètres
                                            </Link>

                                            <hr className="my-1" />

                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <span className="mr-2">🚪</span>
                                                Se déconnecter
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            // Boutons pour utilisateur non connecté
                            <div className="flex items-center space-x-2">
                                <Link
                                    href="/dashboard/auth/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href="/dashboard/auth/register"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Inscription
                                </Link>
                            </div>
                        )}

                        {/* Bouton menu mobile */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Menu mobile */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-2 border-t border-gray-200">
                        {visibleLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        isActive
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="mr-2">{link.icon}</span>
                                    {link.label}
                                </Link>
                            );
                        })}

                        {!isAuthenticated && (
                            <div className="pt-4 mt-2 border-t border-gray-200">
                                <Link
                                    href="/dashboard/auth/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    🔑 Connexion
                                </Link>
                                <Link
                                    href="/dashboard/auth/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                                >
                                    📝 Inscription
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
