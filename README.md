# 🎥 Gigglle Challenge Backend (Node.js + Express.js)

This is a backend implementation for a simplified challenge submission flow used in the **Gigglle** app. It supports uploading videos, selecting stickers, previewing content, and submitting entries with simulated moderation. It also incorporates a frontend webpage / html using ejs to simplify testing the code. All the requests can be accessed from this frontend along with it being accessible by Postman requests. cURL have been stored in the curl.txt for speedy testing.

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/gigglle-backend.git
cd gigglle-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Server
```bash
node server.js
```
Server starts on `http://localhost:3000/`

### 4. Open `http://localhost:3000/` on web browser or test the api using Postman

## ✅ Features Completed

### 🔹 Core API Endpoints

#### `GET /challenges`
- Returns a list of 5 dummy challenges with `id`, `title`, `videoUrl`, and `stickers`

#### `POST /submissions`
**Accepts:**
- A video file (multipart/form-data)
- Stickers (string of emojis)
- Simulated video duration (`fileDuration`)

**Validates:**
- File existence
- File is of video type
- Duration ≤ 15 seconds

**Response:**
- Stores the submission in a mock in-memory moderation queue
- Responds with: "Submission pending review by moderator"

#### `GET /submissions`
- Returns all stored submissions in memory
- Includes randomly assigned `moderationStatus` (pending, approved, rejected)

### 🔹 Bonus Features Implemented

#### `POST /preview`
- Uploads a video
- Opens a preview page with an embedded video player
- Allows confirming the video (re-submits it to `/submissions` automatically)

#### Additional Features
- Delayed processing using middleware (2-second delay on submission)
- ASCII art printed on server startup
- Created a frontend to get have an easier look 

## ⚠️ Assumptions & Tradeoffs

- **File Duration** is simulated using a `fileDuration` field from the client. The actual video duration is not measured server-side.
- **Submissions** are stored disk not in memory but can be changed to memory if required but restarting the server will clear all data.

## 📂 Folder Structure

```
├── src/
│   ├── uploads/           # Uploaded video files
│   ├── css/               # Stylesheets
│   ├── data/              # JSON for dummy challenges
│   ├── js/                # js files
│   ├── videos/            # Sample videos
│   └── routes/
│       └── apis.js        # All Express routes
├── views/
│   ├── index.ejs          # Home UI
│   └── preview.ejs        # Preview page
├── server.js              # Main app entrypoint
└── README.md              # This file
```

## 👤 Author


**Rohan Topno**  
GitHub: [@topno-dev](https://github.com/topno-dev)

---
