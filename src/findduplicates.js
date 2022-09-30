const crypto = require('crypto');
const fs = require('fs');
const fg = require('fast-glob');

let uploadArray = fg.sync('./finalOutput/images/**', { onlyFiles: true, onlyDirectories: false, unique: true, deep: 1 });

let hashArray = []

for (let i = 0; i < uploadArray.length; i++) {
  hashArray.push(generateHash(uploadArray[i]))
}

function generateHash(location) {
  const fileBuffer = fs.readFileSync(location)
  const hashSum = crypto.createHash('sha256')
  hashSum.update(fileBuffer)
  const hex = hashSum.digest('hex')
  return hex
}

const findDuplicates = (arr) => {
  let sorted_arr = arr.slice().sort(); // You can define the comparing function here.
  // JS by default uses a crappy string compare.
  // (we use slice to clone the array so the
  // original array won't be modified)
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  return results;
}

duplicates = findDuplicates(hashArray)

if (duplicates.length > 0) {
  console.log('Duplicates have been found: ', duplicates)
} else {
  console.log('No duplicates found')
}