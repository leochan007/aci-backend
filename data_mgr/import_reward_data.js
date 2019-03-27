let adapter = require('./data-adapter');

let sjcl = require('sjcl');

const {
  MongoDb,
  RewardRecordSchema,
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

const RewardRecordModel = alphacar.db.model('reward_record', RewardRecordSchema, 'reward_record');

let datas = adapter.getRecords();

RewardRecordModel.init()
  .then(() => {

    console.log('typeof:', typeof(datas));

    //console.log('datas:', datas);

    console.log('---------------------');

    //let data = datas['Sheets']['Sheet1'];
    let data = datas;

    for (var ind in data) {

      let newItem = {}
      
      for(var key in data[ind]) {
        newItem[key.trim()] = data[ind][key];
      }

      let str_Val = JSON.stringify(newItem);

      let bitArray = sjcl.hash.sha256.hash(str_Val);
      let digest_sha256 = sjcl.codec.hex.fromBits(bitArray);
      console.log(digest_sha256);

      newItem['status'] = States.STATE_IMPORTED;
      newItem['hash'] = digest_sha256;

      console.log('data:',  newItem);
      console.log('activityType:', newItem['activityType']);
      console.log('name:', newItem.name);

      ((newItem) => {

        let new_record = new RewardRecordModel(newItem);
        new_record.save().then(() => {
          console.log(new_record);
        })
          .catch(error => {
            console.log('------save get error!')
            console.log(error);
            console.log('------save get error END!')
          });

      })(newItem);

    }
  })
  .catch(error => {
    console.log(error);
  });