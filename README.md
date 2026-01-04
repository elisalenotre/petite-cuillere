# Petite Cuillère 🥄

## Description
**Petite Cuillère** est une application web de type *cookbook* permettant de gérer ses recettes personnelles.
Elle propose une authentification via Supabase, un CRUD complet sur les recettes, ainsi qu’un système de recherche, filtres, tri et pagination pour retrouver facilement ses plats.
L’interface est pensée pour être claire, responsive et accessible.

## Fonctionnalités
- [x] Authentification (Supabase Auth)
  - [x] Inscription email / mot de passe
  - [x] Connexion
  - [x] Déconnexion
  - [x] Persistance de session
  - [x] Protection des routes (pages privées)
  - [x] OAuth (Google + GitHub)
- [x] CRUD complet sur la ressource principale : **recipes**
  - [x] Create : ajout d’une recette
  - [x] Read : liste + page détail
  - [x] Update : modification d’une recette
  - [x] Delete : suppression d’une recette
- [x] Recherche + filtrage + tri
  - [x] Recherche textuelle
  - [x] Filtres (régime, temps, technique de cuisson, difficulté)
  - [x] Tri (date, alphabétique)
  - [x] Pagination
- [x] UI/UX
  - [x] États de chargement, erreurs, messages de succès
  - [x] Empty states (liste vide, aucun résultat)
  - [x] Responsive (mobile + desktop)
- [x] Page 404
- [x] Tests unitaires (Vitest + Testing Library)

## Stack technique
- React 18
- TypeScript
- Vite
- React Router v6
- Supabase (Auth + Database)
- CSS Modules
- Vitest + React Testing Library

## Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Un projet Supabase (URL + Anon Key)

### Lancement en local
1. Cloner le projet :
   ```bash
   git clone <URL_DU_REPO>
   cd petite-cuillere
   ```
2. Installer les dépendances
   ```bash
   npm install
   ```
3. Créer un fichier .env à la racine du projet
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Lancer l'application
   ```bash
   npm run dev
   ```
5. Lancer les tests
   ```bash
   npx vitest --ui
   ```

## Structure du projet
```bash
src/
  components/
    Auth/
    Filters/
    Pagination/
    RecipeCard/
    RecipeForm/
  contexts/
    AuthContext.tsx
  pages/
    Auth/
    Recipes/
    NotFound/
  services/
    supabase/
  types/
    recipes.ts
  supabase.ts
  main.tsx
  App.tsx
```

### Détails rapides
- components/ : composants réutilisables (filtres, pagination, cards, formulaires…)
- pages/ : pages principales (auth, liste/détail recettes, 404…)
- contexts/ : state management via Context API (auth)
- services/ : logique d’accès aux données / appels Supabase
- types/ : types TypeScript (Recipe, etc.)

## Autrices
Jihad DOUHI — jihad.douhipro@gmail.com & Elisa LENOTRE - elisalenotre6@gmail.com


