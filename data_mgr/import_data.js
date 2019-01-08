let adapter = require('./data-adapter');

let sjcl = require('sjcl');

const {
  MongoDb,
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

let datas = adapter.getRecords();

CreditInquiryModel.init()
  .then(() => {

    for (var ind in datas) {
      datas[ind].personId = datas[ind].personId.toUpperCase()

      str_Val = JSON.stringify(datas[ind]);
      var bitArray = sjcl.hash.sha256.hash(str_Val);
      let digest_sha256 = sjcl.codec.hex.fromBits(bitArray);
      console.log(digest_sha256);

      datas[ind]['status'] = States.STATE_IMPORTED;
      datas[ind]['hash'] = digest_sha256;

      ((idx) => {
        //console.log(datas[idx])

        let new_record = new CreditInquiryModel(datas[idx]);
        new_record.save().then(() => {})
          .catch(error => {
            console.log('------save get error!')
            console.log(error);
            console.log('------save get error END!')
          });

      })(ind);

    }
  })
  .catch(error => {
    console.log(error);
  });