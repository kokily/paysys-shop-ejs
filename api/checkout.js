import express from 'express';
import Checkout from '../models/Check';

const api = express.Router();

// 프론트 정보 전송
api.post('/', async (req, res) => {
	var totalAmount = 0;
	var cartList = {};
	var list = [];
	var { username, employee } = req.user;
	var { title, etc, hall } = req.body;

	if (title === '') {
		title = 'No Title';
	};

	if (etc === '') {
		etc = '특이사항 없음';
	};

	if (typeof(req.cookies.cartList) !== 'undefined') {
		var cartList = JSON.parse(unescape(req.cookies.cartList));

		for (var key in cartList) {
			totalAmount += parseInt(cartList[key].amount);
			list.push(cartList[key]);
		}
	}

	Checkout.create({
		totalAmount,
		cartList: list,
		username,
		employee,
		title,
		etc,
		hall
	}, (err, check) => {
		if (err) res.json(err);

		console.log(list);

		res.clearCookie('cartList');
		res.redirect('/cart');
	});
});

export default api;