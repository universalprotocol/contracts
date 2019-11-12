'use strict';

/**
 * Export `config`.
 */

module.exports = {
  crowdsale: {
    closingTime: 'CROWDSALE_CLOSING_TIME',
    initialRate: 'CROWDSALE_INITIAL_RATE',
    openingTime: 'CROWDSALE_OPENING_TIME'
  },
  infura: {
    apiKey: 'INFURA_API_KEY'
  },
  operators: {
    crowdsaleOwner: {
      mainnet: 'OPERATORS_CROWDSALE_OWNER_MAINNET',
      ropsten: 'OPERATORS_CROWDSALE_OWNER_ROPSTEN'
    },
    crowdsaleWhitelister: {
      mainnet: 'OPERATORS_CROWDSALE_WHITELISTER_MAINNET',
      ropsten: 'OPERATORS_CROWDSALE_WHITELISTER_ROPSTEN'
    },
    proxyTokenRegistryOwner: {
      mainnet: 'OPERATORS_PROXY_TOKEN_REGISTRY_OWNER_MAINNET',
      ropsten: 'OPERATORS_PROXY_TOKEN_REGISTRY_OWNER_ROPSTEN'
    },
    upbtc: {
      burn: {
        fulfiller: {
          mainnet: 'OPERATORS_UPBTC_BURN_FULFILLER_MAINNET',
          ropsten: 'OPERATORS_UPBTC_BURN_FULFILLER_ROPSTEN'
        },
        requester: {
          mainnet: 'OPERATORS_UPBTC_BURN_REQUESTER_MAINNET',
          ropsten: 'OPERATORS_UPBTC_BURN_REQUESTER_ROPSTEN'
        }
      },
      mint: {
        fulfiller: {
          mainnet: 'OPERATORS_UPBTC_MINT_FULFILLER_MAINNET',
          ropsten: 'OPERATORS_UPBTC_MINT_FULFILLER_ROPSTEN'
        },
        requester: {
          mainnet: 'OPERATORS_UPBTC_MINT_REQUESTER_MAINNET',
          ropsten: 'OPERATORS_UPBTC_MINT_REQUESTER_ROPSTEN'
        }
      },
      owner: {
        mainnet: 'OPERATORS_UPBTC_OWNER_MAINNET',
        ropsten: 'OPERATORS_UPBTC_OWNER_ROPSTEN'
      },
      requestsOwner: {
        mainnet: 'OPERATORS_UPBTC_REQUESTS_OWNER_MAINNET',
        ropsten: 'OPERATORS_UPBTC_REQUESTS_OWNER_ROPSTEN'
      },
      requestsStorageOwner: {
        mainnet: 'OPERATORS_UPBTC_REQUESTS_STORAGE_OWNER_MAINNET',
        ropsten: 'OPERATORS_UPBTC_REQUESTS_STORAGE_OWNER_ROPSTEN'
      }
    },
    upeur: {
      burn: {
        fulfiller: {
          mainnet: 'OPERATORS_UPEUR_BURN_FULFILLER_MAINNET',
          ropsten: 'OPERATORS_UPEUR_BURN_FULFILLER_ROPSTEN'
        },
        requester: {
          mainnet: 'OPERATORS_UPEUR_BURN_REQUESTER_MAINNET',
          ropsten: 'OPERATORS_UPEUR_BURN_REQUESTER_ROPSTEN'
        }
      },
      mint: {
        fulfiller: {
          mainnet: 'OPERATORS_UPEUR_MINT_FULFILLER_MAINNET',
          ropsten: 'OPERATORS_UPEUR_MINT_FULFILLER_ROPSTEN'
        },
        requester: {
          mainnet: 'OPERATORS_UPEUR_MINT_REQUESTER_MAINNET',
          ropsten: 'OPERATORS_UPEUR_MINT_REQUESTER_ROPSTEN'
        }
      },
      owner: {
        mainnet: 'OPERATORS_UPEUR_OWNER_MAINNET',
        ropsten: 'OPERATORS_UPEUR_OWNER_ROPSTEN'
      },
      requestsOwner: {
        mainnet: 'OPERATORS_UPEUR_REQUESTS_OWNER_MAINNET',
        ropsten: 'OPERATORS_UPEUR_REQUESTS_OWNER_ROPSTEN'
      },
      requestsStorageOwner: {
        mainnet: 'OPERATORS_UPEUR_REQUESTS_STORAGE_OWNER_MAINNET',
        ropsten: 'OPERATORS_UPEUR_REQUESTS_STORAGE_OWNER_ROPSTEN'
      }
    },
    upusd: {
      burn: {
        fulfiller: {
          mainnet: 'OPERATORS_UPUSD_BURN_FULFILLER_MAINNET',
          ropsten: 'OPERATORS_UPUSD_BURN_FULFILLER_ROPSTEN'
        },
        requester: {
          mainnet: 'OPERATORS_UPUSD_BURN_REQUESTER_MAINNET',
          ropsten: 'OPERATORS_UPUSD_BURN_REQUESTER_ROPSTEN'
        }
      },
      mint: {
        fulfiller: {
          mainnet: 'OPERATORS_UPUSD_MINT_FULFILLER_MAINNET',
          ropsten: 'OPERATORS_UPUSD_MINT_FULFILLER_ROPSTEN'
        },
        requester: {
          mainnet: 'OPERATORS_UPUSD_MINT_REQUESTER_MAINNET',
          ropsten: 'OPERATORS_UPUSD_MINT_REQUESTER_ROPSTEN'
        }
      },
      owner: {
        mainnet: 'OPERATORS_UPUSD_OWNER_MAINNET',
        ropsten: 'OPERATORS_UPUSD_OWNER_ROPSTEN'
      },
      requestsOwner: {
        mainnet: 'OPERATORS_UPUSD_REQUESTS_OWNER_MAINNET',
        ropsten: 'OPERATORS_UPUSD_REQUESTS_OWNER_ROPSTEN'
      },
      requestsStorageOwner: {
        mainnet: 'OPERATORS_UPUSD_REQUESTS_STORAGE_OWNER_MAINNET',
        ropsten: 'OPERATORS_UPUSD_REQUESTS_STORAGE_OWNER_ROPSTEN'
      }
    }
  },
  upbtc: {
    burnFee: 'UPBTC_BURN_FEE',
    mintFee: 'UPBTC_MINT_FEE'
  },
  upeur: {
    burnFee: 'UPEUR_BURN_FEE',
    mintFee: 'UPEUR_MINT_FEE'
  },
  upusd: {
    burnFee: 'UPUSD_BURN_FEE',
    mintFee: 'UPUSD_MINT_FEE'
  },
  wallets: {
    upbtc: {
      feeBeneficiary: {
        mainnet: 'WALLETS_UPBTC_FEE_BENEFICIARY_MAINNET',
        ropsten: 'WALLETS_UPBTC_FEE_BENEFICIARY_ROPSTEN'
      }
    },
    upeur: {
      feeBeneficiary: {
        mainnet: 'WALLETS_UPEUR_FEE_BENEFICIARY_MAINNET',
        ropsten: 'WALLETS_UPEUR_FEE_BENEFICIARY_ROPSTEN'
      }
    },
    upt: {
      beneficiary: {
        mainnet: 'WALLETS_UPT_BENEFICIARY_MAINNET',
        ropsten: 'WALLETS_UPT_BENEFICIARY_ROPSTEN'
      },
      crowdsale: {
        beneficiary: {
          mainnet: 'WALLETS_UPT_CROWDSALE_BENEFICIARY_MAINNET',
          ropsten: 'WALLETS_UPT_CROWDSALE_BENEFICIARY_ROPSTEN'
        },
        pool: {
          mainnet: 'WALLETS_UPT_CROWDSALE_POOL_MAINNET',
          ropsten: 'WALLETS_UPT_CROWDSALE_POOL_ROPSTEN'
        }
      },
      ecosystem: {
        mainnet: 'WALLETS_UPT_ECOSYSTEM_MAINNET',
        ropsten: 'WALLETS_UPT_ECOSYSTEM_ROPSTEN'
      },
      partners: {
        mainnet: 'WALLETS_UPT_PARTNERS_MAINNET',
        ropsten: 'WALLETS_UPT_PARTNERS_ROPSTEN'
      },
      stakeholders: {
        mainnet: 'WALLETS_UPT_STAKEHOLDERS_MAINNET',
        ropsten: 'WALLETS_UPT_STAKEHOLDERS_ROPSTEN'
      },
      treasury: {
        mainnet: 'WALLETS_UPT_TREASURY_MAINNET',
        ropsten: 'WALLETS_UPT_TREASURY_ROPSTEN'
      }
    },
    upusd: {
      feeBeneficiary: {
        mainnet: 'WALLETS_UPUSD_FEE_BENEFICIARY_MAINNET',
        ropsten: 'WALLETS_UPUSD_FEE_BENEFICIARY_ROPSTEN'
      }
    }
  }
};
