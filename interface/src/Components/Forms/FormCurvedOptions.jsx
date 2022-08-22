import { useState } from "react";

import {
  sendForm,
  getCurrentPositions,
  startReplication,
} from "../../utils/interact";

import ProfitChart from "../Charts/NewChart";
import Slider from "../Charts/Slider";
// import PriceChart from "../Charts/PriceChart";

import Creatable, { useCreatable } from "react-select/creatable";
import { e, re } from "mathjs";

// import CreatableSelect from 'react-select/creatable';

const TokenOptions = [
  { label: "DAI", value: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
  { label: "USDC", value: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
  { label: "USDT", value: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
  { label: "WETH", value: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
];

// const addrToToken = TokenOptions.map((el) => {})

const AddressToToken = {
  "0x6B175474E89094C44Da98b954EedeAC495271d0F": "DAI",
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": "USDC",
  "0xdAC17F958D2ee523a2206206994597C13D831ec7": "USDT",
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": "WETH",
};

const OptionDirections = [
  { label: "long", value: "long" },
  { label: "short", value: "short" },
];

const VanillaTypes = [
  { label: "call", value: "curvedCall" },
  { label: "put", value: "curvedPut" },
];

const AvailableModels = [
  { label: "Black-Scholes", value: "black-scholes" },
  { label: "Jump Diffusion", value: "jump-diffusion" },
  { label: "SABR model (coming soon)", value: "sabr" },
  { label: "Heston model (coming soon)", value: "heston" },
];

// const ModelsParams = {
//     "black-scholes": [['BS vol', setBSvol]],
//     "jump-diffusion": [['JDM vol', setJDMvol], ["JDM jump size mean", setJDMjumpSizeMean], 
//                       ["JDM jump deviation", setJDMjumpDeviation], ["JDM jump intensity", setJDMjumpIntensity]],
//     "sabr": ['alpha', 'beta', 'rho'],
//     'heston': [],
// }



const GenerateModelInput = ({param, onChangeToggle}) => {
    console.log(param)

    return (

        <div className="-ml-5 -mt-2 flex flex-col">
            <label for={param} class="block mb-2  text-gray-900">{param}</label>
            <input type="number" id={param} class=" border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5  "
                placeholder="0.2" onChange={(e)=>{onChangeToggle(e.target.value)}} required/>
        </div>
    )
}

const DAYS_IN_YEAR = 365.25;

const DaysToYears = (days) => {
    return Math.round(days / DAYS_IN_YEAR * 1000) / 1000;
}



const CurvesForm = ({currentPrice}) => {

//   console.log(currentPrice)

  const [submit, setSubmit] = useState(false);

  const [addressToken1, setAddressToken1] = useState(TokenOptions[0].value);
  const [addressToken2, setAddressToken2] = useState(
    TokenOptions[TokenOptions.length - 1].value
  );
  const [token1Balance, setToken1Balance] = useState(1);
  const [token2Balance, setToken2Balance] = useState(1);
  const [fees, setFees] = useState(0);
  const [perDay, setPerDay] = useState(1);
  const [OptionAmount, setOptionAmount] = useState(1);
  const [strike, setStrike] = useState(300);
  const [expiration, setExpiration] = useState(5);

//   const [OptionType, setOptionType] = useState(VanillaTypes[0]);

  const [OptionDirection, setDirection] = useState(OptionDirections[0]);

  const [VanillaType, setVanillaType] = useState(VanillaTypes[0]);

  const [totalValueInvestedInLP, setTotalValueInvestedInLP] = useState(1000);

  const [showAdvancedSettings, setAdvanced] = useState(false);

  const [tagInputValue, setTagInputValue] = useState("");
  const [tagValue, setTagValue] = useState("");

  const [chosenModel, setModel] = useState(AvailableModels[0]);

  const [riskFree, setRiskFree] = useState(0);

  const [isNext, setNext] = useState(false);

  //

  // BS params
  const [BSvol, setBSvol] = useState(0.2);

  // JDM params
  const [JDMvol, setJDMvol] = useState(0.2);
  const [JDMjumpSizeMean, setJDMjumpSizeMean] = useState("0");
  const [JDMjumpDeviation, setJDMjumpDeviation] = useState("0");
  const [JDMjumpIntensity, setJDMjumpIntensity] = useState("0");

  const fillDefault = () => {
      console.log(VanillaType, OptionDirection)
      setVanillaType(VanillaTypes[0]);
      setDirection(OptionDirections[0]);
      setAddressToken1(TokenOptions[0].value);
      setAddressToken2(TokenOptions[TokenOptions.length - 1].value);
      setToken1Balance(1);
      setToken2Balance(1);
      setRiskFree(0);
      setModel(AvailableModels[0]);
      setOptionAmount(1);
      setStrike(300);
      setExpiration(5);
  }

  const ModelsParams = {
    "black-scholes": [['BS vol', setBSvol]],
    "jump-diffusion": [['JDM vol', setJDMvol], ["JDM jump size mean", setJDMjumpSizeMean], 
                      ["JDM jump deviation", setJDMjumpDeviation], ["JDM jump intensity", setJDMjumpIntensity]],
    "sabr": ['alpha', 'beta', 'rho'],
    'heston': [],
    }

    const ShouldPayFirstToken = (option_type, option_direction) => {
        // alert(option_type+option_direction)
        return option_type === 'call' && option_direction === 'long' 
                || option_type === 'put' && option_direction === 'short' ? true : false;
        
        }


  const processForm = async () => {
    const EXP_IN_YEARS = expiration / 365.25;

    var formInputs = {
      model_type: chosenModel,
      option_type: VanillaType, // here it was OptionType before
      option_direction: OptionDirection,
      strike: strike + "",
      expiration: EXP_IN_YEARS + "",
      address_token1: addressToken1,
      address_token2: addressToken2,
      token1_balance: token1Balance + "",
      token2_balance: token2Balance + "",
      hedges_per_day: perDay + "",
      option_amount: OptionAmount + "",
      total_value_of_fees: fees + "",
      model_params: {},
      etc: {},
    };
    // console.log(`initial formInputs`,formInputs);

    if (
      formInputs.option_type.value === "curvedCall" ||
      formInputs.option_type.value === "curvedPut"
    ) {
      formInputs.etc = {
        total_value_invested_in_lp: totalValueInvestedInLP + "",
      };
    }

    if (formInputs.model_type.label === "Jump Diffusion") {
      formInputs.model_params = {
        risk_free_rate: riskFree + "",
        vol: JDMvol + "",
        jump_size_mean: JDMjumpSizeMean + "",
        jump_deviation: JDMjumpDeviation + "",
        jump_intensity: JDMjumpIntensity + "",
      };
    }

    if (formInputs.model_type.label === "Black-Scholes") {
      formInputs.model_params = {
        risk_free_rate: riskFree + "",
        vol: BSvol + "",
      };
    }

    if (formInputs.model_type.label === "SABR model") {
      // pass
    }

    if (formInputs.model_type.label === "Heston model") {
      // pass
    }

    console.log(formInputs);

    const { success, status } = await startReplication(formInputs);
    console.log(success, status);
  };


  return (
    <>
      {/* {console.log(AddressToToken[addressToken1])} */}
      {isNext ? (
        <div className="px-10 py-4 relative">
          <div className="flex justify-between">
            <div>
              <div className="flex flex-col">
                <span className="-ml-5 text-medium text-xl">
                  Add initial liquidity to trade underlying
                </span>
                <span className="-ml-5 text-black text-normal mt-1">
                  Please add the liquidity in
                  <span className="font-bold">
                  {ShouldPayFirstToken(VanillaType.label, OptionDirection.value) ?
                      ` ${AddressToToken[addressToken1]} `
                    : ` ${AddressToToken[addressToken2]} `}
                  </span>
                  tokens
                </span>
              </div>
              <div className="relative h-9 rounded-xl mt-4 -ml-5 mb-10">
                <input
                  type={"number"}
                  step="any"
                  placeholder="0.00"
                  className="outline-0 w-28 h-10 text-xl bg-gray-100 text-center absolute left-0 top-1 rounded-2xl"
                  onChange={(value) => {
                    setToken1Balance(value.target.value || "0");
                    console.log(value.target.value);
                  }}
                />
                <span className="absolute ml-32 text-xl top-3">{`${AddressToToken[addressToken1]}`}</span>
              </div>
              <span className="-ml-5 text-medium text-xl  relative ">
                Fees to be split between hedgers
              </span>
              <div className="mt-1 flex ">
                <div className="">
                  <div className="relative h-9 rounded-xl mt-2 -ml-5 w-60">
                    <input
                      type={"number"}
                      step="any"
                      placeholder="0.00"
                      className="outline-0 w-28 h-10 text-xl bg-gray-100 text-center absolute left-0 top-1 rounded-2xl"
                      onChange={(value) => {
                        setFees(parseFloat(value.target.value) > 0 ? parseFloat(value.target.value) : 0);
                        console.log(value.target.value);
                      }}
                    />
                    <span className="absolute ml-32 text-xl top-2">{`${AddressToToken[addressToken1]}`}</span>
                  </div>
                </div>
                <div className="mt-3 text-xl">
                  <span className="bg-gray-100 rounded-md py-1 px-3 text-gray-500">{`${
                    Math.round((parseFloat(fees) / parseInt(perDay) / parseFloat(expiration)) * 1000) /
                    1000
                  } ${AddressToToken[addressToken1]} per hedge`}</span>
                </div>
              </div>
              <div className="mt-5">
                <span className="-ml-5 text-medium text-xl relative">
                  Number of delta hedges per day
                </span>
                <div className="relative h-9 rounded-xl mt-2 -ml-5">
                  <input
                    type={"number"}
                    step="1"
                    min="1"
                    max="48"
                    placeholder="1"
                    className="outline-0 w-28 h-10 text-xl bg-gray-100 text-center absolute left-0 top-1 rounded-2xl"
                    onChange={(value) => {
                      setPerDay(parseFloat(value.target.value) > 0 ? parseFloat(value.target.value) : 0);
                      console.log(value.target.value);
                    }}
                  />
                  <span className="absolute ml-32 text-xl top-3">{`times per day`}</span>
                  <button
                    className="mt-20 bg-indigo-400 ml w-50 rounded text-white text-center hover:bg-indigo-300"
                    onClick={() => {fillDefault(); setNext(!isNext)}}
                  >
                    {" "}
                    Back
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <ProfitChart
                params={{ S: parseFloat(currentPrice), K: parseFloat(strike), T: DaysToYears(expiration), r: parseFloat(riskFree), sigma: 0.5, TV0: parseFloat(totalValueInvestedInLP) }}
                OptionDirection={OptionDirection}
                OptionType={VanillaType}
              />
              <label
                for="default-toggle"
                className="mt-5 mr-32 inline-flex relative items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  value=""
                  id="default-toggle"
                  className="sr-only peer"
                  onClick={() => {
                    setAdvanced(!showAdvancedSettings);
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300  rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-indigo-600"></div>
                <span className="ml-3 text-xl text-gray-900 ">
                  Advanced settings
                </span>
              </label>

              <button
                className="mt-20 bg-indigo-400 ml-28  w-50 rounded text-white text-center hover:bg-indigo-300"
                onClick={processForm}
                // onClick={() => alert("start replication")}
              >
                {" "}
                Start replication
              </button>
            </div>
          </div>
          <div className="flex justify-between mt-10 mb-10">
            {showAdvancedSettings ? (
              <div className="flex flex-col">
                <span className="-ml-5 w-80 text-xl">Choose the model</span>
                <Creatable
                  className="-ml-5 mt-2 "
                  options={AvailableModels}
                  defaultValue={AvailableModels[0]}
                  onChange={(value) => {
                    if (value === null) return;
                    setModel(value);
                  }}
                />
                <div className="grid grid-cols-2 gap-12 mt-4">

                {ModelsParams[chosenModel.value].map((el) => 
                    <GenerateModelInput param={el[0]} onChangeToggle={el[1]}/>
                )}
                </div>

              </div>

            ) : ( // first page

              <div></div>
            )}
          </div>
        </div>
      ) : (
        <div className="px-10 py-4 relative -mt-6">
          <div className="flex justify-between mb-0 mt-0 space-x-10">
            <div className="flex flex-col">
              <div className="">
                <span className="-ml-5 left-0 ">Choose option type</span>
                <Creatable
                  className="-ml-5 mt-2"
                  options={VanillaTypes}
                  defaultValue={VanillaTypes[0]}
                  onChange={(value) => {
                    if (value === null) return;
                    setVanillaType(value);
                  }}
                />
              </div>
              <div className="mt-5">
                <span className="-ml-5 left-0">Direction of the option</span>
                <Creatable
                  className="-ml-5 mt-2"
                  options={OptionDirections}
                  defaultValue={OptionDirections[0]}
                  onChange={(value) => {
                    if (value === null) return;
                    // console.log(value)
                    setDirection(value);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <Slider
                style="mt-2"
                sliderType={"strike"}
                onChangeToggle={setStrike}
                currentValue={currentPrice}
              />
              <Slider
                style="mt-20"
                sliderType={"expiry"}
                onChangeToggle={setExpiration}
              />
            </div>
            <ProfitChart
                params={{ S: parseFloat(currentPrice), K: parseFloat(strike), T: DaysToYears(expiration), r: parseFloat(riskFree), sigma: 0.5, TV0: parseFloat(totalValueInvestedInLP) }}
                OptionDirection={OptionDirection}
              OptionType={VanillaType}
            />
          </div>

          <div className="flex flex-col mb-5 ">
          <span className=" -ml-5 text-medium text-xl mb-3">
            Total value invested in LP uniswap v2
          </span>
          
          <div className="flex space-x-4">
          <input
            type={"number"}
            step="any"
            placeholder="0.00"
            className="outline-0 w-28 h-10 -ml-5 text-xl bg-gray-100 text-center  left-0 top-1 rounded-2xl"
            onChange={(value) => {
              setTotalValueInvestedInLP(value.target.value || "0");
              console.log(value.target.value);
            }} 
          />
          <span className="text-xl mt-1">DAI</span>
          </div>
          </div>

          <span className=" -ml-5 text-medium text-xl">
            Specify the token pair by choosing tokens
          </span>

          <div className="flex justify-between w-5/12 space-x-10">
            <Creatable
              className="-ml-5 mt-6 w-40 z-10"
              options={TokenOptions}
              defaultValue={TokenOptions[0]}
              onChange={(labelAndValue) => {
                if (labelAndValue === null) return;
                setAddressToken1(labelAndValue.value);
              }}
            />
            <Creatable
              className="mt-6 w-40 z-10 "
              options={TokenOptions}
              defaultValue={TokenOptions[TokenOptions.length - 1]}
              onChange={(labelAndValue) => {
                if (labelAndValue === null) return;
                setAddressToken2(labelAndValue.value);
              }}
            />
          </div>
          <div className="flex w-8/12 justify-between mb-10 space-x-16">
            <Slider
              style="mt-10 -ml-5 w-40"
              sliderType={"OptionAmount"}
              onChangeToggle={setOptionAmount}
            />
            <Slider
              style="mt-16   w-40"
              sliderType={"riskFree"}
              onChangeToggle={setRiskFree}
            />
            <button
              className=" mt-20 bg-indigo-400 px-10  rounded text-white text-center hover:bg-indigo-300"
              onClick={() => setNext(!isNext)}
            >
              {" "}
              Next
            </button>
          </div>
          {/* <span className="-ml-5 text-medium text-xl">Specify the token pair by choosing tokens</span> */}
          <div></div>
        </div>
      )}
    </>
  );
};

export default CurvesForm;
