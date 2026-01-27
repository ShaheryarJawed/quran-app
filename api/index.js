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

// Handle both /api/test and /test to be safe
app.get(['/api/test', '/test'], (req, res) => {
    res.json({ status: "alive", time: new Date().toISOString() });
});

app.get(['/api/debug', '/debug'], (req, res) => {
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

app.get(['/api/daily-feed', '/daily-feed'], (req, res) => {
    const db = getDb();
    const cycleIndex = Math.floor(Date.now() / (12 * 60 * 60 * 1000));
    const dataIndex = cycleIndex % (db.daily ? db.daily.length : 1);
    res.json(db.daily?.[dataIndex] || {});
});

app.get(['/api/courses', '/courses'], (req, res) => {
    const db = getDb();
    res.json(db.courses || []);
});

app.get(['/api/topics', '/topics'], (req, res) => { res.json(getDb().topics || {}); });
app.get(['/api/duas', '/duas'], (req, res) => { res.json(getDb().duas || {}); });
app.get(['/api/seerah', '/seerah'], (req, res) => { res.json(getDb().seerah || []); });

// Mock Auth
app.post(['/api/auth/login', '/auth/login'], (req, res) => {
    res.json({ success: true, user: { name: req.body.username || "User", avatar: "SJ" } });
});

// Final Catch-All to debug routing issues
app.use((req, res) => {
    res.status(404).json({
        error: "Route Not Found",
        received_url: req.url,
        received_method: req.method,
        valid_routes: [
            "/api/test", "/test",
            "/api/daily-feed", "/daily-feed",
            "/api/courses", "/courses"
        ]
    });
});

module.exports = app;
