require("dotenv").config();
const connectToDatabase = require("./database");
const Trip = require("./models/Trip");

(async () => {
    try {
        console.log("⏳ Connexion à MongoDB Atlas...");
        await connectToDatabase();

        console.log("⏳ Lecture des voyages...");
        const trips = await Trip.find({});

        console.log("✅ Résultat :");
        console.log(trips);

    } catch (err) {
        console.log("❌ Erreur :", err.message);
    } finally {
        process.exit();
    }
})();
