const ChromeLauncher = require("chrome-launcher");
const fs = require(
    'fs'
)
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
  console.log("hey");
  const chrome = await ChromeLauncher.launch({
    startingUrl: "https://google.com",
    chromeFlags: ["--headless", "--disable-gpu"],
  });

  const userDataDirParam = chrome.process.spawnargs.find((a) =>
    a.includes("--user-data-dir=")
  );
  const stdErrFile = userDataDirParam.split("=")[1] + "/chrome-err.log";
  const stdErrStream = fs.createReadStream(stdErrFile);
  const wsEndpoint = await getWsEndpointFromStream(stdErrStream);
  stdErrStream.close();
  console.log(wsEndpoint);
})().then(console.log);
