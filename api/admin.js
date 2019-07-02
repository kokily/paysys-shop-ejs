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
  let limit = 10;

  Product.countDocuments()
    .then((count) => {
      let skip = (page - 1) * limit;
      let maxPage = Math.ceil(count/limit);

      Product.find().sort('-createdAt').skip(skip).limit(limit).exec()
        .then((products) => {
          res.render('admin/index', {
            title: '상품 리스트',
            products, page, maxPage
          });
        })
        .catch(e => console.error(e.stack));
    })
    .catch(e => console.error(e.stack));
});

export default api;