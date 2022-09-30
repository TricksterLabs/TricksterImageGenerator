const fs = require('fs')
const fg = require('fast-glob');
const axios = require('axios').default
const ini = require('ini');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');

const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

let uploadArray = fg.sync('./output/*.json', { onlyFiles: true, onlyDirectories: false, unique: true, deep: 1 });

const URL = 'https://api.nft-maker.io/UploadNft/' + config.nftmaker.apiKey + '/' + config.nftmaker.projectId + '/'

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

async function Upload(body) {
  try {
    const response = await axios.post(URL, body);
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
}

let toUpload = []

function batchLoop() {
  let uploadPromises = []
  for (let i = 0; i < toUpload.length; i++) {
    console.log("Uploading " + uploadArray[toUpload[i]])
    uploadPromises.push(Upload(JSON.parse(fs.readFileSync(uploadArray[toUpload[i]]))))
  }
  return uploadPromises
}

async function mainLoop() {
  try {
    for (let i = 0; i < uploadArray.length; i++) {
      toUpload.push(i)
      if ((toUpload.length / config.nftmaker.apiLimit) == 1) {
        await Promise.all(batchLoop())
        // await sleep(10100)
        toUpload = []
        continue
      }
    }
  }
  catch (err) {
    console.log(err)
  }
}

mainLoop()