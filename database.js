const mongoose = require("mongoose");

const mongoUriAtlas = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.o1hxbyo.mongodb.net/?retryWrites=true&w=majority&appName=aventurix`;
const mongoUriLocalhost = `mongodb://localhost:27017/aventurix`;
const dbName = "aventurix";

let mongoUri = ``;

const connectToDatabase = async () => {

    if (process.env.NODE_ENV === "production") {
        mongoUri = mongoUriAtlas;
    } else {
        mongoUri = mongoUriLocalhost;
    }

    try {
        await mongoose.connect(mongoUri, {
            dbName: dbName,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            tls: process.env.NODE_ENV === "production",
        });
        console.log("Connecting to database successful");
    } catch (error) {
        console.log("Error connecting to database", error);
    }

}

module.exports = connectToDatabase;