// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clientService } from '@/app/services/clientService';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        clients: { total: 0, nouveaux: 0 },
        loading: true
    });
    const loadStats = async () => {
        const clientsStats = await clientService.getStats();

        setStats({
            clients: clientsStats,
            loading: false
        });
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect

        loadStats();
    }, []);



    const cards = [
        {
            titre: 'Clients',
            valeur: stats.clients.total,
            sousTitre: `${stats.clients.nouveaux} nouveaux`,
            icone: '👥',
            couleur: 'bg-blue-500',
            lien: '/dashboard/clients'
        },
        {
            titre: 'Factures',
            valeur: '0',
            sousTitre: 'Ce mois',
            icone: '🧾',
            couleur: 'bg-purple-500',
            lien: '/dashboard/factures'
        }
    ];

    if (stats.loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
                <p className="text-gray-600">Bienvenue dans votre système de gestion clients</p>
            </div>

            {/* Cartes statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {cards.map((card, index) => (
                    <Link href={card.lien} key={index}>
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">{card.titre}</p>
                                    <p className="text-2xl font-bold mt-2">{card.valeur}</p>
                                    <p className="text-xs text-gray-400 mt-1">{card.sousTitre}</p>
                                </div>
                                <div className={`${card.couleur} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl`}>
                                    {card.icone}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/dashboard/clients/ajouter">
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                            ➕ Nouveau client
                        </button>
                    </Link>
                    <Link href="/dashboard/factures/nouvelle">
                        <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
                            🧾 Nouvelle facture
                        </button>
                    </Link>
                </div>
            </div>

            {/* Derniers clients */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Derniers clients</h2>
                    <Link href="/dashboard/clients" className="text-blue-600 hover:text-blue-800">
                        Voir tout →
                    </Link>
                </div>
                <div className="space-y-3">
                    <p className="text-gray-500 text-center py-4">Chargement des clients...</p>
                </div>
            </div>
        </div>
    );
}
