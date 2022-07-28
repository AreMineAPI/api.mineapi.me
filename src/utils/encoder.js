const crypto = require('crypto');

module.exports = ({ value, length }) => {
    let values = value.split(',');
    let newValue = "";
    for (let i = 0; i < values.length; i++) {
        newValue += crypto.createHash('sha256').update(values[i]).digest('hex').substring(0, (length / values.length+1));
    }
    
    newValue += crypto.createHash('sha256').update(Math.random().toString(36).substring(2)).digest('hex').substring(0, (length / values.length+1));
    return newValue;
}