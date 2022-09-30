const fs = require('fs')
const ini = require('ini')
const mergeImages = require('merge-images')
const { Canvas, Image } = require('canvas')
const fg = require('fast-glob');

const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

let individualFolders = fg.sync('./output/*', { onlyFiles: false, onlyDirectories: true, unique: true, deep: 1 })
let allFolders = []
// let allFoldersLength = 0
for (let i = 0; i < individualFolders.length; i++) {
  eachFolder = fg.sync(individualFolders[i] + "/*.json", { onlyFiles: true, onlyDirectories: false, unique: true, deep: 1 })
  allFolders.push(...eachFolder)
  // console.log(eachFolder)
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

console.log('A total of ' + allFolders.length + ' have been randomized!')
// console.log(allFolders)

valueArray = Array.from(Array(allFolders.length).keys())
// console.log(valueArray)

function fetchId(id) {
  randomNumber = Math.floor(Math.random() * id.length)
  chosenAttribute = id[randomNumber]
  id.splice(randomNumber, 1)
  // console.log(chosenAttribute)
  // console.log(valueArray)
  return chosenAttribute
}

for (let i = 0; i < allFolders.length; i++) {
  let readFile = fs.readFile(allFolders[i], 'utf-8', function (err, contents) {
    if (err) {
      console.log(err);
      return;
    }

    // console.log(contents)
    let getId = projectName(fetchId(valueArray))


    let replaced = contents.replace(/\@@(.*?)\@@/g, getId);


    fs.mkdir('./finalOutput/images', { recursive: true }, (err) => {
      if (err) throw err;
    });
    fs.mkdir('./finalOutput/metadata', { recursive: true }, (err) => {
      if (err) throw err;
    });
    fs.writeFile('./finalOutput/metadata/' + getId + '.metadata', replaced, 'utf-8', function (err) {
      if (err) throw err;
      // console.log(i, 'File was copied to destination');
    });

    fs.copyFile(allFolders[i].replace('.json', '.png'), './finalOutput/images/' + getId + '.png', (err) => {
      if (err) throw err;
      // console.log('File was copied to destination');
    });
  })
}
