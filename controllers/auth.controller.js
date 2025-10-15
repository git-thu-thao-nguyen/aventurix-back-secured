const { StatusCodes } = require("http-status-codes")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const saltRounds = 10;

const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body
        if (!username || !email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).send("Missing field(s)")
        }

        // check si user est déjà enregistré
        const foundUser = await User.findOne({ email })
        if (foundUser) {
            return res.status(StatusCodes.BAD_REQUEST).send("Registration failed : You are already registered");
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        await User.create({
            username, email, password: hashedPassword, role
        })
        return res.status(StatusCodes.CREATED).send("User registered");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error register user")
    }

}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).send("Missing field(s)");
        }

        // check si user est déjà enregistré
        const foundUser = await User.findOne({ email })
        if (!foundUser) {
            return res.status(StatusCodes.UNAUTHORIZED).send("Invalid credentials");
        }

        // check password
        const isMatch = await bcrypt.compare(password, foundUser.password)
        if (!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).send("Invalid credentials");
        }

        // création du token JWT
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(
            {
                id: foundUser._id,
                username: foundUser.username,
                email: foundUser.email
            },
            jwtSecretKey,
            { expiresIn: "1h" } // Après 1h, token devient invalide et l’utilisateur doit se reconnecter.
        )

        // supprimer les champs sensibles de l'user
        const { password: _, __v, ...userWithoutSensitiveData } = foundUser._doc;

        return res.status(StatusCodes.OK).send({ user: userWithoutSensitiveData, token })

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error login user")
    }

}

module.exports = { register, login }