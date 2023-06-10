module.exports = (value) => {
    if (value.length === 64 && value.match(/^[0-9a-f]{64}$/)) return true;
    return false;
};
