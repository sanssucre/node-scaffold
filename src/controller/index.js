const assert = require('assert');
const express = require('express');

module.exports = (configs, assembly, service = express()) => {
  return {
    start() {
      const port = configs.serviceConfigs.port || 3000;
      service.listen(port, () => {
        console.log('running on port', port);
    });
    },
  };
};
