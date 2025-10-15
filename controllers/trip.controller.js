const { StatusCodes } = require("http-status-codes");
const Trip = require("../models/Trip");
const { categoryCodes, tags } = require("../helpers/data");
const path = require("path");
const fs = require("fs").promises


const getAll = async (req, res) => {
    try {
        const params = req.query
        const formattedParams = {}
        if (params.region && params.region !== "0") {
            formattedParams.region = parseInt(params.region)
        }
        if (params.duration && params.duration !== "0") {
            formattedParams.duration = parseInt(params.duration)
        }
        if (params.town) {
            formattedParams.town = { $regex: params.town, $options: "i" } // i = insensible à la casse (majuscules/minuscules)
        }
        if (params.price) {
            formattedParams.adultPrice = { $lte: params.price } // lts = Less Than or Equal "<=""
        }
        if (params.category && params.category !== "0") {
            const category = categoryCodes.find((cat) => cat.code === parseInt(params.category));
            if (category) {
                formattedParams.category = category.name;
            }
        }
        if (params.tags && params.tags !== "0") {
            const tag = tags.find((tag) => tag.code === parseInt(params.tags));
            if (tag) {
                formattedParams.tags = tag.name;
            }
        }
        const trips = await Trip.find(formattedParams)
        return res.status(StatusCodes.OK).send(trips)
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error get trips")
    }
}

const getOne = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).send("No ID provided")
    }

    try {
        const trip = await Trip.findById(id)
        if (!trip) {
            return res.status(StatusCodes.BAD_REQUEST).send("No match trip")
        }
        return res.status(StatusCodes.OK).send(trip)
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error get one trip")
    }
}


const getAllBestsellers = async (req, res) => {
    try {
        const trips = await Trip.find({ tags: "bestseller" });
        return res.status(StatusCodes.OK).send(trips);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error get all bestsellers");
    }
};


const create = async (req, res) => {
    try {
        const { title } = req.body
        if (!title) {
            return res.status(StatusCodes.BAD_REQUEST).send("Missing field(s)")
        }
        const trip = await Trip.create(req.body)
        return res.status(StatusCodes.CREATED).json({ message: "Trip created", trip })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error create trip")
    }
}


const patchOne = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).send("No ID provided");
    }
    try {
        const trip = await Trip.findByIdAndUpdate(id, req.body, { new: true });
        if (!trip) {
            return res.status(StatusCodes.NOT_FOUND).send("No resource found");
        }
        return res.status(StatusCodes.OK).send(trip);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error patch one trip");
    }
}


const deleteOne = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).send("No ID provided");
    }
    try {
        const trip = await Trip.findByIdAndDelete(id);
        if (!trip) {
            return res.status(StatusCodes.NOT_FOUND).send("Nothing to delete");
        }
        return res.status(StatusCodes.OK).send(trip);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error patch delete one trip");
    }
}


const deleteAll = async (req, res) => {
    try {
        const result = await Trip.deleteMany();
        if (res.deletedCount === 0) {
            return res.status(StatusCodes.NOT_FOUND).send("Nothing to delete");
        }
        return res.status(StatusCodes.OK).send("All deleted");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error patch delete all trip");
    }
}

const addImages = async (req, res) => {
    const { id } = req.params;
    const files = req.files; // Multer a attaché les fichiers à req.files

    // on vérifie qu'on a bien ID
    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).send("No id provided. Failure.");
    }

    // on chercher le trip qui correspond à cet ID
    let trip;
    try {
        trip = await Trip.findById(id)
        if (!trip) {
            return res.status().send("No trip found. Failure.");
        }
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error get trip. Failure.");
    }

    // on vérifier qu'on a bien des fichiers et qu'on a bien un trip qui contient quelque chose
    if (!files || files.length === 0 || Object.keys(trip).length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).send("No upload. Failure.");
    }

    // on sauvegarde les images dans le file system de Node et met à jour trip.photo
    try {

        await Promise.all(
            files.map(async (file) => {
                // public/images/trips/<id_trip>/<nom_fichier_original>
                const uploadPath = path.join(__dirname, "../public/images/trips", id, file.originalname);

                // créer le dossier s’il n’existe pas déjà
                const directory = path.dirname(uploadPath);
                await fs.mkdir(directory, { recursive: true });

                // écrire le contenu du fichier (stocké dans file.buffer par Multer) dans uploadPath
                await fs.writeFile(uploadPath, file.buffer);

                // met à jour le champ image de le trip dans MongoDB
                trip.images.push(file.originalname);
            })
        )

        await trip.save();
        return res.status(StatusCodes.CREATED).send("File(s) attached successfully.");

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error : ${error}`);
    }
}

module.exports = { getAll, getOne, getAllBestsellers, create, patchOne, deleteOne, deleteAll, addImages }