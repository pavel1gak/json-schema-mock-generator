const TYPES = {
  integer: 'integer',
  number: 'number',
  string: 'string',
  boolean: 'boolean',
  null: 'null',
  object: 'object',
  array: 'array',
};
    
/**
    
    Just some limits and sizes to make data look good.
    Used for demo purposes and could be changed
    */
const SIZES = {
  [TYPES.array]: {min: 0, max: 50},
  [TYPES.string]: {min: 2, max: 10},
  [TYPES.number]: {min: -999999, max: 999999},
};
const PRIMITIVE_TYPES = [TYPES.integer, TYPES.number, TYPES.string, TYPES.boolean, TYPES.null];
    
module.exports = { TYPES, SIZES, PRIMITIVE_TYPES };