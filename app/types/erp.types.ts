// app/types/erp.types.ts
export interface Client {
    id: number;
    nom: string;
    email: string;
    telephone: string;
    adresse: string;
    ville: string;
    codePostal: string;
    pays: string;
    createdAt: string;
}

export interface Produit {
    id: number;
    nom: string;
    description: string;
    prix: number;
    stock: number;
    categorie: string;
    createdAt: string;
}

export interface Facture {
    id: number;
    numero: string;
    clientId: number;
    clientNom: string;
    date: string;
    statut: 'payée' | 'en_attente' | 'annulée';
    totalHT: number;
    totalTTC: number;
    items: FactureItem[];
}

export interface FactureItem {
    produitId: number;
    produitNom: string;
    quantite: number;
    prixUnitaire: number;
    total: number;
}
