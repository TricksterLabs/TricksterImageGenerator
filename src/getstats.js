const fs = require('fs')
const axios = require('axios').default
const ini = require('ini')

const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

const URL = 'https://api.nft-maker.io/GetCounts/' + config.nftmaker.apiKey + '/' + config.nftmaker.projectId + '/'

async function GetStats() {
  try {
    const response = await axios.get(URL);
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
}

GetStats()