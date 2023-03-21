const { SIZES } = require('./constants');

function createCharactersRange(ranges) {
  let result = '';
  for (const range of ranges) {
    const startCharCode = range.charCodeAt(0);
    const endCharCode = range.charCodeAt(1);
    for (let i = startCharCode; i <= endCharCode; i++) {
      result += String.fromCharCode(i);
    }
  }
  return result;
}

function createRandomString(...ranges) {
  const charactersRange = createCharactersRange(ranges);

  const length = Math.floor(Math.random() * (SIZES.string.max - SIZES.string.min + 1)) + SIZES.string.min;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charactersRange.charAt(Math.floor(Math.random() * charactersRange.length));
  }
  return result;
}

function getRandomItem(types) {
  const randomIndex = Math.floor(Math.random() * types.length);
  return types[randomIndex];
}

function getRandomNumber(minimum, maximum, isInteger = true) {
  if (isInteger) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  } else {
    return Math.random() * (maximum - minimum) + minimum;
  }
}

module.exports = { createRandomString, getRandomItem, getRandomNumber };