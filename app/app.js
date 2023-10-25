const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { downloadImage } = require("./lib/download");
const { initializeDatabase } = require("./lib/database");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database(":memory:");

// initialize database and create table
initializeDatabase(db);

const port = 3000;

app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(req.body);
    // Validate prompt
    if (!prompt || !typeof prompt === "string") {
      return res.status(400).send("Prompt is required");
    }
    console.log(`Generating image for prompt ${prompt}...`);

    // Fetch image from Runpod API
    const { data } = await axios.post(
      "https://api.runpod.ai/v2/stable-diffusion-v1/runsync",
      {
        input: {
          prompt: prompt,
          width: 512,
          height: 512,
          guidance_scale: 7.5,
          num_inference_steps: 50,
          num_outputs: 1,
          prompt_strength: 1,
          scheduler: "KLMS",
        },
      },
      {
        headers: {
          authorization: process.env.RUNPOD_API_KEY,
        },
      }
    );

    // generate UID for image
    const uid = Math.floor(Math.random() * 1000000);

    // download image to public folder
    await downloadImage(data.output[0].image, uid + ".png");

    // insert image into database

    db.run(
      `INSERT INTO images (url, prompt) VALUES (?, ?)`,
      [`/static/${uid}.png`, prompt],
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      }
    );

    console.log(data);

    res.send({
      image: `/static/${uid}.png`,
      prompt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/images", (req, res) => {
  const { search } = req.query;

  if (typeof search === "string" && search.length > 0) {
    const sql = "SELECT * FROM images WHERE prompt LIKE ?";
    db.all(sql, ["%" + search + "%"], (err, rows) => {
      if (err) {
        throw err;
      }
      console.log(rows);
      res.json(rows);
    });
    return;
  }

  const sql = "SELECT * FROM images";
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// Database cleanup
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Close the database connection.");
    process.exit(0);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
