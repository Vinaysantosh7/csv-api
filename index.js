//Importing Dependencies
const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");

const app = express();
const PORT = 3000;

//Reading and Storing csv data 
const readCSV = () => {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream("F:/Project/csvdata.csv") // No .csv extension
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (err) => reject(err));
    });
};

//Creating a Route to Fetch CSV Data
app.get("/data", async (req, res) => {
    try {
        const data = await readCSV(); // CSV file name
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error reading CSV file" });
    }
});

// Starting the Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

