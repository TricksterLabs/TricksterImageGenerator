const fs = require('fs')
const fg = require('fast-glob');
const { get } = require('http');

let individualFolders = fg.sync('./input/*', { onlyFiles: false, onlyDirectories: true, unique: true, deep: 1 })

// Generate a function to store each subfolder from individualFolders
function getSubfolders(individualFolders) {
  let subfolders = []
  individualFolders.forEach((x, i) => {
    subfolders.push(fg.sync(x + "/*", { onlyFiles: false, onlyDirectories: true, unique: true, deep: 1 }))
  }
  )
  return subfolders
}

let subfolders = getSubfolders(individualFolders)

// Generate a function to store each file from each folder in subfolders
function getFiles(subfolders) {
  let files = []
  subfolders.forEach((x, i) => {
    let filesArray = []
    x.forEach((y, w) => {
      filesArray.push(fg.sync(y + "/*", { onlyFiles: true, onlyDirectories: false, unique: true, deep: 1 }))
    }
    )
    files.push(filesArray)
  }
  )
  return files
}

let files = getFiles(subfolders)

function getRarity(files) {
  let rarity = []
  files.forEach((x, i) => {
    let lastLast = []
    x.forEach((y, w) => {
      let lastValue = 0
      let lastFiles = []
      y.forEach((z, q) => {
        lastFiles.push(z.split("/").pop().slice(0, 4))
      })
      lastFiles.forEach((a, b) => {
        lastValue = lastValue + parseInt(a)
      })
      // console.log(lastValue)
      lastLast[w] = lastValue
    })
    rarity[i] = lastLast
    // console.log(lastLast)


  }
  )

  return rarity
}

let rarity = getRarity(files)

// console.log(rarity)

// Generate a function to check if all values in an array are equal to each other


function checkEqual(array) {
  let equal = true
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== array[0]) {
      equal = false
    }
  }
  return equal
}

for (let i = 0; i < rarity.length; i++) {
  console.log("//////////////////////////////////")
  console.log(i + 1, rarity[i])
  console.log("//////////////////////////////////")
  console.log(checkEqual(rarity[i]))
  console.log("//////////////////////////////////")
  console.log("                                  ")

  if (checkEqual(rarity[i]) === false) {
    console.log("There is something wrong with your numbers")
  }
}

// console.log(rarity.length)