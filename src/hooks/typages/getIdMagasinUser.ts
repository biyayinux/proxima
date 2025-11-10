// Typage des magasins et utilisateurs
export interface Magasin {
  id: number;
  nom: string;
  logo?: string;
  dt?: string; // Date de création
}

export interface User {
  id: number;
  nom: string;
}

// Typage des articles
export interface Article {
  id: number;
  nom: string;
  prix: number;
  devise: string;
  photos: string[];
  cluster: number;
  date_creation: string;
}
