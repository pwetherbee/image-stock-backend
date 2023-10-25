# Express Image Generator App

This is a simple Express.js application that generates images using the RunPod API, saves them locally in a `public` directory, and stores the image information in a SQLite database with an in-memory cache. When a user sends a POST request with a prompt, an image is generated based on that prompt, saved locally, and its information is stored in the database.

## Setup

1. **Installing Dependencies**:
    - Navigate to the `app/` directory from the terminal:
        ```bash
        cd app/
        ```
    - Install the necessary Node.js dependencies using npm:
        ```bash
        npm install
        ```

2. **Environment Configuration**:
    - Create a new file named `.env` in the `app/` directory.
    - Add the following line to the `.env` file, replacing `your_api_key_here` with your actual RunPod API key:
        ```plaintext
        RUNPOD_API_KEY=your_api_key_here
        ```

3. **Running the App**:
    - Still in the `app/` directory, start the app using the following command:
        ```bash
        node app.js
        ```

Now the app should be running on `http://localhost:3000`. You can send a POST request to `http://localhost:3000/generate` with a JSON body containing a `prompt` property to generate an image, and then access the list of all generated images by sending a GET request to `http://localhost:3000/images`.

## Features

- **Image Generation**: Generates images based on user-provided prompts using the RunPod API.
- **Local Image Storage**: Saves generated images locally in the `public` directory, which are served at the `/static` endpoint.
- **Database Storage**: Stores image information including the local file path and prompt in a SQLite database with an in-memory cache for quick access.
- **Image Retrieval**: Provides an endpoint to retrieve the list of all generated images and their information from the database.