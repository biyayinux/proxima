<script lang="ts">
	// Variables liées au formulaire
	let nom = '';
	let genre = '';
	let telephone = '';
	let password = '';
	let message = '';

	// Fonction appelée quand le formulaire est soumis
	async function handleSubmit(e: Event) {
		e.preventDefault();

		// Appel à l'API /signup
		const res = await fetch('/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ nom, genre, telephone, password })
		});

		const data = await res.json();
		message = data.message;

		if (res.ok) {
			// Réinitialiser le formulaire
			nom = '';
			genre = '';
			telephone = '';
			password = '';
			// On pourrait rediriger vers login ici si nécessaire
		}
	}
</script>

<div>
	<h1>Créer un compte</h1>
	<form on:submit|preventDefault={handleSubmit}>
		<input type="text" placeholder="Nom complet" bind:value={nom} required />
		<select bind:value={genre} required>
			<option value="">Sélectionner le genre</option>
			<option value="Homme">Homme</option>
			<option value="Femme">Femme</option>
		</select>
		<input type="tel" placeholder="Téléphone" bind:value={telephone} required />
		<input type="password" placeholder="Mot de passe" bind:value={password} required />
		<button type="submit">S'enregistrer</button>
	</form>
	{#if message}
		<p>{message}</p>
	{/if}
</div>
