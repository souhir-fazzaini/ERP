'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { produitService } from '@/app/services/produitService';

export default function AjouterProduit() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        prix: '',
        stock: '',
        categorie: 'Informatique'
    });

    // Liste des catégories disponibles
    const categories = [
        'Informatique',
        'Accessoires',
        'Réseau',
        'Téléphonie',
        'Audio',
        'Video',
        'Périphériques',
        'Logiciels',
        'Autre'
    ];

    // Gérer les changements dans les champs du formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Valider et soumettre le formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validations
        if (!formData.nom.trim()) {
            setError('Le nom du produit est requis');
            setLoading(false);
            return;
        }

        const prix = parseFloat(formData.prix);
        if (isNaN(prix) || prix <= 0) {
            setError('Le prix doit être un nombre supérieur à 0');
            setLoading(false);
            return;
        }

        const stock = parseInt(formData.stock);
        if (isNaN(stock) || stock < 0) {
            setError('Le stock doit être un nombre positif ou zéro');
            setLoading(false);
            return;
        }

        try {
            await produitService.create({
                nom: formData.nom,
                description: formData.description,
                prix: prix,
                stock: stock,
                categorie: formData.categorie
            });
            router.push('/dashboard/produits');
        } catch (err) {
            setError('Erreur lors de la création du produit');
        } finally {
            setLoading(false);
        }
    };

    // Formater le prix pour l'affichage
    const formatPrix = (prix: string) => {
        const p = parseFloat(prix);
        if (isNaN(p)) return '0,00 €';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(p);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* En-tête avec bouton retour */}
            <div className="mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/produits">
                        <button className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
                            <span className="text-xl">←</span> Retour
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Nouveau produit</h1>
                        <p className="text-gray-600 mt-1">Ajoutez un produit à votre catalogue</p>
                    </div>
                </div>
            </div>

            {/* Formulaire d'ajout */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Message d'erreur */}
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nom du produit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom du produit <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nom"
                            required
                            value={formData.nom}
                            onChange={handleChange}
                            placeholder="Ex: Ordinateur Portable Pro"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description détaillée du produit..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Prix et Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prix (€) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="prix"
                                    required
                                    step="0.01"
                                    min="0"
                                    value={formData.prix}
                                    onChange={handleChange}
                                    placeholder="99.99"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <span className="absolute right-3 top-2.5 text-gray-400">€</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="stock"
                                required
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    {/* Catégorie */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Catégorie <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="categorie"
                            value={formData.categorie}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="bg-gray-50 rounded-lg p-4 mt-2">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Informations</h3>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>✓ Le prix doit être supérieur à 0 €</li>
                            <li>✓ Le stock ne peut pas être négatif</li>
                            <li>✓ La description peut être laissée vide</li>
                        </ul>
                    </div>

                    {/* Aperçu du produit */}
                    {(formData.nom || formData.prix || formData.stock) && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-2">
                            <h3 className="text-sm font-semibold text-green-800 mb-2">📦 Aperçu du produit</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Nom :</span>
                                    <span className="font-medium text-gray-800">{formData.nom || 'Non renseigné'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Prix :</span>
                                    <span className="font-bold text-green-600">{formatPrix(formData.prix)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Stock :</span>
                                    <span className={`font-medium ${parseInt(formData.stock) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formData.stock || 0} unités
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Catégorie :</span>
                                    <span className="text-gray-800">{formData.categorie}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Création en cours...
                                </span>
                            ) : (
                                'Créer le produit'
                            )}
                        </button>
                        <Link href="/dashboard/produits" className="flex-1">
                            <button
                                type="button"
                                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
