// Mock window object
global.window = {};

try {
    require('./dashboard_data.js');
    if (window.DASHBOARD_DATA && window.DASHBOARD_DATA.courses) {
        console.log("SUCCESS: Dashboard Data loaded. Found " + window.DASHBOARD_DATA.courses.length + " courses.");
        console.log("First course image: " + window.DASHBOARD_DATA.courses[0].image);
    } else {
        console.error("FAILURE: Dashboard Data loaded but courses are missing.");
    }
} catch (e) {
    console.error("CRITICAL: Syntax Error in dashboard_data.js");
    console.error(e.message);
}
