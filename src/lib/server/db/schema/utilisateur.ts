import { pgTable, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// Infos de base et identité de l'utilisateur
export const utilisateur = pgTable('utilisateur', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	noms: text('noms').notNull(),
	genre: boolean('genre').notNull(),

	// Identifiant unique par numéro de téléphone
	telephone: integer('telephone').notNull().unique(),
	email: text('email'),
	motsPasse: text('mots_passe'),
	photoProfil: text('photo_profil'),
	dateInscription: timestamp('date_inscription').defaultNow().notNull()
});
