import { useState } from "react";

// import other component
import Titles from "./../Titles/Titles";
// import FormInput from "./../Forms/FormInput/FormInput";

// import other pkg
import { Form, Button } from "react-bootstrap";
// import { useFormik } from "formik";
import { string, object, ref } from "yup";

import {
  getUserPositions,
  getUserPositionsTable,
  getCurrentPositions,
} from "./../../utils/interact";

import Creatable, { useCreatable } from "react-select/creatable";
import DataGrid from "react-data-grid";
import { useEffect } from "react";

import { settings } from "../../constants";



const TokenOptions = [
  { label: "Black Scholes", value: "BSM" },
  { label: "Jump Diffusion Model", value: "JDM" },
  { label: "Heston Model", value: "HM" },
  { label: "SABR Model", value: "SABR" },
];

const columns = [
  { key: "id", name: "ID" },
  { key: "token0", name: "Token 1" },
  { key: "token1", name: "Token 2" },
  { key: "token0_balance", name: "Token 1 Balance" },
  { key: "token1_balance", name: "Token 2 Balance" },
  { key: "amount", name: "Initial Deposit" },
  { key: "expiry", name: "Time to expiry" },
  { key: "fees", name: "Fees" },
  { key: "lastHedge", name: "Last Hedge" },
  { key: "strike", name: "K" },
  { key: "T", name: "T" },
  { key: "r", name: "r" },
  { key: "sigma", name: "sigma" },
  { key: "lam", name: "lam" },
  { key: "m", name: "m" },
  { key: "v", name: "v" },
];

const defineAddresses = {
  "0x6B175474E89094C44Da98b954EedeAC495271d0F": "DAI",
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": "USDC",
  "0xdAC17F958D2ee523a2206206994597C13D831ec7": "USDT",
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": "WETH",
};

const GenerateRow = ({ row }) => {
  const [isVisible, setVisibility] = useState(false);
  // console.log(defineAddresses.)

  return (
    <>
      <tr
        className="hover:bg-indigo-100 text-center"
        id={row.id}
        onClick={() => setVisibility(!isVisible)}
      >
        <th scope="row" className="py-4 px-6">
          {row.id}
        </th>
        <td className="py-4 px-6">
          {defineAddresses[row.token0] + "-" + defineAddresses[row.token1]}
        </td>
        <th scope="row" className="py-4 px-6  ">
          <span className="font-normal">
            {parseFloat(row.token0_balance).toFixed(3)}
          </span>
        </th>
        <th scope="row" className="py-4 px-6 ">
          <span className="font-normal">
            {parseFloat(row.token1_balance).toFixed(3)}
          </span>
        </th>

        <td className="py-4 px-6">{row.isCall ? "call" : "put"}</td>
        <td className="py-4 px-6">{row.isLong ? "long" : "short"}</td>
        <td>{row.strike}</td>
        <td>
          {new Date(parseInt(row.expiry) * 1000)
            .toISOString()
            .slice(0, 10)
            .replace("T", " ")}
        </td>
        <td>
          {new Date(parseInt(row.lastHedge) * 1000).toISOString().slice(0, 10)}
        </td>
        <td className="py-4 px-3">
          <button
            className={`text-white rounded-lg ${settings.main_color} hover:${settings.hover_main_color}`}
            onClick={() => setVisibility(!isVisible)}
          >
            Show
          </button>
        </td>
      </tr>
      {isVisible !== false && (
        <>
          <tr className="bg-gray-100 text-center">
            <th scope="col" className="py-3 px-6">
              <span className="font-normal">fees</span>
              <br />
              <span className="font-normal">{row.fees}</span>
            </th>
            <th scope="col" className="py-3 px-6">
              <span className="font-normal">amount</span>
              <br />
              <span className="font-normal">
                {parseFloat(row.amount).toFixed(3)}
              </span>
            </th>
            <th scope="col" colspan="1" className="py-3 px-6 ">
              <span className="font-normal">hedge fee</span>
              <br />
              <span className="font-normal">
                {parseFloat(row.hedgeFee).toFixed(3)}{" "}
              </span>
            </th>
            <th scope="col" className="py-3 px-6">
              <span className="font-normal">hedges per day</span>
              <br />
              <span className="font-normal">{row.perday} </span>
            </th>
            <th />
            <th />
            <th />
            <th />
            <th />
            <th />
          </tr>
          <tr className=" bg-gray-100 text-center">
            <th scope="col" className="py-3 px-6">
              <span className="font-normal">model</span>
              <br />
              <span className="font-normal">{"jump diffusion"} </span>
            </th>
            <th scope="col" className="py-3 px-6">
              <span className="font-normal">lambda</span>
              <br />
              <span className="font-normal">
                {parseFloat(row.lam).toFixed(3)}
              </span>
            </th>
            <th scope="col" className="py-3 px-6">
              <span className="font-normal">m</span>
              <br />
              <span className="font-normal">
                {parseFloat(row.m).toFixed(3)}
              </span>
            </th>
            <th scope="col" className="py-3 px-6">
              <span className="font-normal">risk-free rate</span>
              <br />
              <span className="font-normal">
                {parseFloat(row.r).toFixed(3)}
              </span>
            </th>
            <th scope="col" className="py-3 px-6">
              <span className="font-normal">sigma</span>
              <br />
              <span className="font-normal">
                {parseFloat(row.sigma).toFixed(3)}
              </span>
            </th>
            <th scope="col" className="py-3 px-6">
              <span className="font-normal">nu</span>
              <br />
              <span className="font-normal">
                {parseFloat(row.v).toFixed(3)}
              </span>
            </th>
            <th />
            <th />
            <th />
            <th />
          </tr>
        </>
      )}
    </>
  );
};

