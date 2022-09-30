const fs = require('fs')
const ini = require('ini')
const mergeImages = require('merge-images')
const { Canvas, Image } = require('canvas')
const fg = require('fast-glob');

const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))
const policyID = config.project.policyID

function generateTraits(obj, array) {
  for (let [key, value] of Object.entries(obj)) {
    for (let i = 0; i < value; i++) {
      array.push(key)
    }
  }
}

function fetchTrait(trait) {
  randomNumber = Math.floor(Math.random() * trait.length)
  chosenAttribute = trait[randomNumber]
  trait.splice(randomNumber, 1)
  return chosenAttribute
}

let startId = Number.parseInt(config.project.minId)
let endId = 0

async function mainLoop(p0) {
  let folders = fg.sync('./input/' + p0 + '/*', { onlyFiles: false, onlyDirectories: true, unique: true, deep: 1 });
  // console.log(folders)
  let filesArray = []
  let traits = {}
  folders.forEach((x, i) => {
    subfolders = fg.sync(x + "/**", { onlyFiles: true, onlyDirectories: false, unique: true, deep: 1 });
    files = {}
    filesArray = []
    subfolders.forEach((y, w) => {
      rarity = y.replace(x + "/", "").slice(0, 5)
      fileName = y.replace(x, "")
      files[fileName] = parseInt(rarity)
    })
    generateTraits(files, filesArray)
    traits[x] = filesArray
  })
  // console.log(filesArray)

  const counts = {};
  filesArray.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
  console.log(counts)


  categoryArray = Object.keys(traits)
  // console.log(categoryArray.length)
  mergeArray = []
  metadataArray = []

  let newMetadata = []
  function metadataEnum(name) {
    newMetadata = []
    metadataNewObject = {
      name: config.project.displayName + "@@" + name + "@@",
      image: "<ipfs_link>",
      mediaType: "<mime_type>"
    }
    for (let i = 0; i < metadataArray.length; i++) {
      name = metadataArray[i].name
      value = metadataArray[i].value
      Object.assign(metadataNewObject, { [`${name}`]: `${value}` })
    }
    return metadataNewObject

  }
  function metadata(name, b64) {
    return {
      "721": {
        "<policy_id>": {
          "<asset_name>": metadataEnum(name),
          version: "1.0"
        }
      }
    }
  }

  function digits(count) {
    let digitsCount = ""
    for (let i = 0; i < count; i++) {
      digitsCount = digitsCount + "0"
    }
    return digitsCount
  }

  function projectName(number) {
    let maxId = config.project.maxId
    if (number < 10) {
      return (digits(maxId.length - 1) + number)
    }
    if (number >= 10 && number < 100) {
      return (digits(maxId.length - 2) + number)
    }
    if (number >= 100 && number < 1000) {
      return (digits(maxId.length - 3) + number)
    }
    if (number >= 1000 && number < 10000) {
      return (digits(maxId.length - 4) + number)
    }
    if (number >= 10000 && number < 100000) {
      return (digits(maxId.length - 5) + number)
    }
  }

  function categoryLoop() {
    powerLevel = 0

    for (let a = 0; a < categoryArray.length; a++) {
      // console.log(categoryArray)
      chosenFolder = categoryArray[a]
      chosenFile = fetchTrait(traits[chosenFolder])
      // console.log(chosenFile)
      currentPowerLevel = parseInt(chosenFile.slice(-8, -4))
      powerLevel = powerLevel + currentPowerLevel
      newObject = new Object()
      newObject.src = chosenFolder + chosenFile
      metadataObject = new Object()
      metadataObject.name = chosenFolder.slice(14)
      if (config.project.powerLevel == "True") {
        metadataObject.value = chosenFile.slice(6, -9)
      } else {
        metadataObject.value = chosenFile.slice(6, -4)
      }
      // console.log(chosenFolder)
      metadataArray.push(metadataObject)
      mergeArray.push(newObject)
    }
    noneCount = metadataArray.filter(({ value }) => value === 'None').length
    if (noneCount == 0) {
      powerLevel = parseInt(powerLevel * 1.2)
      // console.log('0 bonus applied 20%')
    }

    if (noneCount == 2) {
      powerLevel = parseInt(powerLevel * 1.8)
      // console.log('2 bonus applied 80%')
    }
    if (config.project.powerLevel == "True") {
      powerLevelObject = new Object()
      powerLevelObject.name = "Power"
      powerLevelObject.value = powerLevel.toString()
      metadataArray.push(powerLevelObject)
    }

  }

  let traitsLength = traits[Object.keys(traits)[0]].length
  // console.log(traitsLength)
  endId = endId + traitsLength

  try {
    for (let i = startId; i <= endId; i++) {
      await categoryLoop()

      let b64 = await mergeImages(mergeArray, { Canvas: Canvas, Image: Image })
      fs.mkdir('./output/' + p0 + '/', { recursive: true }, (err) => {
        if (err) throw err;
      });
      console.log(p0, projectName(i), metadataArray)
      await fs.writeFileSync("./output/" + p0 + "/" + projectName(i) + ".png", b64.replace(/^data:image\/\w+;base64,/, ''), { encoding: 'base64' })
      await fs.writeFileSync("./output/" + p0 + "/" + projectName(i) + ".json", JSON.stringify(metadata(projectName(i), b64.replace(/^data:image\/\w+;base64,/, ''), { encoding: 'base64' })))

      console.log("////////////////////////////////////////////")
      mergeArray = []
      metadataArray = []
      startId = i

      if (startId == endId) {
        startId = startId + 1
        return
      }
    }
  }
  catch (err) {
    console.log(err)
  }
}

let individualFolders = fg.sync('./input/*', { onlyFiles: false, onlyDirectories: true, unique: true, deep: 1 })

// console.log(individualFolders.length)


async function theLoop() {
  for (let i = 0; i < individualFolders.length; i++) {
    await mainLoop(individualFolders[i].replace("./input/", ""))
  }
}

theLoop()