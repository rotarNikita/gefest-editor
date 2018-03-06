const path = require('path');

const NODE_ENV = process.env.NODE_ENV;
const DIRECTION = path.resolve(__dirname, '../');
const HASH = NODE_ENV === 'build' ? '.[hash]' : '';

module.exports.NODE_ENV = NODE_ENV;
module.exports.DIRECTION = DIRECTION;
module.exports.HASH = HASH;