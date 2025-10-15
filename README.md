# 🪐 Aventurix

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)


🌐 **[aventurix.netlify.app](https://aventurix.netlify.app/)**  


Bienvenue sur **Aventurix** — application web complète (Front + Back) permettant la gestion et la réservation de voyages.

Architecture MERN avec une intégration Stripe pour les paiements et un système d’authentification JWT sécurisé.

Auteure : Thu Thao NGUYEN  

---

## Architecture Technique


```
En local (Dev)
┌────────────┐
│ React → UI        → localhost:5173
└──────┬─────┘
        │
┌──────▼──────┐
│ Node → API        → localhost:3000
└──────┬──────┘
        │
┌──────▼──────┐
│ MongoDB → DB      → localhost:27017
└─────────────┘

En production (Cloud)
┌────────────┐     ┌────────────┐     ┌────────────┐
│ Netlify → UI      Vercel → API        Atlas → DB
└────────────┘     └────────────┘     └────────────┘
```


```
[ FRONT : React TypeScript ]
  ├─ Build & serveur de dev : Vite
  ├─ UI: Tailwind + ShadCN
  ├─ State: Redux Toolkit
  ├─ Routing: React Router v7 (actions/loaders)
  └─ API: Axios (interceptors, auth, erreurs)
          │
          ▼  Requête HTTPS (Authorization / JSON / FormData)
────────────────────────────────────────────────────────────────
[ BACK : Node.js + Express.js ]
  ├─ Outils :
        ├─ path                         → manipule fichiers
        ├─ dotenv                       → charge les variables d'environnement (.env)
        ├─ nodemon                      → relance automatique du serveur en dev
        ├─ Postman                      → test des endpoints API
  ├─ Middlewares :
        1) helmet                       → ajoute des en-têtes de sécurité HTTP
        2) cors                         → autorise les origines front (Netlify / localhost)
        3) express-rate-limit           → limite le nombre de requêtes par IP (anti-bruteforce)
        4) morgan                       → log des requêtes dans le terminal
        5) body-parser / express.json() → lecture du corps des requêtes (JSON / formulaires)
        6) xss-clean                    → nettoie les entrées contre les attaques XSS
        7) express-mongo-sanitize       → enlève les opérateurs MongoDB injectés ($, .)
        8) multer                       → gère l’upload de fichiers (FormData)
        9) Routes + express-validator   → valide les champs (req.body, params…)
  └─ Contrôleurs :
        ├─ bcrypt                       → hash / compare mots de passe
        ├─ jsonwebtoken                 → création / vérification JWT
        ├─ stripe                       → paiement (Checkout + webhooks)
        ├─ http-status-codes            → codes HTTP lisibles (200, 201, 404, 500…)
        └─ mongoose                     → ODM pour dialoguer avec MongoDB
              │
              ▼
[ DATABASE : MongoDB v8 (Atlas/Compass) ]
────────────────────────────────────────────────────────────────
[ Réponse JSON ] → interceptée par Axios (gestion d’erreurs, token, authentification)
```