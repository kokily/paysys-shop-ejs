import express from 'express';

const api = express.Router();

// 카트 (GET) '/cart'
api.get('/', (req, res) => {
	var totalAmount = 0;
	var cartList = {};

	if (typeof(req.cookies.cartList) !== 'undefined') {
		var cartList = JSON.parse(unescape(req.cookies.cartList));

		for (var key in cartList) {
			totalAmount += parseInt(cartList[key].amount);
		}
	}

	res.render('cart/index', {
		title: '전표 확인 (종합)',
		cartList,
		totalAmount
	});
});

export default api;