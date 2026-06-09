// app/dashboard/produits/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { produitService } from '@/app/services/produitService';
import { Produit } from '@/app/types/erp.types';

export default function ProduitsPage() {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [filterCategorie, setFilterCategorie] = useState('');

    useEffect(() => {
        loadProduits();
    }, []);

    const loadProduits = async () => {
        try {
            setLoading(true);
            const data = await produitService.getAll();
            setProduits(data);
            setError('');
        } catch (err) {
            setError('Erreur lors du chargement des produits');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        if (term.trim()) {
            const results = await produitService.search(term);
            setProduits(results);
        } else {
            await loadProduits();
        }
    };

    const handleDelete = async () => {
        if (selectedProduit) {
            try {
                await produitService.delete(selectedProduit.id);
                await loadProduits();
                setShowDeleteModal(false);
                setSelectedProduit(null);
            } catch (err) {
                setError('Erreur lors de la suppression');
            }
        }
    };

    const openDeleteModal = (produit: Produit) => {
        setSelectedProduit(produit);
        setShowDeleteModal(true);
    };

    const getCategories = () => {
        const categories = [...new Set(produits.map(p => p.categorie))];
        return ['Toutes', ...categories];
    };

    const getFilteredProduits = () => {
        let filtered = produits;
        if (filterCategorie && filterCategorie !== 'Toutes') {
            filtered = filtered.filter(p => p.categorie === filterCategorie);
        }
        return filtered;
    };

    const getStockColor = (stock: number) => {
        if (stock <= 0) return 'text-red-600 bg-red-100';
        if (stock < 10) return 'text-orange-600 bg-orange-100';
        if (stock < 30) return 'text-yellow-600 bg-yellow-100';
        return 'text-green-600 bg-green-100';
    };

    const getStockText = (stock: number) => {
        if (stock <= 0) return 'Rupture';
        if (stock < 10) return 'Stock faible';
        if (stock < 30) return 'Stock moyen';
        return 'Stock suffisant';
    };

    const formatPrix = (prix: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(prix);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des produits...</p>
                </div>
            </div>
        );
    }

    const filteredProduits = getFilteredProduits();
    const categories = getCategories();

    return (
        <div className="p-6">
            {/* En-tête */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Produits</h1>
                        <p className="text-gray-600 mt-1">
                            Gérez votre catalogue de produits ({produits.length} produits)
                        </p>
                    </div>
                    <Link href="/dashboard/produits/ajouter">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <span className="text-xl">+</span>
                            Nouveau produit
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

            {/* Barre de recherche et filtre */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

                <div className="relative">
                    <select
                        value={filterCategorie}
                        onChange={(e) => setFilterCategorie(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grille des produits */}
            {filteredProduits.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Aucun produit trouvé
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm || filterCategorie ? 'Aucun produit ne correspond à votre recherche' : 'Commencez par ajouter votre premier produit'}
                    </p>
                    {!searchTerm && !filterCategorie && (
                        <Link href="/dashboard/produits/ajouter">
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                + Ajouter un produit
                            </button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProduits.map((produit) => (
                        <div
                            key={produit.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                        >
                            {/* Bande de couleur par catégorie */}
                            <div className={`h-2 ${
                                produit.categorie === 'Informatique' ? 'bg-blue-500' :
                                    produit.categorie === 'Accessoires' ? 'bg-green-500' :
                                        produit.categorie === 'Réseau' ? 'bg-purple-500' :
                                            'bg-gray-500'
                            }`} />

                            <div className="p-6">
                                {/* En-tête produit */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl">
                                            📦
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-lg">
                                                {produit.nom}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {produit.categorie}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        <Link href={`/dashboard/produits/${produit.id}`}>
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                ✏️
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => openDeleteModal(produit)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                    {produit.description || 'Aucune description'}
                                </p>

                                {/* Prix et stock */}
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                                        <p className="text-xs text-gray-500">Prix</p>
                                        <p className="text-lg font-bold text-green-600">
                                            {formatPrix(produit.prix)}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                                        <p className="text-xs text-gray-500">Stock</p>
                                        <p className={`text-lg font-bold ${getStockColor(produit.stock)}`}>
                                            {produit.stock}
                                        </p>
                                    </div>
                                </div>

                                {/* Statut stock */}
                                <div className="mt-3">
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStockColor(produit.stock)}`}>
                                        {getStockText(produit.stock)}
                                    </span>
                                </div>

                                {/* Date d'ajout */}
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-400">
                                        Ajouté le {new Date(produit.createdAt).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de confirmation de suppression */}
            {showDeleteModal && selectedProduit && (
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
                                Êtes-vous sûr de vouloir supprimer le produit <br />
                                <span className="font-semibold">{selectedProduit.nom}</span> ?
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
