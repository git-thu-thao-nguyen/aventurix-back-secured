# 🪐 Aventurix


![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)


🌐 **[aventurix.netlify.app](https://aventurix.netlify.app/)**  


Bienvenue sur **Aventurix** — application web complète (Front + Back) permettant la gestion et la réservation de voyages.

Architecture MERN avec une intégration Stripe pour les paiements et un système d'authentification JWT sécurisé.

Auteure : Thu Thao NGUYEN  

---

## Architecture Aventurix


```
En local (Dev)
┌─────────────┐
│ React → UI            → localhost:5173
└──────┬──────┘
       │
┌──────▼──────┐
│ Node → API/Server     → localhost:3000
└──────┬──────┘
       │
┌──────▼──────┐
│ MongoDB → DB          → localhost:27017
└─────────────┘

En production (Cloud)
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ Netlify → UI     Vercel → API/Server       Atlas → DB
└─────────────┘      └─────────────┘      └─────────────┘
```




```
[ FRONT : React + TypeScript (View) ]
   ├─ Build & serveur de dev : Vite
   ├─ UI: Tailwind + ShadCN
   ├─ State: Redux Toolkit
   ├─ Routing: React Router v7 (actions/loaders)
   └─ API: Axios (interceptors, auth, erreurs)
            │
            ▼ Requête HTTPS
──────────────────────────────────────────────────────────────
[ BACK : Node.js + Express.js ]

   MIDDLEWARES (globaux ou spécifiques aux routes)
      1) helmet                           → ajoute des en-têtes de sécurité HTTP
      2) cors                             → autorise les origines front (Netlify / localhost)
      3) express-rate-limit               → limite le nombre de requêtes par IP (anti-bruteforce)
      4) morgan                           → log des requêtes dans le terminal
      5) body-parser / express.json()     → lecture du corps des requêtes (JSON / formulaires)
      6) xss-clean                        → nettoie les entrées contre les attaques XSS
      7) express-mongo-sanitize           → enlève les opérateurs MongoDB injectés ($, .)
      8) multer                           → gère l'upload de fichiers (FormData)
      9) express-validator                → valide les champs (req.body, params…)
            │
            ▼
   ROUTES (associent URL + méthode + middlewares + contrôleur)
            │
            ▼
   CONTROLLERS  ↔  MODELS (Mongoose)  ↔  [ DATABASE : MongoDB (Atlas/Compass) ]
            │
            │      Libs côté contrôleurs
            │      1) bcrypt               → hash / compare mots de passe
            │      2) jsonwebtoken         → création / vérification JWT
            │      3) stripe               → paiement (Checkout + webhooks)
            │      4) http-status-codes    → 200, 201, 404, 500…
            │
            │
            │ Réponse JSON
            ▼
──────────────────────────────────────────────────────────────
[ FRONT ] : Axios intercepte la réponse → met à jour l'UI React
```