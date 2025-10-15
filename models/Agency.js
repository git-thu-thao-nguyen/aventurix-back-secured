const mongoose = require("mongoose");
const { Schema } = mongoose;


// Définir un schéma
const agencySchema = new Schema(
	{
		address: { type: String },
		phone: { type: String },
		photo: { type: String },
		title: { type: String },
		email: { type: String },
	},
	{ timestamps: true }
);

// Créer un modèle basé sur le schéma
const Agency = mongoose.model("Agency", agencySchema);

module.exports = Agency;
