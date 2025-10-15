const { body, validationResult } = require("express-validator")
const { StatusCodes } = require("http-status-codes")

const validateRegister = [

	// Vérifie le nom d’utilisateur
	body("username")
		.isAlphanumeric()
		.withMessage("Must be alphanumeric")
		.isLength({ min: 3, max: 30 })
		.withMessage("Username must be min 3 characters and max 30"),

	// Vérifie l’email
	body("email")
		.isEmail()
		.withMessage("Incorrect email format"),

	// Vérifie le mot de passe
	body("password")
		.isLength({ min: 4 })
		.withMessage("Password at least 4 characters"),

	// Vérifie s’il y a des erreurs
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// s'il y a des erreurs, les renvoyer avec un code 400 
			return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
		}
		// sinon, passer au contrôleur suivant
		next();
	},

]

module.exports = validateRegister;

