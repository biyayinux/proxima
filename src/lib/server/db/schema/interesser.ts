import { pgTable, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { utilisateur } from './utilisateur';
import { article } from './article';

// Table de liaison pour les articles qui intéressent les clients
export const interesser = pgTable(
	'interesser',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

		// Référence vers l'utilisateur avec suppression automatique
		utilisateurId: integer('utilisateur_id')
			.notNull()
			.references(() => utilisateur.id, { onDelete: 'cascade' }),

		// Référence vers l'article avec suppression automatique
		articleId: integer('article_id')
			.notNull()
			.references(() => article.id, { onDelete: 'cascade' }),
		dateEnregistrement: timestamp('date_enregistrement').defaultNow().notNull()
	},
	(table) => [
		// Indexation pour optimiser les recherches par utilisateur et article
		index('interesser_user_idx').on(table.utilisateurId),
		index('interesser_article_idx').on(table.articleId)
	]
);
