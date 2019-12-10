import express from 'express';
import aligoapi from 'aligoapi';
import Checkout from '../models/Check';
import loginRequired from '../libs/login-required';
import { sms_config } from '../libs/sms_config';

const api = express.Router();

const AuthData = sms_config;

// 프론트 정보 전송
api.post('/', loginRequired, async (req, res) => {
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

		const { username, title, hall } = check;

		req.body = {
			sender: '01027582139',
			receiver: "01027582139,01058112188,01050741229,01050765766",
			msg: `[${username}] 님께서 [${title}]전표를 전송하셨습니다. -[${hall}]`
		}

		aligoapi.send(req, AuthData)
			.then(r => console.log(r))
			.catch(e => console.log(e));

		res.clearCookie('cartList');
		res.redirect('/cart');
	});
});

export default api;