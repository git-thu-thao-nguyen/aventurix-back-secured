const mongoose = require("mongoose");
const { Schema } = mongoose;


// Définir un schéma
const tripSchema = new Schema(
	{
		title: { type: String, required: true },
		summary: { type: String },
		region: { type: Number },
		town: { type: String },
		desc: { type: String },
		category: { type: String },
		images: { type: [String] },
		duration: { type: Number },
		adultPrice: { type: Number },
		youngPrice: { type: Number },
		tags: { type: [String] },
	},
	{ timestamps: true }
);

// Créer un modèle basé sur le schéma
const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;