'use strict';

/**
 * Exports.
 */

module.exports = {
  crowdsale: {
    closingTime: Math.floor(new Date().getTime() / 1000) + 36000,
    initialRate: 19486,
    openingTime: Math.floor(new Date().getTime() / 1000) + 3600,
    postpones: [
      Math.floor(new Date().getTime() / 1000) + 36000,
      Math.floor(new Date().getTime() / 1000) + 36000
    ]
  },
  infura: {
    apiKey: '<your_infura_project_id>'
  },
  upbtc: {
    burnFee: 0,
    mintFee: 0
  },
  upeur: {
    burnFee: 0,
    mintFee: 0
  },
  upusd: {
    burnFee: 0,
    mintFee: 0
  },
  upxau: {
    burnFee: 0,
    mintFee: 0
  }
};
