import { pgTable, integer, timestamp } from 'drizzle-orm/pg-core';
import { utilisateur } from './utilisateur';

// Table vendeur liée à un utilisateur
export const vendeur = pgTable('vendeur', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

	// Référence vers la table utilisateur avec suppression en cascade
	utilisateurId: integer('utilisateur_id')
		.notNull()
		.references(() => utilisateur.id, { onDelete: 'cascade' }),
	dateEnregistrement: timestamp('date_enregistrement').defaultNow().notNull()
});
