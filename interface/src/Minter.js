import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "./utils/interact.js";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  const [addressToken0, setaddressToken0] = useState("");
  const [addressToken1, setaddressToken1] = useState("");
  const [token0Balance, setToken0Balance] = useState("");
  const [fees, setFees] = useState("");
  const [perDay, setPerDay] = useState("");

  const [strike, setStrike] = useState("");
  const [expiration, setExpiration] = useState("");
  const [riskFree, setRiskFree] = useState("");
  const [volatility, setVolatility] = useState("");
  const [meanReversion, setMeanReversion] = useState("");
  const [jumpDeviation, setJumpDeviation] = useState("");
  const [jumpIntensity, setJumpIntensity] = useState("");

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { success, status } = await mintNFT(
      addressToken0,
      addressToken1,
      token0Balance,
      fees,
      perDay,
      strike,
      expiration,
      riskFree,
      volatility,
      meanReversion,
      jumpDeviation,
      jumpIntensity
    );
    setStatus(status);
    if (success) {
      setName("");
      setDescription("");
      setURL("");
    }
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">Option Replication</h1>
      <p>
        Choose the parameters of the option you would like to replicate and
        click "Replicate Option"
      </p>
      <form id="option-form">
        <h2>🪙 Address token0: </h2>
        <input
          type="text"
          placeholder="DAI: 0x6B175474E89094C44Da98b954EedeAC495271d0F"
          onChange={(event) => setaddressToken0(event.target.value)}
        />
        <h2>🪙 Address token1: </h2>
        <input
          type="text"
          placeholder="WETH: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
          onChange={(event) => setaddressToken1(event.target.value)}
        />
        <h2> Amount token0: </h2>
        <input
          type="text"
          placeholder="i.e. 1500 DAI"
          onChange={(event) => setToken0Balance(event.target.value)}
        />
        <h2> Fees: </h2>
        <input
          type="text"
          placeholder="i.e. 200 DAI"
          onChange={(event) => setFees(event.target.value)}
        />
        <h2> Delta Hedge Per Day: </h2>
        <input
          type="text"
          placeholder="i.e. 4 times per day"
          onChange={(event) => setPerDay(event.target.value)}
        />
        <h2> Strike Price (K): </h2>
        <input
          type="text"
          placeholder="i.e. 1000 DAI"
          onChange={(event) => setStrike(event.target.value)}
        />
        <h2> Expiration Date (T): </h2>
        <input
          type="text"
          placeholder="Unix Timestamp 0.5 years => 5e17"
          onChange={(event) => setExpiration(event.target.value)}
        />
        <h2> Risk Free Rate (r): </h2>
        <input
          type="text"
          placeholder="10% => 1e17"
          onChange={(event) => setRiskFree(event.target.value)}
        />
        <h2> Volatility (sigma): </h2>
        <input
          type="text"
          placeholder="90% => 9e17"
          onChange={(event) => setVolatility(event.target.value)}
        />
        <h2> Mean Reversion Rate (m): </h2>
        <input
          type="text"
          placeholder="10% => 1e17"
          onChange={(event) => setMeanReversion(event.target.value)}
        />
        <h2> Standard Deviation of Jump (v): </h2>
        <input
          type="text"
          placeholder="10% => 1e17"
          onChange={(event) => setJumpDeviation(event.target.value)}
        />
        <h2> Intensity of Jump (lam): </h2>
        <input
          type="text"
          placeholder="10% => 1e17"
          onChange={(event) => setJumpIntensity(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Replicate Option
      </button>
      <p id="status" style={{ color: "red" }}>
        {status}
      </p>
    </div>
  );
};

export default Minter;
