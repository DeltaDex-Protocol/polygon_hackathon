import { PureComponent, useState, useEffect } from "react";
import { createPortal } from "react-dom";

// import styles of this component
import styles from "./Panel.module.css";

// import other component
import UserCard from "./UserCard/UserCard";
import ReplicationForm from "./UserInformation/ReplicationForm";
// import UserChangePassword from './UserChangePassword/old_myPositions'

// import other pkgs
import { UserEdit, Lock, ProfileCircle, Code1 } from "iconsax-react";
import { Row, Col, Button } from "react-bootstrap";
import PropTypes from "prop-types";

// import utils
import { getStorage, updateStorage } from "./../../utils/storage";
import {
  connectWallet,
  getCurrentWalletConnected,
} from "./../../utils/interact.js";
import Sidebar from "../Sidebar/Sidebar";
// import Header from "./../Header/Header.jsx";
// import TradingViewWidget, { Themes } from 'react-tradingview-widget';
// import Slider from "./../Slider/Slider.jsx";

// import {BSvanillaCall, deltaBSvanillaCall} from './../../utils/BSvanillaCall.js';
// import {BSvanillaPut, deltaBSvanillaPut} from './../../utils/BSvanillaPut.js';
// import {BScurvedPut, deltaBScurvedPut} from './../../utils/BScurvedPut.js';
// import {BScurvedCall, deltaBScurvedCall} from './../../utils/BScurvedCall.js';

import PriceChart from "./../Charts/PriceChart.jsx";

import AllPositions from "./../Positions/AllPositions.jsx";

import MyPositions from "./../Positions/MyPositions.jsx";

import VanillaForm from "../Forms/FormVanillaOptions";

import CurvesForm from "../Forms/FormCurvedOptions";


import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

import {settings} from './../../constants.js';

