const { StatusCodes } = require("http-status-codes")
const Adviser = require("../models/Adviser");
const path = require("path");
const fs = require("fs").promises;


const getAll = async (req, res) => {
    try {
        const params = req.query;
        let formattedParams = {}
        if (params.town) {
            formattedParams.tags = { $regex: params.town, $options: "i" } // i = insensible à la casse (majuscules/minuscules)
        }
        const advisers = await Adviser.find(formattedParams)
        return res.status(StatusCodes.OK).send(advisers)
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error get advisers");
    }
}


const getOne = async (req, res) => {
    const { id } = req.params;
    try {
        const adviser = await Adviser.findById(id);
        if (!adviser) {
            return res.status(StatusCodes.BAD_REQUEST).send("No match adviser");
        }
        return res.status(StatusCodes.OK).send(adviser);
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error get one adviser");
    }
}


const create = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(StatusCodes.BAD_REQUEST).send("Missing field(s)")
        }
        await Adviser.create(req.body)
        return res.status(StatusCodes.CREATED).send("Adviser created")
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error create orders")
    }
}


const addImage = async (req, res) => {
    const { id } = req.params;
    const file = req.file; // Multer a attaché le fichier à req.file

    // on vérifie qu'on a bien ID
    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).send("No id provided. Failure.");
    }

    // on chercher le adviser qui correspond à cet ID
    let adviser;
    try {
        adviser = await Adviser.findById(id);
        if (!adviser) {
            return res.status().send("No adviser found. Failure.");
        }
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error get adviser. Failure.");
    }

    // on vérifier qu'on a bien un fichier et qu'on a bien un advisor qui contient quelque chose
    if (!file || Object.keys(adviser).length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).send("No upload. Failure.");
    }

    // on sauvegarde l'image dans le file system de Node et met à jour adviser.image
    try {

        // public/images/advisers/<id_adviser>/<nom_fichier_original>
        const uploadPath = path.join(__dirname, "../public/images/advisers", id, file.originalname);

        // créer le dossier s’il n’existe pas déjà
        const directory = path.dirname(uploadPath);
        await fs.mkdir(directory, { recursive: true });

        // écrire le contenu du fichier (stocké dans file.buffer par Multer) dans uploadPath
        await fs.writeFile(uploadPath, file.buffer);

        // met à jour le champ image de l’adviser dans MongoDB
        adviser.image = file.originalname;
        await adviser.save();

        return res.status(StatusCodes.CREATED).send("File attached successfully.");

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error : ${error}`);
    }

}

module.exports = { getAll, getOne, create, addImage }