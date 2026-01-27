const fs = require('fs');
const path = require('path');

// Mock window object
global.window = {};

// Read the dashboard_data.js file
const dashboardDataPath = path.join(__dirname, '../dashboard_data.js');
const fileContent = fs.readFileSync(dashboardDataPath, 'utf8');

// EXECUTE the file content to populate window.DASHBOARD_DATA
// We wrap it in a try-catch and eval it
try {
    eval(fileContent);
    const data = window.DASHBOARD_DATA;

    // Add a mock users array for the auth feature
    data.users = [];

    // Write to db.json
    const outputPath = path.join(__dirname, 'data', 'db.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log("Migration Success: db.json created at", outputPath);

} catch (err) {
    console.error("Migration Failed:", err);
}
