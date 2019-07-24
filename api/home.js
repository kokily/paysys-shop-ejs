import express from 'express';
import Product from '../models/Product';
import loginRequired from '../libs/login-required';

const api = express.Router();

// 홈 인덱스 (GET) '/'
api.get('/', (req, res) => {
  res.render('home/index', {
    title: '행사전표 시스템에 오신 것을 환영합니다.'
  });
});

// 현역 메뉴 (GET) '/soldier'
api.get('/soldier', loginRequired, (req, res) => {
  Product.find({'native': '현역'}).distinct('division').exec()
    .then((products) => {
      res.render('home/soldier', {
        title: '현역 전표 메뉴',
        products
      });
    }).catch(err => console.error(err.stack));
});

// 현역 세부 메뉴 (GET) '/soldier/menu/:id'
api.get('/soldier/menu/:id', loginRequired, (req, res) => {
  Product.find({'native': '현역', 'division': req.params.id})
    .sort({"id": 1}).exec()
    .then((products) => {
      res.render('home/menu', {
        title: '현역 세부 메뉴표',
        products
      });
    }).catch(err => console.error(err.stack));
});

// 예비역 메뉴 (GET) '/reserve'
api.get('/reserve', loginRequired, (req, res) => {
  Product.find({'native': '예비역'}).distinct('division').exec()
    .then((products) => {
      res.render('home/reserve', {
        title: '예비역 전표 메뉴',
        products
      });
    }).catch(err => console.error(err.stack));
});

// 예비역 세부 메뉴 (GET) '/reserve/menu/:id'
api.get('/reserve/menu/:id', loginRequired, (req, res) => {
  Product.find({'native': '예비역', 'division': req.params.id})
    .sort({"id": 1}).exec()
    .then((products) => {
      res.render('home/menu', {
        title: '예비역 세부 메뉴표',
        products
      });
    }).catch(err => console.error(err.stack));
});

// 일반 메뉴 (GET) '/general'
api.get('/general', loginRequired, (req, res) => {
  Product.find({'native': '일반인'}).distinct('division').exec()
    .then((products) => {
      res.render('home/general', {
        title: '일반 전표 메뉴',
        products
      });
    }).catch(err => console.error(err.stack));
});

// 일반 세부 메뉴 (GET) '/general/menu/:id'
api.get('/general/menu/:id', loginRequired, (req, res) => {
  Product.find({'native': '일반인', 'division': req.params.id})
    .sort({"id": 1}).exec()
    .then((products) => {
      res.render('home/menu', {
        title: '일반 세부 메뉴표',
        products
      });
    }).catch(err => console.error(err.stack));
});

export default api;