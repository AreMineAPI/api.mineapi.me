const { Schema, model } = require("mongoose");

module.exports = model(
    "usernames",
    new Schema(
        {
            id: { type: String, required: true, default: "mineapi-null" },
            name: { type: String, required: true },
            downloads: { type: Number, required: true, default: 0 },
            texture: { type: String, required: true },
            isSlim: { type: Boolean, required: true, default: false },
            color: { type: Object, required: true },
            claimed: { type: Boolean, required: false, default: false },
            claimer: { type: String, required: false, default: null },
        },
        {
            timestamps: true,
            versionKey: false,
        }
    )
);
