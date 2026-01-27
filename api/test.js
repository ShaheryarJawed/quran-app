module.exports = (req, res) => {
    res.json({
        message: "Alive",
        time: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
};
