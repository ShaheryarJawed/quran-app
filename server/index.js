const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from root

// Database Path
const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Helper to read DB
const getDb = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading DB:", err);
        return { daily: [], courses: [], users: [] };
    }
};

// --- API ROUTES ---

// 1. Daily Feed
app.get('/api/daily-feed', (req, res) => {
    const db = getDb();

    // Logic from dashboard_data.js (12h rotation)
    const cycleIndex = Math.floor(Date.now() / (12 * 60 * 60 * 1000));
    const dataIndex = cycleIndex % db.daily.length;

    const content = db.daily[dataIndex] || db.daily[0];
    res.json(content);
});

// 2. Courses List
app.get('/api/courses', (req, res) => {
    const db = getDb();
    res.json(db.courses || []);
});

// 3. Single Course Detail
app.get('/api/courses/:id', (req, res) => {
    const db = getDb();
    const course = db.courses.find(c => c.id === req.params.id);
    if (course) {
        res.json(course);
    } else {
        res.status(404).json({ error: "Course not found" });
    }
});

// 4. Topics
app.get('/api/topics', (req, res) => {
    const db = getDb();
    res.json(db.topics || {});
});

// 5. Duas
app.get('/api/duas', (req, res) => {
    const db = getDb();
    res.json(db.duas || {});
});

// 6. Seerah
app.get('/api/seerah', (req, res) => {
    const db = getDb();
    res.json(db.seerah || []);
});

// 7. Prayer Times (Proxy)
// In a real app, you'd fetch from Aladhan API server-side to hide keys or cache results.
// For now, client-side fetch is fine, but we'll add a placeholder if needed.

// --- AUTH MOCK ---
app.post('/api/auth/login', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username required" });

    // Mock Success
    res.json({
        success: true,
        token: "mock_jwt_token_" + Date.now(),
        user: {
            name: username,
            avatar: "SJ",
            joined: new Date().toISOString()
        }
    });
});

// Start Server only if running directly (not imported)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
        console.log(`API available at http://localhost:${PORT}/api/daily-feed`);
    });
}

module.exports = app;
