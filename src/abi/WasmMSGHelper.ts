const WasmMSGHelper = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_contract",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_msg",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "amount",
          "type": "string"
        }
      ],
      "name": "genMsgExecuteContract",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_admin",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_codeID",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_label",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_msg",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "amount",
          "type": "string"
        }
      ],
      "name": "genMsgInstantiateContract",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_contract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_codeID",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_msg",
          "type": "string"
        }
      ],
      "name": "genMsgMigrateContract",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_wasmBytecode",
          "type": "bytes"
        },
        {
          "internalType": "string",
          "name": "_permission",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "genMsgStoreCode",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newAdmin",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_contract",
          "type": "address"
        }
      ],
      "name": "genMsgUpdateAdmin",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "a",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "b",
          "type": "string"
        }
      ],
      "name": "hashCompare",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_str",
          "type": "string"
        }
      ],
      "name": "stringToHexString",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    }
  ]


export default WasmMSGHelper