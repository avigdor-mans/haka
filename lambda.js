const puppeteer = require("puppeteer");
const wsEndpoint = "ws://localhost:3001/lambda";
const fs = require('fs');

function getWsEndpointFromStream(stream) {
  return new Promise((resolve) => {
    let stderrContent = [];
    const handler = (data) => {
      stderrContent = stderrContent.concat(data);
      const content = stderrContent.toString().match(/\bws?:\/\/\S+/gi);
      if (content) {
        stream.removeListener("data", handler);
        resolve(content[0]);
      }
    };
    stream.on("data", handler);
  });
}

(async () => {
    // const userDataDirParam = chrome.process.spawnargs.find(a => a.includes('--user-data-dir='));
    // const stdErrFile = userDataDirParam.split('=')[1] + '/chrome-err.log';
    // const stdErrStream = fs.createReadStream(stdErrFile);
  const browser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint });
  const version = await browser.version();

  console.log(`Connected to: ${browser.wsEndpoint()} ${version}`);
  const page = await browser.newPage();
  await page.goto("http://example.com");
  await page.screenshot({ path: "example.png" });
  await browser.close();
})().then(console.log);
