const { connect } = require('mongoose');
const config = require('../config.json');

connect(config.database.url, { useNewUrlParser: true, useUnifiedTopology: true });