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

    // Première connexion → créer la promesse
    if (!cached.promise) {
        mongoose.set("strictQuery", true);
        cached.promise = mongoose.connect(mongoUri, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 8000,
            maxPoolSize: 10,
        }).then((mongoose) => mongoose);
    }

    // Attendre la connexion et la stocker
    cached.conn = await cached.promise;
    console.log("MongoDB connected:", process.env.NODE_ENV);
    return cached.conn;

}

module.exports = connectToDatabase;
