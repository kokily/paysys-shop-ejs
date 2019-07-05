import express from 'express';
import Product from '../models/Product';
import co from 'co';

const api = express.Router();

// 상품 상세보기 (GET) '/products/:id'
api.get('/:id', function (req, res) {
	var getData = co(function* () {
		return {
			product: yield Product.findOne({'id': req.params.id}).exec()
		}
	});

	getData.then(result => {
		res.render('products/detail', {
			title: '품목 세부정보 보기',
			product: result.product
		});
	});
});

export default api;