module.exports = (req, res) => {
    res.json({
        message: "Diagnostics",
        req_url: req.url,
        req_method: req.method,
        headers_host: req.headers.host,
        env_node: process.env.NODE_ENV
    });
};
