# VoisinSereins.ai — Prototype

Prototype interactif de la plateforme VoisinSereins.ai pour les copropriétés françaises.

## Fonctionnalités

- **Onboarding** — Inscription, recherche d'adresse (RNIC simulé), choix de rôle (proprio/locataire/concierge/syndic), import WhatsApp
- **Fil d'actualité** — Posts avec Coach AI à l'écriture (reformulation diplomatique/chaleureuse/factuelle)
- **Conseil AI** — Conseiller juridique virtuel (appel réel à Claude Sonnet)
- **Médiation** — Résolution de différends assistée par AI
- **Sujets Structurés** — Signalements avec escalade automatique, consultations collectives, génération de documents AI
- **Signaler +** — Signalement rapide en 2 taps (urgent avec fiches réflexes / non-urgent / entraide)
- **Import WhatsApp** — Parser client-side, détection de sujets récurrents, identification de résidents
- **Messages** — Conversations privées entre voisins
- **Documents** — Gestion documentaire avec verrous par rôle
- **Agenda** — Événements de la copropriété
- **Profil** — Photo, rôle, vérification de statut

## Stack technique

- React 18 + Vite
- API Anthropic (Claude Sonnet) pour les fonctions AI
- Déployé sur Netlify

## Développement local

```bash
npm install
npm run dev
```

## Déploiement

Push sur `main` → Netlify build automatique.

```bash
npm run build
```

## Structure

```
├── index.html          # Point d'entrée HTML
├── package.json        # Dépendances
├── vite.config.js      # Config Vite
├── netlify.toml        # Config Netlify
├── public/
│   └── favicon.svg     # Favicon
└── src/
    ├── main.jsx        # Bootstrap React
    └── App.jsx         # Prototype complet (2118 lignes)
```

## Liens

- **Production** : [voisinsereins.netlify.app](https://voisinsereins.netlify.app)
- **Domaine** : [voisinsereins.ai](https://voisinsereins.ai)

---

© 2026 VoisinSereins.ai — Document interne
