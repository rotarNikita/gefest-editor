const path = require('path');

const relativePathForBuild = 'http://gef.ststs.xyz/app/';

const NODE_ENV = process.env.NODE_ENV;
const DIRECTION = path.resolve(__dirname, '../');
const HASH = NODE_ENV === 'build' ? '.[hash]' : '';
const RELATIVE_PATH = NODE_ENV === 'build' ? relativePathForBuild : '/';

module.exports.NODE_ENV = NODE_ENV;
module.exports.DIRECTION = DIRECTION;
module.exports.HASH = HASH;
module.exports.RELATIVE_PATH = RELATIVE_PATH;