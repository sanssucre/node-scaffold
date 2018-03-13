const assert = require('assert');

const envInst = Symbol('Environment specific configuration instance');

/**
 * Default configurations
 */
const defaults = {
  service: {
    port: 3000,
  },
};

/**
 * Wrapper for configuration end points
 */
class Configurations {
  constructor(envConfigs = {}){
    this[envInst] = envConfigs;
  }

  /**
   * Service configurations
   * @returns {*|{port: number}|defaults.service|{port}}
   */
  get serviceConfigs() {
    return this[envInst].service || defaults.service;
  }
}

module.exports = {
  Configurations,
};
