import { defineConfig } from 'drizzle-kit';

// Vérification de la présence de l'URL de connexion
if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL n'est pas réglé");
}

export default defineConfig({
	// Emplacement des schémas modulaires
	schema: './src/lib/server/db/schema',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL
	},

	// Activation des logs détaillés et du mode strict
	verbose: true,
	strict: true
});
