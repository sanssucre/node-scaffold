const assert = require('assert');
const ConnectorsInit = require('./connectors');
const LibInit = require('./lib');

/**
 * Initialises the connectors and then the lib
 * @param configurations of the env
 * @returns {Promise<*>}
 */
module.exports = async (configurations) => {
  assert(configurations, 'configurations is required');
  const connectors = await ConnectorsInit(configurations);
  return LibInit(configurations, connectors);
};
