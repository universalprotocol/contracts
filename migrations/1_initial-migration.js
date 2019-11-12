'use strict';

/**
 * Module dependencies.
 */

const Migrations = artifacts.require('./Migrations.sol');

/**
 * Exports.
 */

module.exports = deployer => {
  deployer.deploy(Migrations);
};
