// app/services/produitService.ts
'use client';

import { Produit } from '@/app/types/erp.types';

// Stockage temporaire (simule une base de données)
let produits: Produit[] = [];

// Initialiser avec des données de démonstration
if (typeof window !== 'undefined' && produits.length === 0) {
    const saved = localStorage.getItem('erp_produits');
    if (saved) {
        produits = JSON.parse(saved);
    } else {
        // Données de démonstration
        produits = [
            {
                id: 1,
                nom: 'Ordinateur Portable Pro',
                description: '16GB RAM, 512GB SSD, Processeur Intel i7, Écran 15.6"',
                prix: 899.99,
                stock: 15,
                categorie: 'Informatique',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                nom: 'Souris Sans Fil',
                description: 'Souris ergonomique, connectivité Bluetooth et USB, 3 niveaux de DPI',
                prix: 29.99,
                stock: 50,
                categorie: 'Accessoires',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                nom: 'Clavier Mécanique',
                description: 'Clavier mécanique RGB, switches bleus, layout AZERTY',
                prix: 79.99,
                stock: 25,
                categorie: 'Accessoires',
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                nom: 'Écran 24" LED',
                description: 'Écran Full HD 1920x1080, 75Hz, temps de réponse 1ms',
                prix: 199.99,
                stock: 8,
                categorie: 'Informatique',
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                nom: 'Webcam HD',
                description: 'Webcam 1080p, microphone intégré, autofocus',
                prix: 59.99,
                stock: 12,
                categorie: 'Périphériques',
                createdAt: new Date().toISOString()
            },
            {
                id: 6,
                nom: 'Casque Audio Gaming',
                description: 'Casque stéréo, microphone, RGB, compatible PC/PS5/Xbox',
                prix: 49.99,
                stock: 30,
                categorie: 'Audio',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('erp_produits', JSON.stringify(produits));
    }
}

export const produitService = {
    /**
     * Récupérer tous les produits
     */
    async getAll(): Promise<Produit[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve([...produits]), 300);
        });
    },

    /**
     * Récupérer un produit par son ID
     */
    async getById(id: number): Promise<Produit | undefined> {
        return produits.find(p => p.id === id);
    },

    /**
     * Créer un nouveau produit
     */
    async create(produit: Omit<Produit, 'id' | 'createdAt'>): Promise<Produit> {
        // Validation des données
        if (!produit.nom || produit.nom.trim() === '') {
            throw new Error('Le nom du produit est requis');
        }
        if (!produit.prix || produit.prix <= 0) {
            throw new Error('Le prix doit être supérieur à 0');
        }
        if (produit.stock === undefined || produit.stock < 0) {
            throw new Error('Le stock ne peut pas être négatif');
        }
        if (!produit.categorie) {
            throw new Error('La catégorie est requise');
        }

        const newProduit = {
            ...produit,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        produits.push(newProduit);

        // Sauvegarder dans localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('erp_produits', JSON.stringify(produits));
        }

        return newProduit;
    },

    /**
     * Mettre à jour un produit existant
     */
    async update(id: number, produit: Partial<Produit>): Promise<Produit> {
        const index = produits.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Produit non trouvé');
        }

        // Validation des données mises à jour
        if (produit.prix !== undefined && produit.prix <= 0) {
            throw new Error('Le prix doit être supérieur à 0');
        }
        if (produit.stock !== undefined && produit.stock < 0) {
            throw new Error('Le stock ne peut pas être négatif');
        }

        produits[index] = { ...produits[index], ...produit };

        // Sauvegarder dans localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('erp_produits', JSON.stringify(produits));
        }

        return produits[index];
    },

    /**
     * Supprimer un produit
     */
    async delete(id: number): Promise<void> {
        const index = produits.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Produit non trouvé');
        }

        produits = produits.filter(p => p.id !== id);

        // Sauvegarder dans localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('erp_produits', JSON.stringify(produits));
        }
    },

    /**
     * Rechercher des produits
     */
    async search(term: string): Promise<Produit[]> {
        const lowerTerm = term.toLowerCase().trim();
        if (!lowerTerm) return [...produits];

        return produits.filter(p =>
            p.nom.toLowerCase().includes(lowerTerm) ||
            p.categorie.toLowerCase().includes(lowerTerm) ||
            (p.description && p.description.toLowerCase().includes(lowerTerm))
        );
    },

    /**
     * Filtrer les produits par catégorie
     */
    async filterByCategorie(categorie: string): Promise<Produit[]> {
        if (!categorie || categorie === 'Toutes') return [...produits];
        return produits.filter(p => p.categorie === categorie);
    },

    /**
     * Obtenir toutes les catégories uniques
     */
    async getCategories(): Promise<string[]> {
        const categories = [...new Set(produits.map(p => p.categorie))];
        return categories.sort();
    },

    /**
     * Obtenir les statistiques des produits
     */
    async getStats() {
        const totalValeur = produits.reduce((sum, p) => sum + (p.prix * p.stock), 0);
        const stockTotal = produits.reduce((sum, p) => sum + p.stock, 0);
        const prixMoyen = produits.reduce((sum, p) => sum + p.prix, 0) / produits.length;

        return {
            total: produits.length,
            stockTotal: stockTotal,
            totalValeur: totalValeur,
            prixMoyen: prixMoyen,
            categories: [...new Set(produits.map(p => p.categorie))],
            enRupture: produits.filter(p => p.stock === 0).length,
            stockFaible: produits.filter(p => p.stock > 0 && p.stock < 10).length
        };
    },

    /**
     * Mettre à jour le stock d'un produit
     */
    async updateStock(id: number, quantite: number): Promise<void> {
        const produit = await this.getById(id);
        if (!produit) {
            throw new Error('Produit non trouvé');
        }

        const nouveauStock = produit.stock + quantite;
        if (nouveauStock < 0) {
            throw new Error('Stock insuffisant');
        }

        await this.update(id, { stock: nouveauStock });
    },

    /**
     * Vérifier si un produit est en stock
     */
    async isInStock(id: number, quantiteDemandee: number): Promise<boolean> {
        const produit = await this.getById(id);
        if (!produit) return false;
        return produit.stock >= quantiteDemandee;
    },

    /**
     * Obtenir les produits les plus vendus (simulation)
     */
    async getTopProduits(limit: number = 5): Promise<Produit[]> {
        // Simulation basée sur le stock (moins de stock = plus vendu)
        const sorted = [...produits].sort((a, b) => a.stock - b.stock);
        return sorted.slice(0, limit);
    },

    /**
     * Obtenir les produits par fourchette de prix
     */
    async getByPrixRange(min: number, max: number): Promise<Produit[]> {
        return produits.filter(p => p.prix >= min && p.prix <= max);
    },

    /**
     * Exporter les produits en CSV (format texte)
     */
    async exportToCSV(): Promise<string> {
        const headers = ['ID', 'Nom', 'Description', 'Prix', 'Stock', 'Catégorie', 'Date création'];
        const rows = produits.map(p => [
            p.id,
            p.nom,
            p.description || '',
            p.prix,
            p.stock,
            p.categorie,
            new Date(p.createdAt).toLocaleDateString('fr-FR')
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        return csvContent;
    },

    /**
     * Importer des produits depuis un tableau
     */
    async importFromArray(newProduits: Omit<Produit, 'id' | 'createdAt'>[]): Promise<number> {
        let imported = 0;
        for (const produit of newProduits) {
            try {
                await this.create(produit);
                imported++;
            } catch (error) {
                console.error('Erreur import produit:', produit.nom, error);
            }
        }
        return imported;
    },

    /**
     * Réinitialiser les données (pour le développement)
     */
    async resetData(): Promise<void> {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('erp_produits');
            // Recharger les données par défaut
            const saved = localStorage.getItem('erp_produits');
            if (!saved) {
                produits = [
                    {
                        id: 1,
                        nom: 'Ordinateur Portable Pro',
                        description: '16GB RAM, 512GB SSD',
                        prix: 899.99,
                        stock: 15,
                        categorie: 'Informatique',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        nom: 'Souris Sans Fil',
                        description: 'Souris ergonomique',
                        prix: 29.99,
                        stock: 50,
                        categorie: 'Accessoires',
                        createdAt: new Date().toISOString()
                    }
                ];
                localStorage.setItem('erp_produits', JSON.stringify(produits));
            }
        }
    }
};
