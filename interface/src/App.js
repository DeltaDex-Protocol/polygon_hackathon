import { useEffect, useState, useCallback } from 'react';

// import bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

// import my other component 
import Panel from './Components/Panel/Panel';

// import utils
import { getStorage } from './utils/storage';

import { connectWallet, getCurrentWalletConnected } from "./utils/interact.js";



const App = () => {

  const [toggle, setToggle] = useState('');

  const [walletAddress, setWallet] = useState("Not connected");
  const [status, setStatus] = useState("");

    
  

  useEffect(() => {
    document.title = 'Volatility Smilers';
  });
  

  useEffect(() => {
    const func = async () => {
      const {address, status} = await getCurrentWalletConnected();
      console.log(status)
      if (address) {
        setWallet(address);
      }
      setStatus(status);
    }
    func();    
  }, [walletAddress])

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);

  };

  
  return (
      <>
      <Panel walletAddress={walletAddress} connectWalletPressed={connectWalletPressed}/>
      </>
  )
}

export  default App