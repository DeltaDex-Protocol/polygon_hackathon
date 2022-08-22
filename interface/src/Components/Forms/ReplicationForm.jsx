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

// import CreatableSelect from 'react-select/creatable';

const TokenOptions = [
  { label: "DAI", value: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
  { label: "USDC", value: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
  { label: "USDT", value: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
  { label: "WETH", value: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
];

const OptionDirections = [
  { label: "long", value: "long" },
  { label: "short", value: "short" },
];

const VanillaTypes = [
  { label: "call", value: "vanillaCall" },
  { label: "put", value: "vanillaPut" },
];

const AvailableModels = [
  { label: "Black-Scholes", value: "black-scholes" },
  { label: "Jump Diffusion", value: "jump-diffusion" },
  { label: "SABR model (coming soon)", value: "sabr" },
  { label: "Heston model (coming soon)", value: "heston" },
];

const Rform = () => {
  const [submit, setSubmit] = useState(false);

  const [addressToken1, setAddressToken1] = useState("");
  const [addressToken2, setAddressToken2] = useState("");
  const [token1Balance, setToken1Balance] = useState("1");
  const [token2Balance, setToken2Balance] = useState("1");
  const [fees, setFees] = useState("");
  const [perDay, setPerDay] = useState("");
  const [OptionAmount, setOptionAmount] = useState(1);
  const [strike, setStrike] = useState(300);
  const [expiration, setExpiration] = useState(5);
  // const [OptionType, setOptionType] = useState(OptionTypes[0]);
  const [OptionDirection, setDirection] = useState(OptionDirections[0]);

  const [VanillaType, setVanillaType] = useState(VanillaTypes[0]);

  const [totalValueInvestedInLP, setTotalValueInvestedInLP] = useState(1000);

  const [showAdvancedSettings, setAdvanced] = useState(false);

  const [tagInputValue, setTagInputValue] = useState("");
  const [tagValue, setTagValue] = useState("");

  const [chosenModel, setModel] = useState(AvailableModels[0]);

  const [riskFree, setRiskFree] = useState("0");

  return (
    <div className="overflow-x-auto relative sm:rounded-lg shadow-lg mb-8">
      <div className="px-10 py-4 relative">
        {/* <input type="date" class="rounded text-pink-500" />
            <input type="email" class="form-input px-4 py-3 rounded-full"/> */}
        <div className="flex justify-between mb-2">
          <div className="flex w-8/12 justify-between">
            <div>
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
              <div className="mt-3">
                <span className="-ml-5 left-0">Direction of the option</span>
                <Creatable
                  className="-ml-5 mt-2"
                  options={OptionDirections}
                  defaultValue={OptionDirections[0]}
                  onChange={(value) => {
                    if (value === null) return;
                    setDirection(value);
                  }}
                />
                <Creatable
                  className="-ml-5 mt-20 w-40"
                  options={TokenOptions}
                  defaultValue={TokenOptions[0]}
                  onChange={(value) => {
                    if (value === null) return;
                    setAddressToken1(value);
                  }}
                />
              </div>
            </div>
            <div className="ml-2 md:mr-20 flex flex-col mt-2">
              {/* <span>Strike price</span> */}
              <Slider
                style="-mt-1"
                sliderType={"strike"}
                onChangeToggle={setStrike}
              />
              <Slider
                style="mt-12"
                sliderType={"expiry"}
                onChangeToggle={setStrike}
              />
              <Creatable
                className="mt-24 w-40"
                options={TokenOptions}
                defaultValue={TokenOptions[TokenOptions.length - 1]}
                onChange={(value) => {
                  if (value === null) return;
                  setAddressToken2(value);
                }}
              />
            </div>
          </div>
          <div>
            <ProfitChart
              params={{ S: 1000, K: 1000, T: 0.5, r: 0.1, sigma: 0.5 }}
              OptionDirection={OptionDirection}
              OptionType={VanillaType}
            />
          </div>
        </div>
        <span className="absolute top-52 -ml-5 text-medium text-xl">
          Specify the token pair by chosing tokens
        </span>
        <div>
          <div className="flex w-6/12 justify-between ">
            <Slider
              style="mt-10 -ml-5 w-40"
              sliderType={"OptionAmount"}
              onChangeToggle={setOptionAmount}
            />
            <Slider
              style="mt-10 w-40"
              sliderType={"deltaHedgesPerDay"}
              onChangeToggle={setPerDay}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rform;
