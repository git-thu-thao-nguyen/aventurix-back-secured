const { StatusCodes } = require("http-status-codes")
const Agency = require("../models/Agency")
const path = require("path")
const fs = require("fs").promises


const getAll = async (req, res) => {
    try {
        const agencies = await Agency.find()
        return res.status(StatusCodes.OK).send(agencies)
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error get agencies")
    }
}

const getOne = async (req, res) => {
    try {
        const { id } = req.params
        const agency = await Agency.findById(id)
        if (!agency) {
            return res.status(StatusCodes.BAD_REQUEST).send("No match agency")
        }
        return res.status(StatusCodes.OK).send(agency)
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error get one agency")
    }
}



const create = async (req, res) => {
    try {
        await Agency.create(req.body)
        return res.status(StatusCodes.CREATED).send("Agency created")
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error create agencies")
    }
}


const addImage = async (req, res) => {
    const { id } = req.params;
    const file = req.file; // Multer a attaché le fichier à req.file

    // on vérifie qu'on a bien ID
    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).send("No id provided. Failure.");
    }

    // on chercher le agency qui correspond à cet ID
    let agency;
    try {
        agency = await Agency.findById(id)
        if (!agency) {
            return res.status().send("No agency found. Failure.");
        }
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error get agency. Failure.");
    }

    // on vérifier qu'on a bien un fichier et qu'on a bien un agency qui contient quelque chose
    if (!file || Object.keys(agency).length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).send("No upload. Failure.");
    }

    // on sauvegarde l'image dans le file system de Node et met à jour agency.photo
    try {

        // public/images/agencies/<id_agency>/<nom_fichier_original>
        const uploadPath = path.join(__dirname, "../public/images/agencies", id, file.originalname);

        // créer le dossier s’il n’existe pas déjà
        const directory = path.dirname(uploadPath);
        await fs.mkdir(directory, { recursive: true });

        // écrire le contenu du fichier (stocké dans file.buffer par Multer) dans uploadPath
        await fs.writeFile(uploadPath, file.buffer);

        // met à jour le champ image de l'agency dans MongoDB
        agency.photo = file.originalname;
        await agency.save();

        return res.status(StatusCodes.CREATED).send("File attached successfully.");

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error : ${error}`);
    }
}

module.exports = { getAll, getOne, create, addImage }