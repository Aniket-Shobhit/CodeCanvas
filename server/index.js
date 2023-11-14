const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.post("/compile", async (req, res) => {
    let code = req.body.code;
    let language = req.body.language;
    let input = req.body.input;

    const API_URL = process.env.API_URL;
    const API_KEY = process.env.API_KEY;
    const API_HOST = process.env.API_HOST;

    let data = {
        language,
        code,
        input,
        version: "latest",
    };

    const headers = {
        "content-type": "application/json",
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
    };

    try {
        const response = await axios.post(API_URL, data, {
            headers: headers,
        });
        res.send(response.data);
    } catch (e) {
        res.status(500).json({ error: "An error occurred" });
    }
});

app.get("/", (req, res) => {
    res.send("Hello there!");
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});
