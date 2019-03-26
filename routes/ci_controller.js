const router = require('koa-router')();

const { ciService } = require('alphacarinquiry-commons');

router.get('/aci_api/creditinquiry/latest',async (ctx, next) => {
    ctx.response.type = 'json';
    await ciService.getLatestCreditInquiry(ctx);
    await next();
})

router.get('/aci_api/creditinquiry/hash/:hash', async (ctx, next) => {
    ctx.response.type = 'json';
    await ciService.getCreditInquiryByHash(ctx);
    await next();
})

router.get('/aci_api/creditinquiry/list', async (ctx, next) => {
    ctx.response.type = 'json';
    await ciService.getCreditInquiryList(ctx);
    await next();
})

router.get('/aci_api/creditinquiry/classification', async (ctx, next) => {
    ctx.response.type = 'json';
    await ciService.getCountGroupByMoralCrisisType(ctx);
    await next();
})

router.post('/aci_api/creditinquiry/tx_count_lst', async (ctx, next) => {
    ctx.response.type = 'json';
    await ciService.getCreditInquiryTxCountList(ctx);
    await next();
})

module.exports = router;
