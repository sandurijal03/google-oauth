import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import { default as connectMongo } from 'connect-mongo';
import methodOverride from 'method-override';

import connectDB from './config/db';

import mainRoutes from './apis/index';
import authRoutes from './apis/auth';
import storyRoutes from './apis/stories';

import { passportConf } from './config/passport';

const MongoStore = connectMongo(session);

let store = new MongoStore({
  url: 'mongodb://localhost:27017/oauth-node',
  collection: 'sessions',
});

// Passport config
passportConf(passport);

connectDB();

// initializing app and decfining port
const app = express();

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// meethod override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  }),
);

// handleBars helpers
import {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} from './helpers/hbs';

// handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine(
  '.hbs',
  exphbs({
    helpers: { formatDate, stripTags, truncate, editIcon, select },

    defaultLayout: 'main',
    extname: '.hbs',
  }),
);
app.set('view engine', '.hbs');

// session
app.use(
  session({
    secret: 'mkgmlkmflkfmlkmflkfmklfml',
    resave: false,
    saveUninitialized: false,
    store,
  }),
);

// pasport middleware
app.use(passport.initialize());
app.use(passport.session());

// set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/stories', storyRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('server is running on port ' + port));
