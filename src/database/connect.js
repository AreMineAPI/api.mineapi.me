const { connect } = require("mongoose");
const config = require("../config.js");

connect(config.database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
