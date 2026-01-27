const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Path Helper
const getDb = () => {
    try {
        // Try multiple paths to find the file in Vercel's weird environment
        const paths = [
            path.join(process.cwd(), 'server', 'data', 'db.json'), // Vercel expected
            path.join(process.cwd(), 'data', 'db.json'),
            path.join(__dirname, '..', 'server', 'data', 'db.json'),
            path.join(__dirname, 'data', 'db.json')
        ];

        for (const p of paths) {
            if (fs.existsSync(p)) {
                console.log("Found DB at:", p);
                return JSON.parse(fs.readFileSync(p, 'utf8'));
            }
        }
        console.error("DB NOT FOUND in paths:", paths);
        return { daily: [], courses: [] }; // Return empty structure
    } catch (err) {
        console.error("Error reading DB:", err);
        return { daily: [], courses: [] };
    }
};

// --- ROUTES ---

app.get('/api/test', (req, res) => {
    res.json({ status: "alive", time: new Date().toISOString() });
});

app.get('/api/debug', (req, res) => {
    const cwd = process.cwd();
    const paths = [
        path.join(cwd, 'server', 'data', 'db.json'),
        path.join(cwd, 'data', 'db.json')
    ];
    let listings = {};

    try { listings.cwd = fs.readdirSync(cwd); } catch (e) { }
    try { listings.server = fs.readdirSync(path.join(cwd, 'server')); } catch (e) { }

    res.json({
        cwd,
        env: process.env.NODE_ENV,
        pathsChecked: paths,
        listings
    });
});

app.get('/api/daily-feed', (req, res) => {
    const db = getDb();
    const cycleIndex = Math.floor(Date.now() / (12 * 60 * 60 * 1000));
    const dataIndex = cycleIndex % (db.daily ? db.daily.length : 1);
    res.json(db.daily?.[dataIndex] || {});
});

app.get('/api/courses', (req, res) => {
    const db = getDb();
    res.json(db.courses || []);
});

app.get('/api/topics', (req, res) => { res.json(getDb().topics || {}); });
app.get('/api/duas', (req, res) => { res.json(getDb().duas || {}); });
app.get('/api/seerah', (req, res) => { res.json(getDb().seerah || []); });

// Mock Auth
app.post('/api/auth/login', (req, res) => {
    res.json({ success: true, user: { name: req.body.username || "User", avatar: "SJ" } });
});

module.exports = app;
