# 

## About
Extend the [WChicks token](https://github.com/SolChicks/chicks-bridge-contracts/blob/master/hardhat/contracts/WChicks.sol)
- Smart Contract
   - applied total_supply limit (10 billion) toggling by _mintingFinished flag
   - add fee percentage validation ( 90% >= fee percentage > 0%)
   - fix some bugs (type issue)
   - gas optimization
      - changed some function`s visibility from "public" to "external"
      - change transfer function (remove unnecessary validation)
- Front End
  - show the deployed token details
  - if connected account is not token owner, he can only transfer
  - if connected account is token owner, he can mint token, set service/presale address and set fee percentage
## Implement
- Smart Contract  
> Language: Solidity  
> Framework: Hardhat  
> Networks: Rinkeby(Testnet), Ethereum(Mainnet)  
> Unit Test: Hardhat, Chai

- Front End
> Language: React  
> Framework: Nextjs  
> Network: Rinkeby(Testnet)

## Installation
```shell
yarn install
```

## Usage

### 1. Environment variables
- Create a `.env` file in `pacakges/smart-contract` with its values (refer `.env.sample` file)
```
INFURA_API_KEY=[INFURA_API_KEY]
PRIVATE_KEY=[DEPLOYER_PRIVATE_KEY]
ETHERSCAN_API_KEY=[ETHER_SCAN_API_KEY]
REPORT_GAS=<true_or_false>
```
- Create a `.env` file in `pacakges/front-end` with its values (refer `.env.sample` file)
```
REACT_APP_NETWORK_URL=[NETWORK_RPC_URL]
REACT_APP_CHAIN_ID=[NETWORK_CHAIN_ID]
```

### 2. Build
Build Smart Contract
```shell
yarn build
```

### 3. Test
Unit Test in Smart Contract
```shell
yarn test
```

### 4. Deploy Contract
Deploy Smart Contract on ropsten testnet and publish the contract`s ABI to the Front End side, build Front End Code.

- Run Deploy Command
```shell
yarn deploy
```

### 5. Verify Contract
Verify contract with the deployed constract address

```shell
yarn verify <DEPLOYED_ADDRESS>
```

### 5. Run Front End
```shell
yarn start
```

## Result
Deployed [WChicks Contract at 0x776C6484Df043B2E97432ae8915745542F6ac9B3 on Ropsten(Testnet)](https://ropsten.etherscan.io/address/0x776C6484Df043B2E97432ae8915745542F6ac9B3)

- If the connected account is not owner  
<img width="1157" alt="Screenshot_2022-05-03_003805" src="https://user-images.githubusercontent.com/56865797/166290219-23c5a42c-feb5-47e7-97ef-43b0849ab6ed.png">

- If the connected account is owner  
  1. Token Details
<img width="1145" alt="Screenshot_2022-05-03_003717" src="https://user-images.githubusercontent.com/56865797/166290304-5cbd8abe-298f-47d4-bf79-496eabe053a2.png">
  2. Token functions 
<img width="1040" alt="Screenshot_2022-05-03_003657" src="https://user-images.githubusercontent.com/56865797/166290332-90c596d7-1adf-4425-a40f-15f9a7de6d04.png">
