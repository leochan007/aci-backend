const {
  MongoDb,
  ACIConfig,
  CreditInquirySchema,
  States
} = require('alphacarinquiry-commons');

const alphacar = new MongoDb('alphacar');

process.on('SIGINT', () => {
  alphacar.close();
})

alphacar.db.connection.on('error', () => {
  console.log('db got error! exit ...');
  process.exit(0);
});

alphacar.db.connection.on('close', () => {
  console.log('db closed! try to exit...');
  process.exit(0);
});

const CreditInquiryModel = alphacar.db.model('credit_inquiry', CreditInquirySchema, 'credit_inquiry');

const Eos = require('eosjs');

var arguments = process.argv.splice(2);

let needPush = false;

if (arguments.length > 0 && 'push' === arguments[0]) {
  needPush = true;
}

let keyProviders = ['5K3UUSU7aM5nUSg3UR9XoUHfDK53CuSXpwe2q3Y7x9WG4yMLQhj'];

if (process.env.EOSIO_PK != undefined && process.env.EOSIO_PK != '') {
  keyProviders = process.env.EOSIO_PK.split(' ')
}

const config = {
  chainId: ACIConfig.chainId, // 32 byte (64 char) hex string
  keyProvider: keyProviders,
  httpEndpoint: ACIConfig.eosio_http_url,
  expireInSeconds: 60,
  broadcast: true,
  verbose: false, // API activity
  sign: true
};

console.log(ACIConfig);
console.log(config);

//process.exit(0);

async function getImportedData() {

  let pipeline = [{
      $match: {
        '$or': [{
          status: States.STATE_IMPORTED
        }, {
          status: ''
        }]
      }
    },
    {
      $sort: {
        recordTime: 1
      }
    },
  ];

  const datas = await CreditInquiryModel.aggregate(pipeline).exec();

  return datas;

}

async function push2EOS(datas) {

  const eos = Eos(config);

  const eos_info = await eos.getInfo({});
  console.log('eos_info:', eos_info);

  let count = 0;

  for (var ind in datas) {

    count += 1;

    try {
      const eos_tx = await eos.transaction({
        actions: [{
          account: ACIConfig.eos_account,
          name: "insert",
          authorization: [{
            actor: ACIConfig.eos_account,
            permission: "active",
          }],
          data: {
            hash_val: datas[ind]['hash'],
          },
        }]
      });

      console.log("-------******----------------")
      console.log('EOS transaction_id:' + eos_tx['transaction_id'])

      const result_new = await CreditInquiryModel.findOneAndUpdate({
        hash: datas[ind]['hash']
      }, {
        status: States.STATE_PROCESSED,
        localTxId: eos_tx['transaction_id']
      }, {
        upsert: true,
        new: true
      }).exec();

      console.log('count:', count, " ", result_new);

    } catch (error) {
      console.log(error)
    }

  }

}

async function run() {

  await CreditInquiryModel.init();

  const datas = await getImportedData();

  console.log('datas:', datas);

  console.log('datas num:', datas.length);

  if (needPush) {
    console.log('need push datas to EOS blockchain !!!!');
    await push2EOS(datas);
  }

}

run().catch(error => console.error(error.stack));
