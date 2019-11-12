
const Confirm = require('prompt-confirm');

module.exports = {
  async confirm(network, name, fn) {
    if (['mainnet', 'ropsten'].includes(network) && !await new Confirm(`Please connect the ${name} Ledger. Ready? [Y/n]`).run()) {
      throw new Error('Cancelled by user');
    }

    await fn();

    if (['mainnet', 'ropsten'].includes(network) && !await new Confirm('Please connect the deploy Ledger. Ready? [Y/n]').run()) {
      throw new Error('Cancelled by user');
    }
  },

  decodeAccounts([
    deployAddress,
    crowdsalePool,
    ecosystem,
    partners,
    stakeholders,
    treasury,
    crowdsaleOwner,
    whitelister,
    crowdsaleBeneficiary,
    upbtcOwner,
    upbtcFeeBeneficiary,
    upbtcRequestsOwner,
    upbtcRequestsStorageOwner,
    upbtcMintRequester,
    upbtcMintFulfiller,
    upbtcBurnRequester,
    upbtcBurnFulfiller,
    upusdFeeBeneficiary,
    upusdOwner,
    upusdRequestsOwner,
    upusdRequestsStorageOwner,
    upusdMintRequester,
    upusdMintFulfiller,
    upusdBurnRequester,
    upusdBurnFulfiller,
    upeurBurnFulfiller,
    upeurBurnRequester,
    upeurFeeBeneficiary,
    upeurMintFulfiller,
    upeurMintRequester,
    upeurOwner,
    upeurRequestsOwner,
    upeurRequestsStorageOwner,
    proxyTokenRegistryOwner
  ]) {
    return {
      crowdsaleBeneficiary,
      crowdsaleOwner,
      crowdsalePool,
      deployAddress,
      ecosystem,
      partners,
      proxyTokenRegistryOwner,
      stakeholders,
      treasury,
      upbtcBurnFulfiller,
      upbtcBurnRequester,
      upbtcFeeBeneficiary,
      upbtcMintFulfiller,
      upbtcMintRequester,
      upbtcOwner,
      upbtcRequestsOwner,
      upbtcRequestsStorageOwner,
      upeurBurnFulfiller,
      upeurBurnRequester,
      upeurFeeBeneficiary,
      upeurMintFulfiller,
      upeurMintRequester,
      upeurOwner,
      upeurRequestsOwner,
      upeurRequestsStorageOwner,
      upusdBurnFulfiller,
      upusdBurnRequester,
      upusdFeeBeneficiary,
      upusdMintFulfiller,
      upusdMintRequester,
      upusdOwner,
      upusdRequestsOwner,
      upusdRequestsStorageOwner,
      whitelister
    };
  }
};
