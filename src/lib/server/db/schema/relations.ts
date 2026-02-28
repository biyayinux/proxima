import { relations } from 'drizzle-orm';
import { utilisateur } from './utilisateur';
import { vendeur } from './vendeur';
import { boutique } from './boutique';
import { article } from './article';
import { interesser } from './interesser';

// Liste des articles qui intéressent l'utilisateur
export const utilisateurRelations = relations(utilisateur, ({ many }) => ({
	interets: many(interesser)
}));

// Lien vers le profil utilisateur et ses boutiques possédées
export const vendeurRelations = relations(vendeur, ({ one, many }) => ({
	utilisateur: one(utilisateur, {
		fields: [vendeur.utilisateurId],
		references: [utilisateur.id]
	}),
	boutiques: many(boutique)
}));

// Rattachement au vendeur et liste des articles en stock
export const boutiqueRelations = relations(boutique, ({ one, many }) => ({
	vendeur: one(vendeur, {
		fields: [boutique.vendeurId],
		references: [vendeur.id]
	}),
	articles: many(article)
}));

// Appartenance à une boutique et suivi des marques d'intérêt
export const articleRelations = relations(article, ({ one, many }) => ({
	boutique: one(boutique, {
		fields: [article.boutiqueId],
		references: [boutique.id]
	}),
	interets: many(interesser)
}));

// Jointure précise entre un utilisateur et un article spécifique
export const interesserRelations = relations(interesser, ({ one }) => ({
	utilisateur: one(utilisateur, {
		fields: [interesser.utilisateurId],
		references: [utilisateur.id]
	}),
	article: one(article, {
		fields: [interesser.articleId],
		references: [article.id]
	})
}));
