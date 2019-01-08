const router = require('koa-router')();

router.get('/aci_api/index', async (ctx, next) => {
  ctx.response.type = 'json';
  ctx.response.body = { 'name': 'AlphaCar Credit Inquiry API', 'website': 'https://www.alphacario.com' };
})

router.get('/aci_api/greeting/:name', async (ctx, next) => {
  let name = ctx.params.name;
  ctx.response.body = "Hello, " + name + ". This is alphacario.com.";
})

module.exports = router;
