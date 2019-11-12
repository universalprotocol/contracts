'use strict';

/**
 * Export `config`.
 */

module.exports = {
  crowdsale: {
    closingTime: 1554130800,
    initialRate: 13644,
    openingTime: 1551988800,
    postpones: [
      1555340400,
      1555686000
    ]
  },
  operators: {
    crowdsaleOwner: {
      mainnet: '0x9db219Da813b91bCCFDeC47A43bad3dC1dd2e3e8',
      ropsten: '0xd945733ecd402c5e955290eab620bc46b4e20680'
    },
    crowdsaleWhitelister: {
      mainnet: '0x92ccA7E48311abD06Aecae25C2eBaE74B272c2f3',
      ropsten: '0x4f37a529C659146Cca4C370F39fE7567bdB9F8bC'
    },
    proxyTokenRegistryOwner: {
      mainnet: '',
      ropsten: ''
    },
    upbtc: {
      burn: {
        fulfiller: {
          mainnet: '0x5155e9593973CaC956641328A81EdE1e140c27DB',
          ropsten: '0x4C996215a2acE0Dbd455DcBBe5bb01806C740be0'
        },
        requester: {
          mainnet: '0x340d693ED55d7bA167D184ea76Ea2Fd092a35BDc',
          ropsten: '0x7f87dDCc6dFe53ccECdfA0beba1b07F112FEcf98'
        }
      },
      mint: {
        fulfiller: {
          mainnet: '0x5155e9593973CaC956641328A81EdE1e140c27DB',
          ropsten: '0x4C996215a2acE0Dbd455DcBBe5bb01806C740be0'
        },
        requester: {
          mainnet: '0x340d693ED55d7bA167D184ea76Ea2Fd092a35BDc',
          ropsten: '0x7f87dDCc6dFe53ccECdfA0beba1b07F112FEcf98'
        }
      },
      owner: {
        mainnet: '0xA4C40E2c901AA485535D9bcBA793FA7B17e1bc0A',
        ropsten: '0x42983BeeE8861FD1B1ee291C9A34E248BBd5574D'
      },
      requestsOwner: {
        mainnet: '0x6D3B5f34Eb9ADbA1EfFCE9b363D28cFfCfFA51bC',
        ropsten: '0x3Ae94c7b7fd6473098D697E7d5f42E4eD87A59B1'
      },
      requestsStorageOwner: {
        mainnet: '0x292826c01E900e30593aA535976042C6b852abF0',
        ropsten: '0xB4CB489B982Ea3b3125D4F02DC5D0D2Edc7dfbAB'
      }
    },
    upeur: {
      burn: {
        fulfiller: {
          mainnet: '0x5155e9593973CaC956641328A81EdE1e140c27DB',
          ropsten: '0x4C996215a2acE0Dbd455DcBBe5bb01806C740be0'
        },
        requester: {
          mainnet: '0x340d693ED55d7bA167D184ea76Ea2Fd092a35BDc',
          ropsten: '0x7f87dDCc6dFe53ccECdfA0beba1b07F112FEcf98'
        }
      },
      mint: {
        fulfiller: {
          mainnet: '0x5155e9593973CaC956641328A81EdE1e140c27DB',
          ropsten: '0x4C996215a2acE0Dbd455DcBBe5bb01806C740be0'
        },
        requester: {
          mainnet: '0x340d693ED55d7bA167D184ea76Ea2Fd092a35BDc',
          ropsten: '0x7f87dDCc6dFe53ccECdfA0beba1b07F112FEcf98'
        }
      },
      owner: {
        mainnet: '0x75E4C2DEa3BE544327Dba3e38D5af5CB553AB7Dd',
        ropsten: '0x7C3B0E3FEC36ad02156e6940F9D577fC4A17703a'
      },
      requestsOwner: {
        mainnet: '0x6d6Ac82B7B4059d8F8c91845F82c0a7eaaaDfA88',
        ropsten: '0xE67C277B71E48a6465A6dBa9AE4a629F7eF417Bf'
      },
      requestsStorageOwner: {
        mainnet: '0x77a18E745A6E8e9E6a24f1B349fb9E530F072c26',
        ropsten: '0xcC01c0DB58C8dA536F3b741B0340842aF7fBD9AA'
      }
    },
    upusd: {
      burn: {
        fulfiller: {
          mainnet: '0x5155e9593973CaC956641328A81EdE1e140c27DB',
          ropsten: '0x4C996215a2acE0Dbd455DcBBe5bb01806C740be0'
        },
        requester: {
          mainnet: '0x340d693ED55d7bA167D184ea76Ea2Fd092a35BDc',
          ropsten: '0x7f87dDCc6dFe53ccECdfA0beba1b07F112FEcf98'
        }
      },
      mint: {
        fulfiller: {
          mainnet: '0x5155e9593973CaC956641328A81EdE1e140c27DB',
          ropsten: '0x4C996215a2acE0Dbd455DcBBe5bb01806C740be0'
        },
        requester: {
          mainnet: '0x340d693ED55d7bA167D184ea76Ea2Fd092a35BDc',
          ropsten: '0x7f87dDCc6dFe53ccECdfA0beba1b07F112FEcf98'
        }
      },
      owner: {
        mainnet: '0xd0F5032ae237B4a4e8de7C25437Bc893c1012a55',
        ropsten: '0xbBD87f58A960b932DE3675624116E3E3b1604D08'
      },
      requestsOwner: {
        mainnet: '0xfE04784A2999b9e16FC718A34E4e4B6544336748',
        ropsten: '0x22239e922bFAD52d6F509554a7D080bb82bA716B'
      },
      requestsStorageOwner: {
        mainnet: '0xEFb3580aC7d1870d1cE0b66E00a723d0D09816E8',
        ropsten: '0x0790Df08a20d9F1BC8A38bb82007134934b07f18'
      }
    }
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
  wallets: {
    upbtc: {
      feeBeneficiary: {
        mainnet: '0x825B9Bbd5De09528c8D1E405D83330161EF0aCf0',
        ropsten: '0x02850569a73702491bb232ac334a0b94f48bc4ed'
      }
    },
    upeur: {
      feeBeneficiary: {
        mainnet: '0x825B9Bbd5De09528c8D1E405D83330161EF0aCf0',
        ropsten: '0x02850569a73702491bb232ac334a0b94f48bc4ed'
      }
    },
    upt: {
      crowdsale: {
        beneficiary: {
          mainnet: '0x10A9Dd84Bc22c03e72637D0EB56849620928513e',
          ropsten: '0x249e72790858A6380566FD711B5ef2618Ad98945'
        },
        pool: {
          mainnet: '0xf87428C32A99AcE88f9b21dDE491aD682b233a96',
          ropsten: '0xa41C112e54a56cECFf036f39806503C5add5FDAf'
        }
      },
      ecosystem: {
        mainnet: '0xC5C0f815670BF57f88423614Cf913d558bdBa945',
        ropsten: '0xF011ffFbeB05d8d6FdE05393fbd50D316894AFDF'
      },
      partners: {
        mainnet: '0xEEE7A3F827C32C93011E33fd3ed4AB18855f041B',
        ropsten: '0x94A2430a63F1F8374C771383272bDeEA96CA4dca'
      },
      stakeholders: {
        mainnet: '0xc4A0A6639a73C79f66Cc00054B25EC2167E2D7b8',
        ropsten: '0xaC5Ed53d4547D1f46b145537Ed349774ff231eAb'
      },
      treasury: {
        mainnet: '0x825B9Bbd5De09528c8D1E405D83330161EF0aCf0',
        ropsten: '0x02850569a73702491bb232ac334a0b94f48bc4ed'
      }
    },
    upusd: {
      feeBeneficiary: {
        mainnet: '0x825B9Bbd5De09528c8D1E405D83330161EF0aCf0',
        ropsten: '0x02850569a73702491bb232ac334a0b94f48bc4ed'
      }
    }
  }
};
