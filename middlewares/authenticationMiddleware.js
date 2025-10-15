const jwt = require("jsonwebtoken")
const { StatusCodes } = require("http-status-codes")
const User = require("../models/User")


const authenticateMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.header("authorization");
		if (!authHeader) {
			return res.status(StatusCodes.BAD_REQUEST).send("Authentication failed");
		}
		const jwtSecretKey = process.env.JWT_SECRET_KEY;
		const token = authHeader.split(" ")[1];
		const userByToken = jwt.verify(token, jwtSecretKey);
		const userInDatabase = await User.findById(userByToken.id).select("-password -__v -updatedAt");

		// attacher l'utilisateur au req
		req.user = userInDatabase;
		next();
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.BAD_REQUEST).send("Authentication failed");
	}
};

module.exports = { authenticateMiddleware };