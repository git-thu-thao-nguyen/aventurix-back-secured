const mongoose = require("mongoose");
const { Schema } = mongoose;


// Définir un schéma
const adviserSchema = new Schema(
    {
        name: { type: String, required: true },
        tags: { type: [String] },
        image: { type: String },
        present: { type: String },
        from: { type: String },
        desc: { type: String },
        phone: { type: String },
        email: { type: String },
    },
    { timestamps: true }
);

// Créer un modèle basé sur le schéma
const Adviser = mongoose.model("Adviser", adviserSchema);

module.exports = Adviser;