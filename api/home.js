import express from 'express';

const api = express.Router();

// 홈 인덱스 (GET) '/'
api.get('/', (req, res) => {
  res.render('home/index', {
    title: '행사전표 시스템에 오신 것을 환영합니다.'
  });
});

export default api;