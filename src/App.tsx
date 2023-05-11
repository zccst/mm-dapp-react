import './App.css'
import { useState, useEffect } from 'react'
import { formatBalance, formatChainAsNum } from './utils'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import SystemContractABI from './abi/SystemContract'
import WasmMSGHelperABI from './abi/WasmMSGHelper'
import WasmQueryHelperABI from './abi/WasmQueryHelper'
import Contract from 'web3-eth-contract'
import { TransactionReceipt } from 'web3-core'
import {Buffer} from "buffer";


const App = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)
  const initialState = { accounts: [], balance: "", chainId: "" }
  const [wallet, setWallet] = useState(initialState)

  const [isConnecting, setIsConnecting] = useState(false)  /* New */
  const [error, setError] = useState(false)                /* New */
  const [errorMessage, setErrorMessage] = useState("")     /* New */

  const [addDelta, setAddDelta] = useState("100");
  // const [subtractDelta, setSubtractDelta] = useState(1);
  const [loading, setLoading] = useState(false);
  // evm wasm related
  // 1. deploy
  const [depolyHash, setDepolyHash] = useState("")
  const [wasmAddr, setWasmAddr] = useState("")
  // 2. counter
  const [addHash, setAddHash] = useState("")
  const [counter, setCounter] = useState("0")

  let web3: Web3 | null = null;
  const rpcUrl = "https://exchaintestrpc.okex.org"
  const systemContractAddress = "0x0Ef7aEaAb483b5249Db8Adb120A59fd2CbB96a53"
  const wasmMSGHelperAddress = "0x2cC7065a1612249C9Db9C21B6030c91ab332b3Dc"
  const wasmQueryHelperAddress= "0x19520972be363b8a7a97cA548792206b93eAa2E0"
  let systemContract: Contract;
  let wasmMSGHelper: Contract;
  let wasmQueryHelper: Contract;

  let receipt: TransactionReceipt | null = null;

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts)
      } else {
        // if length 0, user is disconnected
        setWallet(initialState)
      }
    }

    const refreshChain = () => {
      // chainId: any
      window.location.reload();
      // setWallet((wallet) => ({ ...wallet, chainId }))
    }

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      setHasProvider(Boolean(provider))

      if (provider) {
        const accounts = await window.ethereum.request(
            { method: 'eth_accounts' }
        )
        refreshAccounts(accounts)
        window.ethereum.on('accountsChanged', refreshAccounts)
        window.ethereum.on("chainChanged", refreshChain)
      }
    }

    getProvider()

    const initContract = async () => {
      if (!web3) { // loads twice, don't know why
        // web3 = new Web3(new Web3.providers.HttpProvider("https://exchaintestrpc.okex.org"));
        // console.log('web3', web3);

        //init contract object
        // systemContract = new web3.eth.Contract(SystemContractABI as AbiItem[], systemContractAddress);
        
        // wasmQueryHelper = new web3.eth.Contract(WasmQueryHelperABI as AbiItem[], "0x19520972be363b8a7a97cA548792206b93eAa2E0");
        
        // console.log('systemContract', systemContract);
        // console.log('wasmMSGHelper', wasmMSGHelper);
        // console.log('wasmQueryHelper', wasmQueryHelper);
      }
    }
    initContract()

    return () => {
      window.ethereum?.removeListener('accountsChanged', refreshAccounts)
      window.ethereum?.removeListener("chainChanged", refreshChain)
    }
  }, [])

  const updateWallet = async (accounts: any) => {
    const balance = formatBalance(await window.ethereum!.request({
      method: "eth_getBalance",
      params: [accounts[0], "latest"],
    }))
    const chainId = await window.ethereum!.request({
      method: "eth_chainId",
    })
    setWallet({ accounts, balance, chainId })
  }

  const handleConnect = async () => {                   /* Updated */
    setIsConnecting(true)                               /* New */
    await window.ethereum.request({                     /* Updated */
      method: "eth_requestAccounts",
    })
    .then((accounts:[]) => {                            /* New */
      setError(false)                                   /* New */
      updateWallet(accounts)                            /* New */
    })                                                  /* New */
    .catch((err:any) => {                               /* New */
      setError(true)                                    /* New */
      setErrorMessage(err.message)                      /* New */
    })                                                  /* New */
    setIsConnecting(false)                              /* New */
  }

  const queryCounter = async () => {
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    wasmQueryHelper = new web3.eth.Contract(WasmQueryHelperABI as AbiItem[], wasmQueryHelperAddress);

    if (wasmAddr) {
      let query_data = await wasmQueryHelper.methods.genQuery(
        wasmAddr,
        '{"get_counter":{}}'
      ).call({from: wallet.accounts[0]})
      console.log("query_data", query_data)
      const final_str  = await systemContract.methods.query(query_data).call();
      const final_counter = JSON.parse(final_str)
      final_counter && setCounter(final_counter["data"])
      console.log('final_counter', final_counter, typeof final_counter);
    }
  }

  const deploy = async () => {
    setLoading(true)
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    wasmMSGHelper = new web3.eth.Contract(WasmMSGHelperABI as AbiItem[], wasmMSGHelperAddress);
    systemContract = new web3.eth.Contract(SystemContractABI as AbiItem[], systemContractAddress);
    const initData = await wasmMSGHelper.methods.genMsgInstantiateContract(
      wallet.accounts[0],
      843,
      "hello, world",
      "{}",
      "1"
    ).call({from: wallet.accounts[0]});
    console.log('initData', initData);
    const encodeData  = await systemContract.methods.invoke(initData).encodeABI();
    console.log('encodeData', encodeData);

    async function getWasmReceipt(txReceipt: TransactionReceipt) {
      let wasmResult = txReceipt.logs[0].data.slice(2)
      let json = Buffer.from(wasmResult, 'hex').toString('utf-8');
      let final_json = JSON.parse(json)
      return final_json[0].events;
    }

    window.ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: wallet.accounts[0], // The user's active address.
          to: systemContractAddress, // Required except during contract publications.
          value: '0x1', // Only required to send ether to the recipient from the initiating external account.
          // gasPrice: '0x09184e72a000', // Customizable by the user during MetaMask confirmation.
          // gas: '0x2710', // Customizable by the user during MetaMask confirmation.
          data: encodeData
        },
      ],
    })
    .then(async (txHash: any) => {
      // get receiption by hash, show to page.
      console.log(txHash)
      setDepolyHash(txHash)
      let intervalHandler = setInterval(async ()=>{
        if (!receipt) {
          web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
          receipt = await web3.eth.getTransactionReceipt(txHash);
          if (receipt) {
            const result = await getWasmReceipt(receipt)
            const info = result[2].attributes[0];
            setWasmAddr(info['value'])
            setLoading(false)
          }
          console.log('receipt', receipt && receipt.logs);
        } else {
          clearInterval(intervalHandler)
        }
      }, 1000);
    })
    .catch((error: any) => console.error(error));
  }


  const add = async () => {
    setLoading(true)

    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    wasmMSGHelper = new web3.eth.Contract(WasmMSGHelperABI as AbiItem[], wasmMSGHelperAddress);
    systemContract = new web3.eth.Contract(SystemContractABI as AbiItem[], systemContractAddress);
    wasmQueryHelper = new web3.eth.Contract(WasmQueryHelperABI as AbiItem[], wasmQueryHelperAddress);
    console.log(addDelta);
    const initData = await wasmMSGHelper.methods.genMsgExecuteContract(
      wasmAddr,
      '{"add":{"delta":"'+ addDelta +'"}}',
      "0"
    ).call({from: wallet.accounts[0]});
    console.log('initData', initData);
    const encodeData  = await systemContract.methods.invoke(initData).encodeABI();
    console.log('encodeData', encodeData);

    window.ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: wallet.accounts[0], // The user's active address.
          to: systemContractAddress, // Required except during contract publications.
          value: '0x1', // Only required to send ether to the recipient from the initiating external account.
          // gasPrice: '0x09184e72a000', // Customizable by the user during MetaMask confirmation.
          // gas: '0x2710', // Customizable by the user during MetaMask confirmation.
          data: encodeData
        },
      ],
    })
    .then(async (txHash: any) => {
      // get receiption by hash, show to page.
      console.log(txHash)
      setAddHash(txHash)
      let add_receipt: TransactionReceipt | null = null;
      let queryIntervalHandler = setInterval(async ()=>{
        if (!add_receipt) {
          web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
          add_receipt = await web3.eth.getTransactionReceipt(txHash);
          if (add_receipt) {
            await queryCounter()
            setLoading(false)
          }
          console.log('add_receipt', add_receipt);
        } else {
          clearInterval(queryIntervalHandler)
        }
      }, 1000);
    })
    .catch((error: any) => console.error(error));
  }
  const subtract = async () => {
    console.log('subtract');
  }

  const disableConnect = Boolean(wallet) && isConnecting

  return (
      <div className="App">
        <h1>Contract EVM to Wasm Demo</h1>
        <h2>Metamask Info</h2>
        <div>Injected Provider {hasProvider ? 'DOES' : 'DOES NOT'} Exist</div>

        {window.ethereum?.isMetaMask && wallet.accounts.length < 1 &&
        /* Updated */
        <button disabled={disableConnect} onClick={handleConnect}>Connect MetaMask</button>
        }

        {wallet.accounts.length > 0 &&
        <>
          <div>Wallet Accounts: {wallet.accounts[0]}</div>
          <div>Wallet Balance: {wallet.balance}</div>
          <div>Hex ChainId: {wallet.chainId}</div>
          <div>Numeric ChainId: {formatChainAsNum(wallet.chainId)}</div>
        </>
        }
        { error && (                                        /* New code block */
            <div onClick={() => setError(false)}>
              <strong>Error:</strong> {errorMessage}
            </div>
        )
        }

        <h2>Contract demo - addition and subtraction</h2>
        <div>Attention: only support OKTC Testnet !!!!!! </div>
        <div>
          <span>Step1: Deploy evm contract and convert to wasm</span>
          
          <button type="button" onClick={deploy}> Deploy</button>
          <span></span>
        </div>
        {depolyHash && (
            <div> Deploy success!  The txHash is: {depolyHash} </div>
          )
        }
        {wasmAddr && (
            <div> Get Wasm contract success! The address is: {wasmAddr} </div>
          )
        }
        

        
        { loading && <div>
            <img width="120" src="data:image/gif;base64,R0lGODlhyADIANU/AIaGhlLH05aWltfX16Kiov9RUf6Rs/1umuPj4+zs7MnJyfT09GSI6k126Ba1xP+zsv9ycXx8fJCq8P6pw7KysszY+Nbo97m5uSW5yP/j7P39/f/G13R0dI/b42xsbLnJ9rfo7f/a5Dxo5uT3+Pn5+eXr+//t7v59pfr9/qS58//w9f/6+vD0/fD6/P+Cgf71+BsfI0DCz/f5/lteYf/6/H6c7njU3UpOUaurq2ZmZsLCwr6+vpGRkoyMjJ3g5v///yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5RDMyRkMzMzNFRTQxMUU4OTI0M0FBOTYxNkJCNkVFMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5RDMyRkMzNDNFRTQxMUU4OTI0M0FBOTYxNkJCNkVFMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjlEMzJGQzMxM0VFNDExRTg5MjQzQUE5NjE2QkI2RUUzIiBzdFJlZjpk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" />
        </div>
        }

        <div> <strong>Current latest value: <span>{counter}</span></strong></div>
        

        <div>
          Step2: Add operation <input type="number" className='add' placeholder="请输入一个正整数" defaultValue={addDelta} onChange={event => setAddDelta(event.target.value)} />
          <button type="button" onClick={add}> Add </button>
        </div>
        {addHash && (
            <div> Add success!  The txHash is: {addHash} </div>
          )
        }
        <br></br><br></br><br></br><br></br>

        <div className='hidden'>
          Step3: Subtraction operation (1 each time) <button type="button" onClick={subtract}> Subtract </button> <br></br>
          (up to 0, otherwise an error will be raised)
        </div>

      </div>
  )
}

export default App