// const rows = ({}) => getRows();

const rows = [{}];

// const rows = getUserPositionsTable();

const NewMyPositions = ({}) => {
  const [ReplicationModel, setReplicationModel] = useState("");

  const [tagInputValue, setTagInputValue] = useState("");
  const [tagValue, setTagValue] = useState("");

  const [rowData, setRowData] = useState([]);

  const [upd, setUpd] = useState(false);

  const [rowsExpanded, setExpandedRows] = useState({});

  useEffect(() => {
    const func = async () => {
      const rowData = await getUserPositions();
      console.log(rowData);
      setRowData(rowData);
    };
    func();
  }, [upd]);

  return <>123</>;
};

const MyPositions = ({}) => {
  const [ReplicationModel, setReplicationModel] = useState("");

  const [tagInputValue, setTagInputValue] = useState("");
  const [tagValue, setTagValue] = useState("");

  const [rowData, setRowData] = useState([
    {
        "id": 1,
        "token0": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "token1": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "token0_balance": "3421.33980166769563984",
        "token1_balance": "0.99703224623616558",
        "isCall": true,
        "isLong": true,
        "amount": "2.0",
        "expiry": "1668897330",
        "fees": "400.0",
        "perday": "8",
        "hedgeFee": "0.456621004566210045",
        "lastHedge": "1659436530",
        "strike": "1250.0",
        "T": "0.3",
        "r": "0.15",
        "sigma": "0.8",
        "lam": "0.7",
        "m": "0.9",
        "v": "0.8"
    },
    {
        "id": 2,
        "token0": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "token1": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "token0_balance": "155.431223481601663597",
        "token1_balance": "3.901245366506763864",
        "isCall": false,
        "isLong": true,
        "amount": "2.0",
        "expiry": "1675204534",
        "fees": "500.0",
        "perday": "9",
        "hedgeFee": "0.30441400304414003",
        "lastHedge": "1659436534",
        "strike": "2000.0",
        "T": "0.5",
        "r": "0.11",
        "sigma": "0.95",
        "lam": "0.9",
        "m": "1.1",
        "v": "1.2"
    },
    {
        "id": 3,
        "token0": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "token1": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "token0_balance": "3739.777488750432201502",
        "token1_balance": "0.795881148955852991",
        "isCall": true,
        "isLong": true,
        "amount": "1.0",
        "expiry": "1668897336",
        "fees": "400.0",
        "perday": "8",
        "hedgeFee": "0.456621004566210045",
        "lastHedge": "1659436536",
        "strike": "1400.0",
        "T": "0.3",
        "r": "0.15",
        "sigma": "0.8",
        "lam": "-",
        "m": "-",
        "v": "-"
    },
    {
        "id": 4,
        "token0": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "token1": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "token0_balance": "1758.624567089087964199",
        "token1_balance": "2.882653937496546764",
        "isCall": false,
        "isLong": true,
        "amount": "2.0",
        "expiry": "1675204538",
        "fees": "500.0",
        "perday": "9",
        "hedgeFee": "0.30441400304414003",
        "lastHedge": "1659436538",
        "strike": "2000.0",
        "T": "0.5",
        "r": "0.11",
        "sigma": "0.95",
        "lam": "-",
        "m": "-",
        "v": "-"
    },
    {
        "id": 5,
        "token0": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "token1": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "token0_balance": "8421.669386277311321916",
        "token1_balance": "0.996791441575063065",
        "isCall": true,
        "isLong": true,
        "amount": "1.0",
        "expiry": "1663076494",
        "fees": "100.0",
        "perday": "11",
        "hedgeFee": "0.221881359535886752",
        "lastHedge": "1659536519",
        "strike": "1300.0",
        "T": "0.11225188227241616",
        "r": "0.04",
        "sigma": "0.2",
        "lam": "-",
        "m": "-",
        "v": "-"
    },
    {
        "id": 6,
        "token0": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "token1": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "token0_balance": "3421.509699708968739796",
        "token1_balance": "0.996836207154485767",
        "isCall": true,
        "isLong": true,
        "amount": "1.0",
        "expiry": "1663076515",
        "fees": "100.0",
        "perday": "11",
        "hedgeFee": "0.221881359535886752",
        "lastHedge": "1659536540",
        "strike": "1300.0",
        "T": "0.11225188227241616",
        "r": "0.04",
        "sigma": "0.2",
        "lam": "-",
        "m": "-",
        "v": "-"
    },
    {
        "id": 7,
        "token0": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "token1": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "token0_balance": "3421.239572575855969671",
        "token1_balance": "0.996950699146425944",
        "isCall": true,
        "isLong": true,
        "amount": "1.0",
        "expiry": "1663080392",
        "fees": "100.0",
        "perday": "5",
        "hedgeFee": "0.488138990978950856",
        "lastHedge": "1659540417",
        "strike": "1250.0",
        "T": "0.11225188227241616",
        "r": "0.03",
        "sigma": "0.2",
        "lam": "-",
        "m": "-",
        "v": "-"
    },
    {
        "id": 8,
        "token0": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "token1": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "token0_balance": "3634.099688771614399421",
        "token1_balance": "0.862489196722757039",
        "isCall": true,
        "isLong": true,
        "amount": "1.0",
        "expiry": "1663080576",
        "fees": "100.0",
        "perday": "5",
        "hedgeFee": "0.488138990978950856",
        "lastHedge": "1659540601",
        "strike": "1250.0",
        "T": "0.11225188227241616",
        "r": "0.03",
        "sigma": "1.0",
        "lam": "4.0",
        "m": "2.0",
        "v": "3.0"
    },
    {
        "id": 9,
        "token0": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "token1": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "token0_balance": "3882.165856153184355272",
        "token1_balance": "0.705818127802235032",
        "isCall": true,
        "isLong": true,
        "amount": "1.0",
        "expiry": "1665843551",
        "fees": "100.0",
        "perday": "5",
        "hedgeFee": "0.274160255207355969",
        "lastHedge": "1659540668",
        "strike": "1350.0",
        "T": "0.1998631074606434",
        "r": "0.0",
        "sigma": "1.0",
        "lam": "4.0",
        "m": "2.0",
        "v": "3.0"
    },
    {
        "id": 10,
        "token0": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "token1": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "token0_balance": "920.866157825945180539",
        "token1_balance": "0.997042121669599494",
        "isCall": true,
        "isLong": true,
        "amount": "1.0",
        "expiry": "1659995421",
        "fees": "100.0",
        "perday": "2",
        "hedgeFee": "10.006849315068493517",
        "lastHedge": "1659563717",
        "strike": "300.0",
        "T": "0.013689253935660506",
        "r": "0.03",
        "sigma": "0.2",
        "lam": "-",
        "m": "-",
        "v": "-"
    }
]);

  const [upd, setUpd] = useState(false);

  const [rowsExpanded, setExpandedRows] = useState({});


  // useEffect(() => {
  //   const func = async () => {
  //     const rowData = await getUserPositions();
  //     console.log(rowData);
  //     setRowData(rowData);
  //   };
  //   func();
  // }, [upd]);

  return (
    <div className="overflow-x-auto relative sm:rounded-lg shadow-lg mb-8">
      <table className="text-sm shadow-lg max-w-4xl bg-white">
        <thead className={`text-xs ${settings.text_color} uppercase ${settings.hover_main_color} text-center`}>
          <tr>
            <th scope="col" className="py-3 px-6">
              Position id
            </th>
            <th scope="col" className="py-3 px-6">
              Option pair
            </th>
            <th scope="col" className="py-3 px-6">
              Token 1 balance
            </th>
            <th scope="col" className="py-3 px-6">
              Token 2 balance
            </th>

            <th scope="col" className="py-3 px-6">
              Option type
            </th>
            <th scope="col" className="py-3 px-6">
              Direction
            </th>
            <th scope="col" className="py-3 px-6">
              Strike
            </th>
            <th scope="col" className="py-3 px-6">
              Expiry
            </th>
            <th scope="col" className="py-3 px-6">
              Last hedge
            </th>
            <th scope="col" className="py-3 px-6">
              Details
            </th>
          </tr>
        </thead>
        {rowData[0] !== undefined && (
          <tbody>
            {rowData.map((el, i) => (
              <GenerateRow row={rowData[i]} />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default MyPositions;
