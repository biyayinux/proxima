import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

// Vérification de la variable d'environnement
if (!env.DATABASE_URL) {
	throw new Error("DATABASE_URL n'est pas réglé");
}

// Initialisation du client postgres
const client = postgres(env.DATABASE_URL);

// Exportation de l'instance db avec le schéma chargé
export const db = drizzle(client, { schema });
