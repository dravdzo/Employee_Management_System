
const mongoose = require("mongoose");
const DB_URL = "mongodb://localhost:27017/employeeMangementSystem";

async function connetToDb() {
    await mongoose.connect(DB_URL);
    console.log("Database Connected Successfully");
}

async function disconnectFromDb() {
    await mongoose.disconnect();
    console.log("Database Disconnected Successfully");
}

module.exports = {
    connetToDb,
    disconnectFromDb
};