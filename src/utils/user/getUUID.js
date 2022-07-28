const { default: axios } = require("axios");
const isUUID = require("./isUUID");

module.exports = async name => {
    let status;
    if (isUUID(name)) return { error: true, message: "Name is invalid." };

    const request = await axios({
        method: "GET",
        url: `https://api.mojang.com/users/profiles/minecraft/${name}`,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.data)
    .catch(err => { status = false });

    if(status === false) return { error: true, message: "Name is invalid." };

    if (!request) return null;
    if (request.error) {
        return null;
    } else {
        return request.id;
    }
}