const Header = ({ walletAddress, connectPressed }) => {
  return (
    <div className="sticky top-0 flex justify-between z-10">
      <span className=" max-h-10 px-3 my-3 " ></span>
      <button
        className={`${settings.main_color} rounded ${settings.text_color} text-center  my-2 mx-2 `}
        onClick={connectPressed}
      >
        {/* <span className=''>Connected: 0x111...</span>
         */}
        {walletAddress !== "Not connected" ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
    </div>
  );
};

const UserAccountSidebar = ({ walletAddress }) => {
  return (
    <>
    <div class="relative rounded-xl bg-white shadow  py-12 px-20 flex flex-col ">

      <div className="flex absolute left-3 top-4 ">
        <span class="text-black font-medium  text-base w-10 mr-12 leading-tight">
          Your address
        </span>
        <Jazzicon
          className=""
          diameter={36}
          seed={jsNumberForAddress("0x11111111")}
        />
      </div>
      <span className="absolute left-3 top-16  text-sm">
        {walletAddress !== "Not connected" ? (
          <span className="">
            {String(walletAddress).substring(0, 6)}
            ...
            {String(walletAddress).substring(38)}
          </span>
        ) : (
          <span className="">Connect Wallet</span>
        )}
      </span>
    </div>
    </>
  );
};

const SidebarMenuInfos = {
  VanillaOptions: {
    label: "Vanilla options",
    description: "Replicate your vanilla option",
  },
  CurvedOptions: {
    label: "Curved options",
    description: "Hedge against impermanent loss",
  },
  YourPositions: {
    label: "Your positions",
    description: "Click to see your previous replications",
  },
  AllPositions: {
    label: "All positions",
    description: "View all open positions",
  },
};

const SidebarUnit = ({ Menu, onChangeToggle, toggle }) => {
  const bg_color = toggle === Menu ? settings.main_color : "bg-white";
  const text_color = toggle === Menu ? "text-white" : "text-black";

  return (
    <div
      className={`relative mt-6 rounded-xl ${bg_color} shadow py-12 px-20 flex flex-col`}
      onClick={() => onChangeToggle(Menu)}
    >
      <span
        className={`absolute left-3 top-3 ${text_color} font-medium text-lg`}
      >
        {SidebarMenuInfos[Menu].label}
      </span>
      <span
        className={`absolute left-3 top-11 ${text_color} font-normal leading-tight text-sm w-36`}
      >
        {SidebarMenuInfos[Menu].description}
      </span>
    </div>
  );
};

const Panel = ({ walletAddress, connectWalletPressed }) => {
  // console.log('panel:', walletAddress);

  const sidebarLinks = [
    {
      id: 1,
      border: true,
      text: "Replicate option",
      description: "Start the replication with arbitrary parameters",
      active: true,
    },
    {
      id: 2,
      border: true,
      text: "My positions",
      description: "Click to see your previous replications",
      active: false,
    },
    {
      id: 3,
      border: true,
      text: "All positions",
      description: "Check users' positions close to hedging",
      active: false,
    },
  ];

  const [toggle, setToggle] = useState("VanillaOptions");
  // const [walletAddress, setWallet] = useState("Not connected");
  // const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
  const [data, setData] = useState([]);

  const currentPrice =
    data[data.length - 1] === undefined ? 1000 : data[data.length - 1].value;


  const changeToggle = (toggle) => {
    setToggle(toggle);
  };

  useEffect(() => {
    const fetchData = async () => {
      const link =
        "https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=3d&limit=100";

      const response = await fetch(link);

      return response.json();
    };

    fetchData().then((_data) => {
      _data = _data.map((el) => {
        return {
          time: new Date(el[0])
            .toLocaleDateString("en-US")
            .split("/")
            .join("-"),
          value: (parseInt(el[1]) + parseInt(el[4])) / 2,
        };
      });

      setData(_data);
    });
  }, []);

  return (
    <div className={`w-full min-h-screen ${settings.main_bg}`}>
      <div className="relative max-w-6xl mx-auto pb-32">
        <Header
          walletAddress={walletAddress}
          connectPressed={connectWalletPressed}
        />


        <div className="flex justify-center space-x-10">
          
          <div className="flex flex-col space-y-10">
          
          <span className=" -mt-11 px-2 py-2 text-lg  rounded-lg bg-indigo-400 text-white mx-auto" >Volatility Smilers</span>

          <div class=" h-screen xl:inline mt-10">
            
            <UserAccountSidebar walletAddress={walletAddress} />

            <SidebarUnit
              Menu={"VanillaOptions"}
              onChangeToggle={setToggle}
              toggle={toggle}
            />
            <SidebarUnit
              Menu={"CurvedOptions"}
              onChangeToggle={setToggle}
              toggle={toggle}
            />
            <SidebarUnit
              Menu={"YourPositions"}
              onChangeToggle={setToggle}
              toggle={toggle}
            />
            <SidebarUnit
              Menu={"AllPositions"}
              onChangeToggle={setToggle}
              toggle={toggle}
            />
          </div>
        </div>


          <div className="mt-10 w-screen">
            {toggle === "VanillaOptions" && (
              <>
                <div className="flex justify-between">
                  <div className={`mb-5 px-4 py-2 ${settings.main_color} w-1/2 h-24 rounded-xl flex flex-col`}>
                    <span className="text-xl font-medium text-white mt-2">
                      Replicate your Vanilla option
                    </span>
                    <span className="text-base font-normal text-white">
                      Choose the parameters of the option you'd like to
                      replicate
                    </span>
                  </div>
                  <div className="">
                    <PriceChart className="" data={data} />
                  </div>
                </div>

                <div className="bg-white mr-5 rounded-lg xl:mr-0">
                  {/* <ReplicationForm data={data}/> */}
                  <VanillaForm currentPrice={currentPrice} />
                </div>
              </>
            )}
            {toggle === "CurvedOptions" && (
              <>
                <div className="flex justify-between">
                  <div className={`mb-5 px-4 py-2 ${settings.main_color} w-1/2 h-24 rounded-xl flex flex-col`}>
                    <span className="text-xl font-medium text-white mt-2">
                      Replicate your Curved option
                    </span>
                    <span className="text-base font-normal text-white">
                    Choose the parameters of the option and hedge against impermanent losses
                    </span>
                  </div>
                  <div className="">
                    <PriceChart className="" data={data} />
                  </div>
                </div>
                <div className="bg-white mr-5 rounded-lg xl:mr-0">
                  {/* <ReplicationForm data={data}/> */}
                  <CurvesForm currentPrice={currentPrice}/>
                </div>
              </>
            )}

            {toggle === "YourPositions" && (
              <>
                <div className={`mb-4 px-4 py-2 h-24 ${settings.main_color} w-1/2 rounded-xl flex flex-col`}>
                  <span className="text-xl mt-2 font-medium text-white">
                    Your positions
                  </span>
                  <span className="text-base font-normal text-white">
                    Here's the full list of your previous replications
                  </span>
                </div>
                <div className="">
                  <MyPositions />
                </div>
              </>
            )}

            {toggle === "AllPositions" && (
              <>
                <div className={`mb-4 px-4 py-2 ${settings.main_color} w-1/2 rounded-xl flex flex-col`}>
                  <span className="text-xl mt-2 font-medium text-white">
                    All positions
                  </span>
                  <span className="text-base font-normal text-white">
                    List of open positions of all users
                  </span>
                </div>
                <div className="">
                  <AllPositions />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// class Panel extends PureComponent {
//     constructor(props) {
//         super(props)

//         this.state = {

//             toggle: 'Replicate option',
//             walletAddress: "Not connected",
//             status: "",
//             name: "",
//             description: "",
//             url: "",
//             data: [],

//         }

//         this.sidebarLinks = [
//             {
//                 id: 1,
//                 border: true,
//                 text: 'Replicate option',
//                 description: 'Start the replication with arbitrary parameters',
//                 active: true,
//             },
//             {
//                 id: 2,
//                 border: true,
//                 text: 'My positions',
//                 description: 'Click to see your previous replications',
//                 active: false,
//             },
//             {
//                 id: 3,
//                 border: true,
//                 text: 'All positions',
//                 description: "Check users' positions close to hedging",
//                 active: false,
//             },
//         ]

//         this.changeToggle = this.changeToggle.bind(this)
//     }

//     connectWalletPressed = async () => {
//         const walletResponse = await connectWallet();
//         let address = walletResponse.address;

//         if (address) {
//             address = address.slice(0, 7) + "..." + address.slice(-6, );
//         }

//         this.setState({
//             status: walletResponse.status,
//             walletAddress: address
//         });

//   };

//     changeToggle(toggle) {
//         this.setState({ toggle })
//     }

//     render() {
//         return (
//             <>
//             <Header walletAddress={this.state.walletAddress} connectPressed={this.connectWalletPressed}/>
//             <div className={`${styles['panel-wrapper']}  px-5 `}>

//             <div className={`${styles['panel-wrapper']} d-flex`}>
//             <Sidebar
//                 username={"Your address"}
//                 userAddress={this.state.walletAddress}
//                 userProfile={this.state.walletAddress}
//                 sidebarLinks={this.sidebarLinks}
//                 onChangeToggle={this.changeToggle}
//             />

//                 <div className={`${styles.container} justify-content-center align-items-center p-0`}>
//                     <Row className={`${styles['panel']}  `}>

//                         <div className={`${styles['panel-column']} bg-white border mt-5 mt-md-0  p-5`}>
//                             {this.state.toggle === 'Replicate option' && (
//                                 <UserInformation />
//                             )}
//                             {this.state.toggle === 'My positions' && (
//                                 <UserChangePassword />
//                             )}
//                         </div>
//                     </Row>
//                 </div >

//             </div>
//             </div>
//             </>
//         )
//     }
// }

export default Panel;

