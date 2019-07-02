require('dotenv').config();

import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';

const app = express();
const MongoStore = connectMongo(session);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
.then(() => console.log('MongoDB Connected!!'))
.catch((err) => console.error(err.stack));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app
.use(express.static(__dirname + '/public'))
.use(morgan('dev'))
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: false }))
.use(methodOverride('_method'))
.use(cookieParser());

app.use('/static', express.static('static'));

app
.use(session({
  name: 'paysys_loginfo',
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 14 * 24 * 60 *60
  })
}))
.use(passport.initialize())
.use(passport.session())
.use(flash());

app.use(function(req, res, next) {
  app.locals.isLogin = req.isAuthenticated();
  app.locals.userData = req.user;
  next();
});

// Routes
import home from './api/home';
import auth from './api/auth';

app.use('/', home);
app.use('/auth', auth);

app.listen(process.env.PORT, () => console.log(`Express Server On ${process.env.PORT} PORT!!!`));