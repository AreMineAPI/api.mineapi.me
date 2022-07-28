const { Schema, model } = require('mongoose');

module.exports = model("servers", new Schema({
    ip: { type: String, required: true },
    hostname: { type: String, required: true },
    version: { type: String, required: true },
    maxPlayers: { type: Number, required: true, default: 0 },
    onlinePlayers: { type: Number, required: true, default: 10 },
    motd: { type: Object, required: true, default: {} },
}, {
    timestamps: true,
    versionKey: false
}));