const fetch = require('node-fetch');
const delay = require('yoctodelay');
require('dotenv').config();

const {
  API_KEY: key, GOOGLE_KEY: googlekey, PAGE_URL: pageurl, SOLVE, RETRY,
} = process.env;

const fetchJson = url => fetch(url).then(data => data.json());

function sendCaptcha() {
  const reqUrl = `https://2captcha.com/in.php?key=${key}&method=userrecaptcha&googlekey=${googlekey}&pageurl=${pageurl}&json=1`;
  return fetchJson(reqUrl);
}

async function getCaptcha(id) {
  const reqUrl = `https://2captcha.com/res.php?key=${key}&action=get&id=${id}&json=1`;

  await delay(10000);
  const { request } = await fetchJson(reqUrl);
  if (request.includes('_NOT_READY')) {
    console.log({ id, status: request });

    await delay(10000);
    return getCaptcha(id);
  }
  return request;
}

async function solveCaptcha(retry = true) {
  const { request: id } = await sendCaptcha();
  console.log({ id });

  const solution = await getCaptcha(id);
  if (solution.includes('ERROR')) {
    if (retry) {
      console.log({ id, error: solution, retry });
      return solveCaptcha();
    }
  }
  return solution;
}

if (SOLVE) {
  // start instantly
  solveCaptcha(RETRY).then(console.log);
}

module.exports = solveCaptcha;
