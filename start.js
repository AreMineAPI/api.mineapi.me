require("cute-logs");
const { connection } = require("mongoose");

const startTime = Date.now();
require("./src/database/connect");
connection.on("connected", () => {
    console.success(
        `Mongoose connected to database. (${
            (Date.now() - startTime) / 1000
        } seconds)`,
        "MineAPI"
    );
    require("./src/index");
});
