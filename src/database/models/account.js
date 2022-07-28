const { Schema, model } = require('mongoose');

module.exports = model("accounts", new Schema({
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    token: { type: String, required: true },
    claimed: { type: Object, required: false, default: null },
}, {
    timestamps: true,
    versionKey: false
}));