const app = require('express')();
const glob = require('glob');
const path = require('path');
const config = require('./config.json');
const Middlewares = require('./middlewares');
const passport = require('passport');
const session = require('express-session');

app.set('trust proxy', 1);
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
}));

app.use(Middlewares.logger);
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use(passport.authenticate('session'));

app.use(require('cors')({
    origin: '*',
    credentials: true
}))


app.get('/', (req, res) => {
    res.redirect('/v1');
});

app.get('/v1/sessions', async (req, res) => {
    res.json({
        success: true,
        data: req.session
    });
});

glob('./src/routes/**/*.js', (err, files) => {
    files.forEach((file, index) => {
        const route = require(path.resolve(file));
        app.use('/v1', route);

        if (index === files.length - 1) {
            app.use((req, res) => {
                return res.status(404).json({
                    status: "error",
                    message: "404 - Page not found."
                });
            });
            Listen();
        }
    });
});

function Listen() {
    app.listen(config.port, () => {
        console.success('Server running on port ::' + config.port, "MineAPI");
    });
}