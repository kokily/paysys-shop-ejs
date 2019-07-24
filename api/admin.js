import express from 'express';
import adminRequired from '../libs/admin-required';

import Product from '../models/Product';
import User from '../models/User';

const api = express.Router();

/*
  상품 관련 API
    - list, create, update, delete
*/
// 상품 리스트 (GET) '/admin'
api.get('/', adminRequired, (req, res) => {
  let page = Math.max(1, req.query.page);
  let limit = 5;
  let search = createSearch(req.query);

  Product.countDocuments(search.findPost)
    .then((count) => {
      let skip = (page - 1) * limit;
      let maxPage = Math.ceil(count/limit);

      Product.find(search.findPost).sort('-createdAt').skip(skip).limit(limit).exec()
        .then((products) => {
          res.render('admin/index', {
            title: '상품 리스트',
            products, page, maxPage, search
          });
        })
        .catch(e => console.error(e.stack));
    })
    .catch(e => console.error(e.stack));
});

// 상품 등록 (GET) '/admin/new'
api.get('/new', adminRequired, (req, res) => {
  res.render('admin/new', {
    title: '상품 등록',
    product: ''
  });
});

// 상품 등록 처리 (POST) '/admin/new'
api.post('/new', adminRequired, (req, res) => {
  const { native, division, productName, price, unit } = req.body;
  const product = new Product({
    native, division, productName, price, unit
  });

  product.save()
    .then(() => {
      res.redirect('/admin/new');
    }).catch(err => console.error(err.stack));
});

// 상품 세부보기 (GET) '/admin/detail'
api.get('/detail/:id', adminRequired, (req, res) => {
  Product.findOne({'id': req.params.id}).exec()
    .then((product) => {
      res.render('admin/detail', {
        title: '상품 세부 정보보기',
        product
      });
    }).catch(err => console.error(err.stack));
});

// 상품 수정 페이지 (GET) '/admin/edit/:id'
api.get('/edit/:id', adminRequired, (req, res) => {
  Product.findOne({'id': req.params.id}).exec()
    .then((product) => {
      res.render('admin/edit', {
        title: '상품 정보 수정 페이지',
        product
      });
    }).catch(err => console.error(err.stack));
});

// 상품 수정 처리 (POST) '/admin/edit/:id'
api.post('/edit/:id', adminRequired, (req, res) => {
  Product.findOne({'id': req.params.id}).exec()
    .then(() => {
      const query = {
        native: req.body.native,
        division: req.body.division,
        productName: req.body.productName,
        price: req.body.price,
        unit: req.body.unit
      }

      Product.update({'id': req.params.id}, { $set: query })
        .then(() => {
          res.redirect('/admin/detail/' + req.params.id);
        }).catch(err => console.error(err.stack));
    }).catch(err => console.error(err.stack));
});

// 상품 삭제 처리 (GET) '/admin/delete/:id'
api.get('/delete/:id', adminRequired, (req, res) => {
  Product.remove({'id': req.params.id})
    .then(() => {
      res.redirect('/admin');
    }).catch(err => console.error(err.stack));
});

// 사용자 정보 (GET) '/admin/users'
api.get('/users', adminRequired, (req, res) => {
  User.find().sort({'id': -1}).exec()
    .then((users) => {
      res.render('admin/users', {
        title: '사용자 리스트',
        users
      });
    }).catch(err => console.error(err.stack));
});

export default api;

function createSearch (queries) {
  var findPost = {};
  var highlight = {};

  if (queries.searchType && queries.searchText && queries.searchText.length >= 2) {
    var searchTypes = queries.searchType.toLowerCase().split(",");
    var postQueries = [];

    if (searchTypes.indexOf("productname") >= 0) {
      postQueries.push({
        productName: {
          $regex: new RegExp(queries.searchText, "i")
        }
      });
      highlight.productName = queries.searchText;
    }

    if (searchTypes.indexOf("division") >= 0) {
      postQueries.push({
        division: {
          $regex: new RegExp(queries.searchText, "i")
        }
      });
      highlight.division = queries.searchText;
    }

    if (searchTypes.indexOf("native") >= 0) {
      postQueries.push({
        native: {
          $regex: new RegExp(queries.searchText, "i")
        }
      });
      highlight.native = queries.searchText;
    }

    if (postQueries.length > 0) findPost = { $or: postQueries };
  }

  return {
    searchType: queries.searchType,
    searchText: queries.searchText,
    findPost,
    highlight
  }
}