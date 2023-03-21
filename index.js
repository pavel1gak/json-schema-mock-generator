const schema = require('./schema.json');
const { TYPES, PRIMITIVE_TYPES, SIZES } = require('./constants');
const { createRandomString, getRandomItem, getRandomNumber } = require('./utils');

const GENERATOR_BY_TYPE = {
  [TYPES.integer]: ({ minimum = SIZES.number.min, maximum = SIZES.number.max } = {}) => getRandomNumber(minimum, maximum),
  [TYPES.number]: ({ minimum = SIZES.number.min, maximum = SIZES.number.max } = {}) => getRandomNumber(minimum, maximum, false),
  [TYPES.string]: ({format, pattern} = {}) => {
    /**
     * Generates only random string in this format 'https:\\/\\/[a-z]+\\.corezoid\\.com\\/api\\/1\\/json\\/public\\/[0-9]+\\/[0-9a-zA-Z]+'
     *
     * FYI: If you need to generate string from any regex - you should use some complex solution, like randexp.js
     * @see https://github.com/fent/randexp.js/blob/master/README.md 
     */
    if (format === 'regex' && pattern) {
      return pattern.replaceAll('\\', '')
        .replaceAll('[a-z]+', createRandomString('az'))
        .replaceAll('[0-9]+', createRandomString('09'))
        .replaceAll('[0-9a-zA-Z]+', createRandomString('az', 'AZ', '09'));
    }

    // Set of common readable char codes provided in case of demonstration and could be changed
    return createRandomString(' ~');
  },
  [TYPES.boolean]: () => Math.random() < 0.5,
  [TYPES.null]: () => null,
  [TYPES.object]: ({properties, required} = {}) => {
    if (!properties) {
      return {};
    }
    return Object.entries(properties).reduce((accamulator, [propName, schema]) => {
      // Generating required props and randomly some unrequired
      if (required.includes(propName) || Math.random() < 0.5) {
        accamulator[propName] = generate(schema);
      }
      return accamulator;
    }, {});
  },
  [TYPES.array]: ({items, minItems = SIZES.array.min, maxItems = SIZES.array.max, uniqueItems} = {}) => {
    let length =  getRandomNumber(minItems, maxItems);
  
    if (uniqueItems && length > 1 && items?.type === 'null') {
      length = 1;
      console.error('Error: Incorrect schema provided. There can not be more then one null value with true option uniqueItems in array');
    }
  
    const hashMap = new Map();

    return Array.from({length}, () => {
      let value = generate(items);

      // If we got a duplicate and all values should be unique - regenerate value
      if (uniqueItems && hashMap.get(value)) {
        while(hashMap.get(value)) { value = generate(items); }
      }
  
      hashMap.set(value, true);
      return value;
    });
  },
};

function generate(schema = {}) {
  const template = findDefinition(schema.$ref) || schema;

  if (template.type) {
    return GENERATOR_BY_TYPE[template.type](template);
  }
  if (template.enum) {
    return getRandomItem(template.enum);
  }
  if (template.anyOf) {
    const anyOfTemplate = getRandomItem(schema.anyOf);
    return GENERATOR_BY_TYPE[anyOfTemplate.type](anyOfTemplate);
  }

  // If no details provided - make generation with some primitive types.
  return GENERATOR_BY_TYPE[getRandomItem(PRIMITIVE_TYPES)]();
}

// Save definitions if there is some
const definitions = schema.definitions;

function findDefinition(definitionId) {
  if (!definitionId || !definitions) {
    return null;
  }
  return Object.values(definitions).find(({$id}) => $id === definitionId);
}

// Generate a random object based on the schema
console.log('Resulting mock:\n', generate(schema));
