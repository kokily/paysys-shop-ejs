export default (req, res, next) => {
  if(!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    if(req.user.username === 'admin' ||
      req.user.username === '프론트' ||
      req.user.username === '김현성' ||
      req.user.username === '이준호' ||
      req.user.username === '마혜진' ||
      req.user.username === '최보람' ||
      req.user.username === '김대호' ||
      req.user.username === '정용태' ||
      req.user.username === '박지훈' ||
      req.user.username === '박찬현' ||
      req.user.username === '김용일'
    ) {
      return next();
    } else {
      res.send('<script>alert("누구냐 넌!!!");location.href="/"</script>')
    }
  }
};