
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const Employee = require("./model/Employee.js");
const dbConection = require("./config/db.js");
const EmployeeController = require("./controllers/employeeController.js");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const PORT = 2005;

app.get("/", async function (req, res) {
    try {
        await dbConection.connetToDb();

        const data = await EmployeeController.getEmployees(Employee);

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await dbConection.disconnectFromDb();
    }
});

app.get("/employees/active", async function (req, res) {
    try {
        await dbConection.connetToDb();

        const data = await EmployeeController.getActiveEmployee(Employee);

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await dbConection.disconnectFromDb();
    }
});

app.get("/employees/search", async function (req, res) {
    try {
        await dbConection.connetToDb();

        const data = await EmployeeController.getEmployeeByName(
            Employee,
            req.query.search
        );

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await dbConection.disconnectFromDb();
    }
});

app.get("/employees", async function (req, res) {
    try {
        await dbConection.connetToDb();

        if (!req.query.department) {
            return res.status(400).json({
                error: "Please provide a department query parameter"
            });
        }

        const data = await EmployeeController.getEmployeeByDepartment(
            Employee,
            req.query.department
        );

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await dbConection.disconnectFromDb();
    }
});

app.get("/employees/:id", async function (req, res) {
    try {
        await dbConection.connetToDb();

        const data = await EmployeeController.getEmployeeById(
            Employee,
            req.params.id
        );

        if (!data) {
            return res.status(404).json({
                error: "Employee not found"
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await dbConection.disconnectFromDb();
    }
});

app.post("/employees", async function (req, res) {
    try {
        await dbConection.connetToDb();

        const data = await EmployeeController.addEmployee(
            Employee,
            req.body
        );

        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await dbConection.disconnectFromDb();
    }
});

app.patch("/employees/:id", async function (req, res) {
    try {
        await dbConection.connetToDb();

        const data = await EmployeeController.updateEmployee(
            Employee,
            req.params.id,
            req.body
        );

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await dbConection.disconnectFromDb();
    }
});

app.delete("/employees/:id", async function (req, res) {
    try {
        await dbConection.connetToDb();

        const data = await EmployeeController.deleteEmployee(
            Employee,
            req.params.id
        );

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await dbConection.disconnectFromDb();
    }
});

app.listen(PORT, function () {
    console.log(`Server is running at http://localhost:${PORT}`);
});
