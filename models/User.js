const mongoose = require("mongoose");
const { Schema } = mongoose;


// Définir un schéma
const userSchema = new Schema(
	{
		username: { type: String, required: true },
		email: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		firstname: { type: String },
		familyname: { type: String },
		phone: { type: String },
		address: { type: String },
		zip: { type: String },
		town: { type: String },
		country: { type: String },
		role: { type: String, enum: ["user", "admin"], default: "user" },
	},
	{ timestamps: true }
);

// Créer un modèle basé sur le schéma
const User = mongoose.model("User", userSchema);

module.exports = User;
