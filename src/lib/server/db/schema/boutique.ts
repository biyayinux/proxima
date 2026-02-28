import { pgTable, text, integer, doublePrecision, timestamp } from 'drizzle-orm/pg-core';
import { vendeur } from './vendeur';

// Gestion des points de vente physiques
export const boutique = pgTable('boutique', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

	// Liaison directe au propriétaire vendeur
	vendeurId: integer('vendeur_id')
		.notNull()
		.references(() => vendeur.id, { onDelete: 'cascade' }),
	nom: text('nom').notNull(),

	// Coordonnées précises pour la géolocalisation
	longitude: doublePrecision('longitude').notNull(),
	latitude: doublePrecision('latitude').notNull(),
	zone: text('zone').notNull(),
	logo: text('logo'),
	dateEnregistrement: timestamp('date_enregistrement').defaultNow().notNull()
});
