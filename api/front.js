import express from 'express';

import adminRequired from '../libs/admin-required';
import frontRequired from '../libs/front-required';
import loginRequired from '../libs/login-required';

import Checkout from '../models/Check';

const api = express.Router();

// 전표 리스트 조회 (GET) '/front'
api.get('/', frontRequired, (req, res) => {
	let page = Math.max(1, req.query.page);
	let limit = 10;
	let search = createSearch(req.query);

	Checkout.countDocuments(search.findPost)
		.then((count) => {
			let skip = (page - 1) * limit;
			let maxPage = Math.ceil(count/limit);

			Checkout.find(search.findPost).sort('-createdAt').skip(skip).limit(limit).exec()
				.then((checks) => {
					res.render('front/index', {
						title: '프론트 - 전표 전체 리스트',
						checks, page, maxPage, search
					});
				}).catch(err => console.error(err.stack));
		}).catch(err => console.error(err.stack));
});

// 전표 세부 현황 (GET) '/front/:id'
api.get('/:id', loginRequired, (req, res) => {
	Checkout.findOne({'id': req.params.id}).exec()
		.then((data) => {
			res.render('front/detail', {
				title: '전표 세부 현황',
				data
			});
		}).catch(err => console.error(err.stack));
})

// 전표 삭제 (DELETE) '/front/:id'
api.delete('/:id', adminRequired, (req, res) => {
	Checkout.findOneAndDelete({'id': req.params.id}).exec()
		.then(() => {
			res.redirect('/front');
		}).catch(err => console.error(err.stack));
});

// 사용자별 전표 조회 (GET) '/front/user/:id'
api.get('/user/:id', loginRequired, (req, res) => {
	Checkout.find({'employee': req.params.id})
		.sort({'id': -1}).limit(5).exec()
		.then((data) => {
			res.render('front/user', {
				title: '사용자별 전표 조회',
				data
			});
		}).catch(err => console.error(err.stack));
});

// 사용자별 전표 세부 조회 (GET) '/front/user/detail/:id'
api.get('/user/detail/:id', loginRequired, (req, res) => {
	Checkout.findOne({'id': req.params.id}).exec()
		.then((data) => {
			res.render('front/userDetail', {
				title: '사용자별 전표 세부 조회',
				data
			});
		}).catch(err => console.error(err.stack));
});

export default api;

// Method
function createSearch (queries) {
	var findPost = {};
	var highlight = {};

	if (queries.searchType && queries.searchText && queries.searchText.length >= 2) {
		var searchTypes = queries.searchType.toLowerCase().split(",");
		var postQueries = [];

		if (searchTypes.indexOf("title") >= 0) {
			postQueries.push({
				title: {
					$regex: new RegExp(queries.searchText, "i")
				}
			});
			highlight.title = queries.searchText;
		}

		if (searchTypes.indexOf("hall") >= 0) {
			postQueries.push({
				hall: {
					$regex: new RegExp(queries.searchText, "i")
				}
			});
			highlight.hall = queries.searchText;
		}

		if (searchTypes.indexOf("username") >= 0) {
			postQueries.push({
				username: {
					$regex: new RegExp(queries.searchText, "i")
				}
			});
			highlight.username = queries.searchText;
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