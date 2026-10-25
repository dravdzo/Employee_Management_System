
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    age: {
        type: Number,
        min: 18,
        max: 65,
        required: true
    },

    department: {
        type: String,
        required: true,
        enum: ["IT", "HR", "Finance"]
    },

    salary: {
        type: Number,
        required: true,
        min: 0
    },

    hoursWorked: {
        type: Number,
        required: true,
        min: 0
    },

    bonus: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },

    active: {
        type: Boolean,
        required: true,
        default: true
    },

    skills: {
        type: [String],
        default: []
    },

    joinedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;