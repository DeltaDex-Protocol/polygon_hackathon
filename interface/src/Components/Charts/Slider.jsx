import { useState } from "react";
import { Range } from "react-range";
import ReactSlider from "react-slider";

const sliderInfos = {
  strike: {
    name: "Strike Price",
    min: 300,
    max: 5900,
    step: 50,
    symbol: "$",
  },
  expiry: {
    name: "Expiration in",
    min: 5,
    max: 500,
    step: 1,
    symbol: " days",
  },
  totalValue: {
    name: "Total value invested in Uniswap V2 LP position",
    min: 100,
    max: 20000,
    step: 100,
    symbol: "$",
  },
  OptionAmount: {
    name: "Contracts amount to replicate",
    min: 1,
    max: 999,
    step: 1,
    symbol: "",
  },
  deltaHedgesPerDay: {
    name: "Number of delta hedges per day",
    min: 1,
    max: 24,
    step: 1,
    symbol: "",
  },
  feesToHedgers: {
    name: "Fees to be split between hedgers",
    min: 1,
    max: 900,
    step: 1,
    symbol: "$",
  },
  riskFree: {
    name: "Risk-free rate",
    min: 0,
    max: 0.2,
    step: 0.01,
    symbol: "",
  },
  token1Balance: {
    name: "Amount of token 1",
    min: 10,
    max: 10000,
    step: 10,
    symbol: "",
  },
  token2Balance: {
    name: "Amount of token 2",
    min: 10,
    max: 10000,
    step: 10,
    symbol: "",
  },
};

export default function Slider({ sliderType, onChangeToggle, currentValue, style = "mt-0" }) {
  // console.log(props);
  const [value, setValue] = useState(sliderInfos[sliderType].min);

//   console.log(currentValue)
//   if (currentValue && currentValue !== 1000) {setValue(currentValue)};

  const name = sliderInfos[sliderType].name;
  const sym = sliderInfos[sliderType].symbol;
  const min = sliderInfos[sliderType].min;
  const max = sliderInfos[sliderType].max;
  const step = sliderInfos[sliderType].step;

  return (
    <div className={`${style}`}>
      <span className={``}>{`${name}: ${value}${sym}`}</span>
      <ReactSlider
        step={step}
        min={min}
        max={max}
        className={`h-3 mpr-2 bg-gray-200 mt-2 rounded-md cursor-grab w-20 md:w-48`}
        thumbClassName=" w-5 h-5 cursor-grab bg-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 -top-2px"
        value={value}
        onChange={(value) => {
          setValue(value);
          // here  handler should be added
          onChangeToggle(value);
        }}
      />
    </div>
  );
}
