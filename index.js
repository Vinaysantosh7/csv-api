//Importing Dependencies
const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");

const app = express();
const PORT = 4000;

// Reading and Storing csv data 
const readCSV = () => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream("F:/Project/csvdata.csv")
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (err) => reject(err));
    });
};

let housingData = [];

// Preload CSV when server starts
readCSV().then(data => {
    housingData = data;
    console.log("CSV Data loaded successfully");
}).catch(err => {
    console.error("Error loading CSV:", err);
});

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to Housing API!");
});

// Route: /data - Return full data
app.get("/data", (req, res) => {
    res.json(housingData);
});

// Route: /homepage - Return lightweight homepage info
app.get("/homepage", (req, res) => {
    const homepageData = housingData.map(home => ({
        id: home.id,
        address: home.address,
        city: home.city,
        state: home.state,
        price: home.price,
        imageUrl: home.imageURLs || null 
    }));
    res.json(homepageData);
});

// Route: /details/:id - Return full details by id
app.get("/details/:id", (req, res) => {
    const homeId = req.params.id;
    const home = housingData.find(home => home.id === homeId);

    if (home) {
        res.json(home);
    } else {
        res.status(404).json({ error: "Home not found" });
    }
});

// Route: /featured - Return only featured homes
app.get("/featured", (req, res) => {
    const featuredHomes = housingData.filter(home => home.featured === 'true' || home.featured === true);
    const featuredData = featuredHomes.map(home => ({
        id: home.id,
        address: home.address,
        city: home.city,
        state: home.state,
        price: home.price,
        thumbnail: home.thumbnail || null
    }));
    res.json(featuredData);
});

// Route: /search?query=...
app.get("/search", (req, res) => {
    const query = req.query.query?.toLowerCase();

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    const results = housingData.filter(home =>
        (home.address && home.address.toLowerCase().includes(query)) ||
        (home.city && home.city.toLowerCase().includes(query)) ||
        (home.state && home.state.toLowerCase().includes(query))
    ).map(home => ({
        id: home.id,
        address: home.address,
        city: home.city,
        state: home.state,
        price: home.price,
        thumbnail: home.thumbnail || null
    }));

    res.json(results);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
