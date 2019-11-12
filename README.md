# Contracts

## UniversalProtocolToken.sol

Contract for the Universal Protocol Token (UPT).

### ERC20 details

| Name        | Decimals           | Total supply |
| ------------|-------------------:| ------------:|
| **Universal Protocol Token** | 18 | 10000000000 UPT |

## ProxyToken.sol

Contracts for the proxy tokens present in the Universal Protocol ecosystem.

### ERC20 details

| Name        | Decimals           | Total supply |
| ------------|-------------------:| ------------:|
| **Universal US Dollar** | 2 | - |
| **Universal Euro** | 2 | - |
| **Universal Bitcoin** | 8 | - |

### Contract Addresses

#### Mainnet
| Contract | Address |
| ---------|--------:|
| **Migrations** | `0xd6A2B1A8E9A1929212556481ECf1e50784de2fe3` |
| **UniversalBitcoin** | `0xc7461b398005e50BCc43c8e636378C6722E76c01` |
| **UniversalBitcoinRequestsStorageV0** | `0xE41b5f50550F0a7cCa457C512a97fE5B452a426a` |
| **UniversalBitcoinRequestsV0** | `0x9eE1001FF3577559B57D106197fFA65830f68bd5` |
| **UniversalEuro** | `0x6C103D85C15107Dce19F5a75fC746227e610AaBd` |
| **UniversalEuroRequestsStorageV0** | `0xe7D76A9502146aF8cd86474A36e18e0283A64D2f` |
| **UniversalEuroRequestsV0** | `0xAe2bbdd7396f72569bAda364Dd1EcD890f29E9EF` |
| **UniversalProtocolToken** | `0x6CA88Cc8D9288f5cAD825053B6A1B179B05c76fC` |
| **UniversalProtocolTokenCrowdsale** | `0xFCf7C5c299309e1701C2A5899E30805a038cDCFA` |
| **UniversalUSDollar** | `0x86367c0e517622DAcdab379f2de389c3C9524345` |
| **UniversalUSDollarRequestsStorageV0** | `0xC278B0236C349605eE80bBE7F6A641d7771212D1` |
| **UniversalUSDollarRequestsV0** | `0xAa426fcA98B352bBAd73A2BcEF7a1507E6056245` |

#### Ropsten
| Contract | Address |
| ---------|--------:|
| **Migrations** | `0x138e428116b7569c85968F445a37C57e4C95527e` |
| **UniversalBitcoin** | `0xA4EB4Fe3c95eBc00A5f56155B3d2B574Ebe1E878` |
| **UniversalBitcoinRequestsStorageV0** | `0xE6d7e6F82F5B71Dc458943584993D6D01Bfb0c8a` |
| **UniversalBitcoinRequestsV0** | `0x3Ec65974f055AB1827995D90bFC3d1537D904189` |
| **UniversalEuro** | `0x15EBC827C1060e677B8f3CbDcE4e9e8bdDb1294b` |
| **UniversalEuroRequestsStorageV0** | `0x309689333fDd09E8f1D99CBcA9dAb17eDb208A5b` |
| **UniversalEuroRequestsV0** | `0xA99B1f42D6113ABA2B259166EEA21465074D14f8` |
| **UniversalProtocolToken** | `0x325CA0B85DA8c41d8373f51e2301815feBadDb96` |
| **UniversalProtocolTokenCrowdsale** | `0x7ed0C0e5027A53CCa4B4A0A1BB16125c1aE2e3cD` |
| **UniversalUSDollar** | `0xd8Ee4632D1AC0a78A275760e220EdA025077b803` |
| **UniversalUSDollarRequestsStorageV0** | `0x1FaCeC3a13c555593824cB0CE0B6a736c65408ab` |
| **UniversalUSDollarRequestsV0** | `0x7B938dCDB921232AdE48304Dd2e6521d861065Cd` |

## Migrations

For deploying contracts [Truffle migrations](https://truffleframework.com/docs/truffle/getting-started/running-migrations) are used.

------

## Install

```shell
❯ yarn
```

------

## Test

```shell
❯ yarn start &
❯ yarn test
```

------

## Coverage

```shell
❯ yarn coverage
```

All contracts should have 100.0% code coverage.

------

## Deploy

### Development environment
```shell
❯ yarn start
❯ truffle deploy --network development
```

### Ropsten / Mainnet environments
Note: requires pre-configured Ledger Hardware Wallet.

```shell
❯ truffle deploy --network ropsten #Or replace with 'mainnet'
```
