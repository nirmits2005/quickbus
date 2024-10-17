const db = require('../models');
const Users = db.users;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([]);
  },

  down: async (queryInterface, Sequelize) => {},
};
