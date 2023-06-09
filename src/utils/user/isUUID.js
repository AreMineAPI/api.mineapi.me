module.exports = (value) => {
    if (value.length === 32 && value.match(/^[0-9a-f]{32}$/)) return true;
    return false;
};
