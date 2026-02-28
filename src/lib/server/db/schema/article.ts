import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { boutique } from './boutique';

// Produits mis en vente dans les boutiques
export const article = pgTable('article', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

	// Appartenance obligatoire à une boutique existante
	boutiqueId: integer('boutique_id')
		.notNull()
		.references(() => boutique.id, { onDelete: 'cascade' }),
	nom: text('nom').notNull(),
	prix: integer('prix').notNull(),
	devise: text('devise').notNull(),
	photos: text('photos').notNull(),

	// Données structurées pour les galeries et l'IA
	photosJson: text('photos_json'),
	vecteursJson: text('vecteurs_json'),
	dateEnregistrement: timestamp('date_enregistrement').defaultNow().notNull()
});
