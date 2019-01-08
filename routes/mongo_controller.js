const router = require('koa-router')();

const { aciService } = require('alphacarinquiry-commons');

router.get('/aci_api/creditinquiry/latest',async (ctx, next) => {
    ctx.response.type = 'json';
    await aciService.latestCreditInquiry(ctx);
    await next();
})

router.get('/aci_api/creditinquiry/hash/:hash', async (ctx, next) => {
    ctx.response.type = 'json';
    await aciService.getCreditInquiryByHash(ctx);
    await next();
})

router.get('/aci_api/creditinquiry/list', async (ctx, next) => {
    ctx.response.type = 'json';
    await aciService.getCreditInquiryList(ctx);
    await next();
})

router.get('/aci_api/creditinquiry/classification', async (ctx, next) => {
    ctx.response.type = 'json';
    await aciService.getCreditInquiryListByMoralCrisisType(ctx);
    await next();
})

router.post('/aci_api/creditinquiry/tx_count_lst', async (ctx, next) => {
    ctx.response.type = 'json';
    await aciService.getCreditInquiryTxCountList(ctx);
    await next();
})

module.exports = router;
