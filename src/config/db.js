
const mongoose = require("mongoose");
const DB_URL = "mongodb://localhost:27017/employeeMangementSystem";

const Employee = require("../model/Employee.js")

console.log(Employee)
async function connetToDb() {
    try{
        await mongoose.connect(DB_URL);
        console.log("Data Dase Conected Sucssfuly ...")
    }catch(error){
        console.log(error)
    }finally{
        mongoose.disconnect()
    }
}



connetToDb()