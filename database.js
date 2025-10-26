const mongoose = require("mongoose");

const dbName = "aventurix";
const mongoUriLocalhost = `mongodb://localhost:27017/${dbName}`;
const mongoUriAtlas = process.env.MONGODB_URI;

// Cache global pour Vercel (évite de reconnecter à chaque requête)
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}


async function connectToDatabase() {

    // Déjà connecté → réutiliser la connexion
    if (cached.conn) return cached.conn;

    // Choisir l’URI en fonction de l’environnement
    const mongoUri =
        process.env.NODE_ENV === "production"
            ? mongoUriAtlas
            : mongoUriLocalhost;

    if (!mongoUri) {
        throw new Error("No MongoDB URI found. Check environment variables.");
    }

    // Si aucune connexion n'est encore en cours
    if (!cached.promise) {

        // Active le mode strict des requêtes Mongo (plus propre)
        mongoose.set("strictQuery", true);

        // On crée une PROMESSE de connexion MongoDB
        //   → très important en environnement serverless (Vercel)
        //   → empêche de se reconnecter à chaque requête
        cached.promise = mongoose.connect(mongoUri, {
            maxPoolSize: 10,                // Limite le nombre de connexions ouvertes (optimisation)
            bufferCommands: false,          // Empêche Mongoose d'empiler les requêtes si non connecté
            serverSelectionTimeoutMS: 10000 // Si MongoDB ne répond pas en 10s → erreur rapide
        }).then((mongoose) => mongoose);
    }

    // Attendre la connexion et la stocker
    cached.conn = await cached.promise;
    console.log("MongoDB connected:", process.env.NODE_ENV);

    // On retourne la connexion pour réutilisation (On réutilise la même connexion tant que l’API reste “réveillée” sur Vercel)
    return cached.conn;

}

module.exports = connectToDatabase;
