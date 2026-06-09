// app/dashboard/clients/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clientService } from '@/app/services/clientService';
import { Client } from '@/app/types/erp.types';

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            setLoading(true);
            const data = await clientService.getAll();
            setClients(data);
            setError('');
        } catch (err) {
            setError('Erreur lors du chargement des clients');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        if (term.trim()) {
            const results = await clientService.search(term);
            setClients(results);
        } else {
            await loadClients();
        }
    };

    const handleDelete = async () => {
        if (selectedClient) {
            try {
                await clientService.delete(selectedClient.id);
                await loadClients();
                setShowDeleteModal(false);
                setSelectedClient(null);
            } catch (err) {
                setError('Erreur lors de la suppression');
            }
        }
    };

    const openDeleteModal = (client: Client) => {
        setSelectedClient(client);
        setShowDeleteModal(true);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRandomColor = (id: number) => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
            'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
            'bg-red-500', 'bg-teal-500', 'bg-orange-500'
        ];
        return colors[id % colors.length];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des clients...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* En-tête */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
                        <p className="text-gray-600 mt-1">
                            Gérez votre liste de clients ({clients.length} clients)
                        </p>
                    </div>
                    <Link href="/dashboard/clients/ajouter">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <span className="text-xl">+</span>
                            Nouveau client
                        </button>
                    </Link>
                </div>
            </div>

            {/* Messages d'erreur */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Barre de recherche */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email ou ville..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    {searchTerm && (
                        <button
                            onClick={() => handleSearch('')}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Grille des clients */}
            {clients.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Aucun client trouvé
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm ? 'Aucun client ne correspond à votre recherche' : 'Commencez par ajouter votre premier client'}
                    </p>
                    {!searchTerm && (
                        <Link href="/dashboard/clients/ajouter">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                + Ajouter un client
                            </button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client) => (
                        <div
                            key={client.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="p-6">
                                {/* Avatar et infos principales */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getRandomColor(client.id)}`}>
                                            {getInitials(client.nom)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-lg">
                                                {client.nom}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {client.ville || 'Ville non renseignée'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        <Link href={`/dashboard/clients/${client.id}`}>
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                ✏️
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => openDeleteModal(client)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {/* Informations de contact */}
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="w-8">📧</span>
                                        <span className="truncate">{client.email}</span>
                                    </div>
                                    {client.telephone && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="w-8">📞</span>
                                            <span>{client.telephone}</span>
                                        </div>
                                    )}
                                    {client.adresse && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="w-8">📍</span>
                                            <span className="truncate">
                                                {client.adresse}, {client.codePostal} {client.ville}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Date d'ajout */}
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-400">
                                        Ajouté le {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de confirmation de suppression */}
            {showDeleteModal && selectedClient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">⚠️</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                                Confirmer la suppression
                            </h3>
                            <p className="text-gray-600 text-center mb-6">
                                Êtes-vous sûr de vouloir supprimer le client <br />
                                <span className="font-semibold">{selectedClient.nom}</span> ?
                                <br />
                                Cette action est irréversible.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
