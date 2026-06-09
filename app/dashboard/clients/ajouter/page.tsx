'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clientService } from '@/app/services/clientService';

export default function AjouterClient() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        telephone: '',
        adresse: '',
        ville: '',
        codePostal: '',
        pays: 'France'
    });

    // Gérer les changements dans les champs du formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            setError('Le nom est requis');
            setLoading(false);
            return;
        }

        if (!formData.email.trim()) {
            setError('L\'email est requis');
            setLoading(false);
            return;
        }

        if (!formData.email.includes('@') || !formData.email.includes('.')) {
            setError('Veuillez entrer un email valide');
            setLoading(false);
            return;
        }

        try {
            await clientService.create(formData);
            router.push('/dashboard/clients');
        } catch (err) {
            setError('Erreur lors de la création du client');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* En-tête avec bouton retour */}
            <div className="mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/clients">
                        <button className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
                            <span className="text-xl">←</span> Retour
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Nouveau client</h1>
                        <p className="text-gray-600 mt-1">Ajoutez un client à votre base de données</p>
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
                    {/* Ligne 1 : Nom et Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom complet <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nom"
                                required
                                value={formData.nom}
                                onChange={handleChange}
                                placeholder="Jean Dupont"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="contact@exemple.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Ligne 2 : Téléphone et Pays */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                placeholder="01 23 45 67 89"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pays
                            </label>
                            <select
                                name="pays"
                                value={formData.pays}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="France">France</option>
                                <option value="Belgique">Belgique</option>
                                <option value="Suisse">Suisse</option>
                                <option value="Canada">Canada</option>
                                <option value="Luxembourg">Luxembourg</option>
                            </select>
                        </div>
                    </div>

                    {/* Adresse */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse
                        </label>
                        <input
                            type="text"
                            name="adresse"
                            value={formData.adresse}
                            onChange={handleChange}
                            placeholder="15 rue de Paris"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Ligne 3 : Ville et Code Postal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ville
                            </label>
                            <input
                                type="text"
                                name="ville"
                                value={formData.ville}
                                onChange={handleChange}
                                placeholder="Paris"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Code postal
                            </label>
                            <input
                                type="text"
                                name="codePostal"
                                value={formData.codePostal}
                                onChange={handleChange}
                                placeholder="75001"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                'Créer le client'
                            )}
                        </button>
                        <Link href="/dashboard/clients" className="flex-1">
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

            {/* Aperçu (optionnel) */}
            {(formData.nom || formData.email) && (
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-800 mb-2">Aperçu du client</h3>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {formData.nom ? formData.nom.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">{formData.nom || 'Nom non renseigné'}</p>
                            <p className="text-sm text-gray-600">{formData.email || 'Email non renseigné'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
