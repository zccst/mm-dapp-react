const WasmQueryHelper = [
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
        }
      ],
      "name": "genQuery",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "pure",
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
  export default WasmQueryHelper