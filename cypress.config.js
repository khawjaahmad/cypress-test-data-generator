const { defineConfig } = require('cypress');
const dataGenerator = require('./src/index');

module.exports = defineConfig({
  e2e: {
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      // Register every generator as a cy.task in one line.
      dataGenerator.registerTasks(on, config);
      return config;
    },
  },
});
