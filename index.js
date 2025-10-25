// ==========================
// Importation des modules / routes
// ==========================
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const multer = require("multer");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const connectToDatabase = require("./database");
const orderRoutes = require("./routes/order.routes");
const adviserRoutes = require("./routes/adviser.routes");
const agencyRoutes = require("./routes/agency.routes");
const tripRoutes = require("./routes/trips.routes");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const checkoutRoutes = require("./routes/checkout.routes");


// ==========================
// Instance
// ==========================
const app = express();


// ==========================
// Middlewares
// ==========================

const port = 3000;
app.use(morgan("dev")); // log des requêtes dans le terminal
app.use(bodyParser.urlencoded({ extended: false })); // lire les formulaires HTML (x-www-form-urlencoded) du body
app.use(bodyParser.json()); // lire le JSON du body
app.use(express.static("public")); // rend dossier "public" accessible via navigateur (non visible par défaut avec Express)
dotenv.config();
app.use(helmet()); // ajoute auto des headers de sécurité dans toutes les réponses HTTP
app.use(xssClean()); // supprimer les balises ou scripts dangereux (protection contre les attaques XSS)
app.use(mongoSanitize({ replaceWith: "_" })); // remplace les opérateurs MongoDB ($ et .) par un underscore (_) 

// Config multer :
// sans multer → Express ne comprend pas les fichiers dans multipart/form-data
// avec multer → les fichiers sont analysés et accessibles dans req.file (ou req.files)
app.locals.uploader = multer({
    storage: multer.memoryStorage({}), // garde temporairement le fichier en RAM (contenu binaire dans req.file.buffer)
    limits: { fileSize: 10 * 1024 * 1024 }, // max size : 10 Mb
    fileFilter: (req, file, cb) => { // filtrage des fichiers (avant de les accepter)
        if (file.mimetype.startsWith("image/")) { // accepte uniquement les images (image/jpeg, image/png, etc.)
            cb(null, true);
        } else {
            cb(new Error("Only images are accepted"));
        }
    },
});

// Config rate limit :
const limitOptions = {
    windowMs: 15 * 60 * 1000, // fenêtre de temps : 15 minutes
    max: 1000, // nombre maximum de requêtes autorisées par IP pendant la fenêtre de temps
    handler: (req, res) => {
        // si limite dépassée → renvoie une erreur 429
        res.status(StatusCodes.TOO_MANY_REQUESTS).json({ status: 429, error: "Too many requests" });
    },
    standardHeaders: true, // ajoute les infos de limite dans les nouveaux en-têtes HTTP (RateLimit-*)
    legacyHeaders: false, // désactive les anciens en-têtes (X-RateLimit-*)
};
app.use(rateLimit(limitOptions)); // activation du middleware de limitation de débit pour toutes les routes

// Config cors
const allowedOrigins = [
    "https://aventurix.netlify.app",
    "http://localhost:5173"
];
const corsOptions = {
    origin: (origin, callback) => {
        // vérifie si l’origine de la requête est dans la liste autorisée
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // !origin = autorise temporairement des requête sans header "Origin" (Postman, cURL) pour tester avec Postman
            callback(null, true); // autorisée
        } else {
            callback(new Error("Not allowed by cors")); // bloque la requête avec une erreur CORS
        }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"], // autorise uniquement certaines méthodes HTTP
    allowedHeaders: ["Content-Type", "Authorization", "X-Forwarded-For"], // autorise uniquement certains en-têtes (headers) dans les requêtes
    credentials: true, // autorise des cookies ou des headers d’authentification
};
app.use(cors(corsOptions)); // activation du middleware CORS pour toutes les routes Express



// ==========================
// Se connecter à la bdd
// ==========================
connectToDatabase();


// ==========================
// Endpoints
// ==========================
app.use("/orders", orderRoutes);
app.use("/advisers", adviserRoutes);
app.use("/agencies", agencyRoutes);
app.use("/trips", tripRoutes);
app.use("/auth", authRoutes)
app.use("/profile", profileRoutes);
app.use("/create-checkout-session", checkoutRoutes);



// ==========================
// Routes non trouvées
// ==========================
app.use((req, res) => {
    return res.status(404).send("Page not found");
});


// ==========================
// Se connecter au serveur
// ==========================
app.listen(port, () => {
    console.log(`Aventurix server running on port ${port}`)
});