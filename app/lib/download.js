const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function downloadImage(url, filename) {
  try {
    // Make HTTP GET request to fetch the image
    const response = await axios.get(url, {
      responseType: "arraybuffer", // Ensure that Axios fetches the data as a Buffer
    });

    // Define the path to save the image
    const filePath = path.join(__dirname, "../public", filename);

    // Write the image data to a file in the public folder
    fs.writeFileSync(filePath, response.data);

    console.log(`Image saved to ${filePath}`);
  } catch (error) {
    console.error(`Failed to download image: ${error.message}`);
  }
}

module.exports = {
  downloadImage,
};
