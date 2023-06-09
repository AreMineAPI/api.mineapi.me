module.exports = (req, res, next) => {
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    next();
    console.info(`[${req.method}]: ${req.url} - ${ip}`, "MineAPI");
};
