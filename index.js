const request = require('request-promise-native');

const url = process.argv[2];
const duration = process.argv[3];
const interval = process.argv[4];

let reqNum = 0;
let succNum = 0;

function twoDec(x) {
  return x < 10 ? `0${x}` : x;
}

function log(succ, msg) {
  const now = new Date();
  const time = `${now.getHours()}:${twoDec(now.getMinutes())}:${twoDec(now.getSeconds())}`;
  if (succ) {
    console.log(`${time} - ok (${succNum}/${reqNum})`);
  } else {
    console.error(`${time} - err (${succNum}/${reqNum}): ${msg}`);
  }
}

async function ping() {
  const endTime = Date.now() + duration * 1000;
  while (Date.now() < endTime) {
    await new Promise(resolve => setTimeout(resolve, interval * 1000));
    try {
      reqNum += 1;
      const res = await request({
        uri: url,
        json: true
      });
      if (res.msg === 'Hello World') {
        succNum += 1;
        log(true);
      } else {
        log(false, res);
      }
    } catch (error) {
      log(false, error);
    }
  }
}

ping().catch(console.error);