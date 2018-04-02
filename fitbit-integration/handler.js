'use strict';
const IOTA = require('iota.lib.js');
// should be usable by anyone if they git clone and add in API keys

// Create IOTA instance with host and port as provider
var iota = new IOTA({
  'provider'  : 'https://potato.iotasalad.org:14265',
  'sandbox'   :  true,
  'token'     : 'EXAMPLE-TOKEN-HERE'
});

// sample seed for development
const emochiSeed = "9MOOTWDLTRXRYRERMY9SA9RTFFTDDCYO9DVMUFAJCHZEUTMPGVQNHFH9OKVBZKAGSPX9RWSJTTRPLZEVE";

const fitbitData = {
  activity: "running",
  heartRate: 89
};

const makeTransfer = (address) => (value) => (message) => ({
  'address': address,
  'value': 100,
  // 'tag': '',
  'message': 'ODGABDPCADTCGADBGANBCDADXCBDXCZCGAQAGAADTCGDGDPCVCTCGADBGAWBMDEAUCXCFDGDHDEAADTCGDGDPCVCTCEAGDTCBDHDEAKDXCHDWCEASBYBCCKBSAGAQD'
});

const toTrytes = (data) => iota.utils.toTrytes(JSON.stringify(data));

const getNewAddress = (seed) => (callback, options = {}) =>
  iota.api.getNewAddress(seed, options, callback);

const sendTransfer = (seed) => (transfers, cb) => {
  // iota.sendTransfer also does iota.prepareTransfer and iot.attachTangle
  console.log('send tx', transfers);
  // IOTA fails here. Most test net nodes do not allow attachTangle() and 
  iota.api.sendTransfer(seed, 4, 18, transfers, cb);
  // We send the transfer from this seed, with depth 4 and minWeightMagnitude 18
}

const prepareTransfer = (seed) => (inputs = [], options = {}) => (cb) => 
  iota.api.prepareTransfers(seed, inputs, options, cb);

module.exports.fitbit = (event, context, callback) => {
  // console.log('IOTA', iota);
  // iota.attachToTangle()
  iota.api.getNodeInfo(function(error, success) {
    if (error) {
        console.error("Node Info Err", error);
    } else {
        console.log("Node Info Succ", success);
    }
  });
  const getNewEmochiAddress = getNewAddress(emochiSeed);

  const emochiAddress = getNewEmochiAddress((error, address) => {
    // console.log('get add', error, address);
                            //sending tx to my own addy
    sendTransfer(emochiSeed)([{address, message: toTrytes(fitbitData), value: 0}], (error, results) => {
      console.log('send transfer', error, results);
    });
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);
};
