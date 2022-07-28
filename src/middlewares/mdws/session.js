module.exports = (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log(ip);
    
    next();
};