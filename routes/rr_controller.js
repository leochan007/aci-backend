const router = require('koa-router')();

const { rrService } = require('alphacarinquiry-commons');

router.get('/aci_api/rewardrecord/latest',async (ctx, next) => {
    ctx.response.type = 'json';
    await rrService.getLatestRewardRecord(ctx);
    await next();
})

router.get('/aci_api/rewardrecord/hash/:hash', async (ctx, next) => {
    ctx.response.type = 'json';
    await rrService.getRewardRecordByHash(ctx);
    await next();
})

router.get('/aci_api/rewardrecord/list', async (ctx, next) => {
    ctx.response.type = 'json';
    await rrService.getRewardRecordListByActivityType(ctx);
    await next();
})

router.get('/aci_api/rewardrecord/groupinfo', async (ctx, next) => {
    ctx.response.type = 'json';
    await rrService.getRewardRecordGroupByActivityType(ctx);
    await next();
})

router.get('/aci_api/rewardrecord/classification', async (ctx, next) => {
    ctx.response.type = 'json';
    await rrService.getRewardRecordGroup(ctx);
    await next();
})

router.post('/aci_api/rewardrecord/tx_count_lst', async (ctx, next) => {
    ctx.response.type = 'json';
    await rrService.getRewardRecordTxCountList(ctx);
    await next();
})

module.exports = router;
