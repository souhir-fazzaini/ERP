// app/services/clientService.ts
'use client';

import { Client } from '@/app/types/erp.types';

// Stockage temporaire (simule une base de données)
let clients: Client[] = [];

// Initialiser avec des données de démonstration
if (typeof window !== 'undefined' && clients.length === 0) {
    const saved = localStorage.getItem('erp_clients');
    if (saved) {
        clients = JSON.parse(saved);
    } else {
        clients = [
            {
                id: 1,
                nom: 'SARL Dupont',
                email: 'contact@dupont.com',
                telephone: '0123456789',
                adresse: '15 rue de Paris',
                ville: 'Paris',
                codePostal: '75001',
                pays: 'France',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                nom: 'Entreprise Martin',
                email: 'contact@martin.com',
                telephone: '0987654321',
                adresse: '8 avenue de Lyon',
                ville: 'Lyon',
                codePostal: '69000',
                pays: 'France',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('erp_clients', JSON.stringify(clients));
    }
}

export const clientService = {
    async getAll(): Promise<Client[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve([...clients]), 300);
        });
    },

    async getById(id: number): Promise<Client | undefined> {
        return clients.find(c => c.id === id);
    },

    async create(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
        const newClient = {
            ...client,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        clients.push(newClient);
        localStorage.setItem('erp_clients', JSON.stringify(clients));
        return newClient;
    },

    async update(id: number, client: Partial<Client>): Promise<Client> {
        const index = clients.findIndex(c => c.id === id);
        if (index !== -1) {
            clients[index] = { ...clients[index], ...client };
            localStorage.setItem('erp_clients', JSON.stringify(clients));
            return clients[index];
        }
        throw new Error('Client non trouvé');
    },

    async delete(id: number): Promise<void> {
        clients = clients.filter(c => c.id !== id);
        localStorage.setItem('erp_clients', JSON.stringify(clients));
    },

    async search(term: string): Promise<Client[]> {
        return clients.filter(c =>
            c.nom.toLowerCase().includes(term.toLowerCase()) ||
            c.email.toLowerCase().includes(term.toLowerCase()) ||
            c.ville.toLowerCase().includes(term.toLowerCase())
        );
    },

    async getStats() {
        return {
            total: clients.length,
            nouveaux: clients.filter(c => {
                const date = new Date(c.createdAt);
                const now = new Date();
                return now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000;
            }).length
        };
    }
};
