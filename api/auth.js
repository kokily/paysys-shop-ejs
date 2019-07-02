import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import passport from 'passport';
import passportLocal from 'passport-local';

import User from '../models/User';

mongoose.set('useCreateIndex', true);

const api = express.Router();
const LocalStrategy = passportLocal.Strategy;

// 비밀번호 해싱
function hash (password) {
  return crypto.createHash('sha512')
    .update(password + process.env.SALT_KEY)
    .digest('base64');
};

// 패스포트 메소드
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  const result = user;

  result.password = "";
  done(null, result);
});

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, username, password, done) {
  User.findOne({ username, password: hash(password) }, function(err, user) {
    if (!user) {
      return done(null, false, { message: '이름 또는 비밀번호 오류임다!' });
    } else {
      return done(null, user);
    }
  });
}));

// 로그인 처리 (POST) '/auth/login'
api.post('/login', passport.authenticate('local', {
  failureRedirect: '/',
  failureFlash: true
}), function(req, res) {
  res.redirect('/');
});

// 사원 등록 (GET) '/auth/register'
api.get('/register', (req, res) => {
  res.render('auth/register', {
    title: '사원 등록',
    user: ''
  });
});

// 사원 등록 처리 (POST) '/auth/register'
api.post('/register', (req, res) => {
  const { username, password, employee } = req.body;
  const user = new User({
    username, password: hash(password), employee
  });

  user.save()
    .then(() => {
      res.redirect('/')
    })
    .catch(e => console.error(e.stack));
});

// 로그아웃 처리 (GET) '/auth/logout
api.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default api;