const { Configurations } = require('./configs');
const AppInit = require('./app');
const ControllerInit = require('./controller');

class Main {

  /**
   * Loads the external configuration if any and initializes the {@see Configurations}
   * @returns {Promise<*>}
   */
  async loadConfigs() {
    // Todo load env specific values
    return new Configurations();
  }

  async initDependencies(configurations) {
    return await AppInit(configurations);
  }

  async initControllers(configurations, assembly) {

  }

  async start() {
    const configs = await this.loadConfigs();
    const assembly = await this.initDependencies(configs);
    const controller = await this.initControllers(configs, assembly);
    return controller.start(); 
  }
}

module.exports = {
  Main,
};
