const fetch = require("node-fetch");
const delay = require("yoctodelay");

const { API_KEY: key, GOOGLE_KEY: googlekey, PAGE_URL: pageurl } = process.env;

const fetchJson = url => fetch(url).then(data => data.json());

function sendCaptcha() {
  const reqUrl = `https://2captcha.com/in.php?key=${key}&method=userrecaptcha&googlekey=${googlekey}&pageurl=${pageurl}&json=1`;
  return fetchJson(reqUrl);
}

async function getCaptcha(id) {
  const reqUrl = `https://2captcha.com/res.php?key=${key}&action=get&id=${id}&json=1`;

  await delay(10000);
  const { request } = await fetchJson(reqUrl);
  if (request.includes("_NOT_READY")) {
    console.log(id, "captcha not ready");
    await delay(10000);
    return getCaptcha(id);
  }
  return request;
}

async function solveCaptcha() {
  const { request: solverId } = await sendCaptcha();
  console.log({ solverId });
  const solution = await getCaptcha(solverId);
  if (solution.includes("ERROR")) return solveCaptcha();
  return solution;
}

module.exports = solveCaptcha;
