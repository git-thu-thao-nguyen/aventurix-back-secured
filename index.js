// index.js (racine) : sert à lancer le serveur uniquement en local
// api / index.js : sert à exporter l'app pour Vercel

const app = require("./api/index.js");
const port = 3000;
app.listen(port, () => console.log("Local server on", port));
