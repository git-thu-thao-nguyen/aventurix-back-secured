const multer = require("multer");
const { StatusCodes } = require("http-status-codes");

const singleFileUploaderMiddleware = (req, res, next) => { // next() = passe à la suite (ex : contrôleur)

	const uploader = req.app.locals.uploader; // on récupère une instance Multer qui a été configurée dans index.js

	const singleFileUploader = uploader.single("image"); // crée une fonction d’upload pour UN SEUL fichier

	// On exécute le middleware d’upload
	singleFileUploader(req, res, (error) => {
		if (error instanceof multer.MulterError) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
		} else if (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
		}
		// console.log("req.file =", req.file);
		next(); // passe au middleware / contrôleur suivant
	});
};

module.exports = singleFileUploaderMiddleware;