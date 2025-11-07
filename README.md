# Proxima

Proxima est une application intelligente dédiée à la géolocalisation du magasin le plus proche et à la reconnaissance des articles demandés par le client à partir de leur image. Ce projet utilise React avec TypeScript dans un environnement Vite PWA, accompagné de TailwindCSS pour le style.

---

## Fonctionnalités principales

- Géolocalisation automatique du magasin le plus proche de l'utilisateur.
- Reconnaissance d'articles par analyse d'images fournies par le client.
- Application Progressive Web App (PWA) pour une expérience mobile fluide.
- Architecture moderne avec Vite, React, TypeScript, et Tailwind CSS.
- Qualité de code assurée grâce à ESLint et Prettier.

---

## Prérequis

- Node.js (version recommandée 20+)
- npm
- VSCode (optionnel mais recommandé) avec les extensions ESLint et Prettier

---

## Installation

1. **Cloner le dépôt**

2. **Installer les dépendances**

3. **Configurer ESLint et Prettier**

Pour une intégration officielle de Prettier avec ESLint dans un projet Vite PWA React déjà configuré avec ESLint, suivez cette procédure

- Installer Prettier et ses plugins ESLint

```bash
  npm install --save-dev --save-exact prettier
  npm install --save-dev eslint-plugin-prettier eslint-config-prettier
```

Si vous utilisez la Flat Config récente (`eslint.config.js`), ajoutez aussi

```bash
  import prettierConfig from "eslint-plugin-prettier/recommended";

  export default [
    // ...autres configs
    prettierConfig
  ];
```

- Ajouter un fichier `.prettierrc` à la racine du projet avec vos préférences

```bash
  {
    "semi": true,
    "singleQuote": true,
    "printWidth": 80
  }
```

- Configurer VSCode pour le formatage automatique au sauvegarde dans `.vscode/settings.json`

```bash
  {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
```

N'oubliez pas d'installer les extensions ESLint et Prettier dans VSCode.

---

## Contribution

Les contributions sont les bienvenues !  
Merci de respecter les règles de codage et de formatage définies avec ESLint et Prettier.

---

## License

Ce projet est sous licence MIT.
