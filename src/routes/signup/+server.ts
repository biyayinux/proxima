import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { db } from '$lib/server/db/index';
import { utilisateur } from '$lib/server/db/schema/utilisateur';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Récupération des données du formulaire
		const { nom, genre, telephone, password } = await request.json();

		if (!nom || !genre || !telephone || !password) {
			return new Response(JSON.stringify({ message: 'Tous les champs sont requis' }), {
				status: 400
			});
		}

		// Transformation stricte du genre
		let genreBool: boolean;
		if (genre === 'Homme') {
			genreBool = true;
		} else if (genre === 'Femme') {
			genreBool = false;
		} else {
			return new Response(JSON.stringify({ message: 'Genre invalide' }), { status: 400 });
		}

		// Conversion du téléphone en integer pour correspondre au schéma
		const telephoneInt = parseInt(telephone, 10);

		// Vérification de l'existence du numéro avec l'opérateur eq
		const existing = await db
			.select()
			.from(utilisateur)
			.where(eq(utilisateur.telephone, telephoneInt));

		if (existing.length > 0) {
			return new Response(JSON.stringify({ message: 'Ce numéro est déjà utilisé' }), {
				status: 400
			});
		}

		// Hachage sécurisé du mot de passe
		const hashedPassword = await bcrypt.hash(password, 10);

		// Insertion des données dans la table utilisateur
		await db.insert(utilisateur).values({
			noms: nom,
			genre: genreBool,
			telephone: telephoneInt,
			motsPasse: hashedPassword
		});

		return new Response(JSON.stringify({ message: 'Compte créé avec succès' }), { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ message: 'Erreur serveur' }), { status: 500 });
	}
};
