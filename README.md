# mm-dapp-react
metamask dapp react demo for evm to wasm


## Prerequisites
- Node.js version 18+
- npm version 9+
- A text editor (for example, VS Code)
- The MetaMask extension installed
- Basic knowledge of JavaScript and React


## Develop Steps
### 1. Set up the project

Set up a new project using Vite, React, and TypeScript, by running the following command:
```
npm create vite@latest mm-dapp-react -- --template react-ts
```

Install the node module dependencies:
```
cd mm-dapp-react && npm install
```

### 2. add evm to wasm code
install web3js
```
npm install web3

```
in code
```
// In Node.js use: const Web3 = require('web3');
import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
```

## Use Steps









