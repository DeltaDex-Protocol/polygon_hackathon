import { useState } from "react";

// import other component
import FormInput from "../../Forms/FormInput/FormInput";
import Titles from "../../Titles/Titles";

// import other pkg
import { Form, Row, Col, Button } from "react-bootstrap";
// import { useFormik } from "formik";
import { object, string, date } from "yup";
import PropTypes from "prop-types";

// import utils
import { getStorage } from "../../../utils/storage";
import {
  sendForm,
  getCurrentPositions,
  startReplication,
} from "../../../utils/interact";

import Creatable, { useCreatable } from "react-select/creatable";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
// import Chart from "../../Charts/Chart.jsx";
import ProfitChart from "../../Charts/NewChart.jsx";
import Slider from "../../Charts/Slider.jsx";

import PriceChart from "../../Charts/PriceChart.jsx";

const TokenOptions = [
  { label: "DAI", value: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
  { label: "USDC", value: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
  { label: "USDT", value: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
  { label: "WETH", value: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
];

const OptionTypes = [
  { label: "Vanilla call", value: "vanillaCall" },
  { label: "Vanilla put", value: "vanillaPut" },
  { label: "Curved call", value: "curvedCall" },
  { label: "Curved put", value: "curvedPut" },
];

const OptionDirections = [
  { label: "long", value: "long" },
  { label: "short", value: "short" },
];

const AvailableModels = [
  { label: "Black-Scholes", value: "black-scholes" },
  { label: "Jump Diffusion", value: "jump-diffusion" },
  { label: "SABR model (coming soon)", value: "sabr" },
  { label: "Heston model (coming soon)", value: "heston" },
];

const ReplicationForm = ({ data }) => {
  const [submit, setSubmit] = useState(false);

  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [addressToken1, setAddressToken1] = useState("");
  const [addressToken2, setAddressToken2] = useState("");
  const [token1Balance, setToken1Balance] = useState("1");
  const [token2Balance, setToken2Balance] = useState("1");
  const [fees, setFees] = useState("");
  const [perDay, setPerDay] = useState("");
  const [OptionAmount, setOptionAmount] = useState(1);
  const [strike, setStrike] = useState(300);
  const [expiration, setExpiration] = useState(5);
  const [OptionType, setOptionType] = useState(OptionTypes[0]);
  const [OptionDirection, setDirection] = useState(OptionDirections[0]);

  const [totalValueInvestedInLP, setTotalValueInvestedInLP] = useState(1000);

  const [showAdvancedSettings, setAdvanced] = useState(false);

  const [tagInputValue, setTagInputValue] = useState("");
  const [tagValue, setTagValue] = useState("");

  const [chosenModel, setModel] = useState(AvailableModels[0]);

  const [riskFree, setRiskFree] = useState("0");

  // BS params
  const [BSvol, setBSvol] = useState("");

  // JDM params
  const [JDMvol, setJDMvol] = useState(0.1);
  const [JDMjumpSizeMean, setJDMjumpSizeMean] = useState("0");
  const [JDMjumpDeviation, setJDMjumpDeviation] = useState("0");
  const [JDMjumpIntensity, setJDMjumpIntensity] = useState("0");


  const processForm = async () => {

    const EXP_IN_YEARS = expiration / 365.25;

    var formInputs = {
      model_type: chosenModel,
      option_type: OptionType,
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

  const handleKeyDown = (event) => {
    if (!tagInputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setTagValue([...tagValue, createOption(tagInputValue)]);
        setTagInputValue("");

        event.preventDefault();
        break;

      default:
        break;
    }
  };

  const createOption = (label) => ({
    label,
    value: label,
  });

  const handleInputChange = (value) => {
    setTagInputValue(value);
  };

  return (
    <>
      <Titles
        className=""
        title="Replicate Your option"
        text="Choose the parameters of the option you'd like to replicate"
      />

      <Form className="mt-4">
        <Row className="mt-2">
          <Col className="">
            <Row className="">
              <Col>
                <p
                  xs={12}
                  lg
                  as={Col}
                  inpClass="py-2"
                  className="p-0"
                  name="amountOfToken0"
                  type="text"
                  controlId=""
                >
                  Option type
                </p>
                <Creatable
                  options={OptionTypes}
                  isClearable
                  xs={12}
                  lg
                  as={Col}
                  inpClass="py-2"
                  className="p-0 z-10"
                  name="amountOfToken0"
                  type="text"
                  controlId=""
                  placeholder="Choose_type"
                  defaultValue={OptionTypes[0]}
                  size="sm"
                  onKeyDown={handleKeyDown}
                  onChange={(value) => {
                    if (value === null) return;
                    setOptionType(value);
                    console.log(OptionType);
                  }}
                />
              </Col>
              <Col>
                <Col className="p-0">
                  <p
                    xs={12}
                    lg
                    as={Col}
                    inpClass="py-2"
                    className="p-0"
                    name="amountOfToken0"
                    type="text"
                    controlId=""
                  >
                    Direction
                  </p>
                  <Creatable
                    options={OptionDirections}
                    isClearable
                    xs={12}
                    lg
                    as={Col}
                    inpClass="py-2"
                    className="p-0 z-10"
                    name="amountOfToken0"
                    type="text"
                    controlId=""
                    text=""
                    placeholder="long/short"
                    defaultValue={OptionDirections[0]}
                    size="sm"
                    onKeyDown={handleKeyDown}
                    onChange={(value) => {
                      if (value === null) return;
                      setDirection(value);
                      console.log(value.value);
                    }}
                  />
                </Col>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Slider sliderType="strike" onChangeToggle={setStrike} />
              </Col>
              <Col>
                <Slider sliderType="expiry" onChangeToggle={setExpiration} />
              </Col>
            </Row>

            {OptionType.value === "curvedCall" && (
              <Row>
                <Col>
                  <Slider
                    sliderType="totalValue"
                    onChangeToggle={setTotalValueInvestedInLP}
                  />
                </Col>
              </Row>
            )}
            {OptionType.value === "curvedPut" && (
              <Row>
                <Col>
                  <Slider
                    sliderType="totalValue"
                    onChangeToggle={setTotalValueInvestedInLP}
                  />
                </Col>
              </Row>
            )}
            <Row>
              <span className="my-3 font-bold text-lg">
                Specify the pair by choosing tokens
              </span>
            </Row>
            <Row className="">
              <Col>
                <p
                  xs={12}
                  lg
                  as={Col}
                  inpClass="py-2"
                  className="p-0"
                  name="amountOfToken0"
                  type="text"
                  controlId=""
                >
                  Token 1
                </p>
                <Creatable
                  options={TokenOptions}
                  isClearable
                  xs={12}
                  lg
                  as={Col}
                  inpClass="py-2"
                  className="p-0 z-10"
                  name="amountOfToken0"
                  type="text"
                  controlId=""
                  text="Amount of token 0"
                  placeholder="Address Token 1"
                  size="sm"
                  onKeyDown={handleKeyDown}
                  onChange={(value) => {
                    setAddressToken1(value.value);
                    console.log(value.value);
                  }}
                />
              </Col>

              <Col>
                <p
                  xs={12}
                  lg
                  as={Col}
                  inpClass="py-2"
                  className="p-0"
                  name="amountOfToken0"
                  type="text"
                  controlId=""
                  text="Amount of token 0"
                >
                  Token 2
                </p>
                <Creatable
                  options={TokenOptions}
                  isClearable
                  xs={12}
                  lg
                  as={Col}
                  inpClass="py-2"
                  className="p-0 z-10"
                  name="amountOfToken0"
                  type="text"
                  controlId=""
                  text="Amount of token 0"
                  placeholder="Address Token 2"
                  size="sm"
                  onKeyDown={handleKeyDown}
                  onChange={(value) => {
                    setAddressToken2(value.value);
                    console.log(value.value);
                  }}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Slider
                  sliderType="OptionAmount"
                  onChangeToggle={setOptionAmount}
                />
              </Col>
              <Col>
                <Slider
                  sliderType="deltaHedgesPerDay"
                  onChangeToggle={setPerDay}
                />
              </Col>
            </Row>
            <span className="my-3 font-bold text-lg">
                Initial liquidity to trade underlying
              </span>
            <Row className="mt-2">
              <Col>
              {console.log(OptionType.label, OptionDirection.label)}
              {((OptionType.label.split(' ')[1] === "call" && 
               OptionDirection.label === "long") ||
               (OptionType.label.split(' ')[1] === "put" && 
               OptionDirection.label === "short")) && (
                <Slider
                  sliderType="token1Balance"
                  onChangeToggle={setToken1Balance}
                />
               )}
              {(OptionType.label.split(' ')[1] === "put" && 
               OptionDirection.label === "long" ||
               OptionType.label.split(' ')[1] === "call" && 
               OptionDirection.label === "short") && (
                <Slider
                  sliderType="token2Balance"
                  onChangeToggle={setToken2Balance}
                />
              )}
              </Col>
              <Col>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Slider sliderType="feesToHedgers" onChangeToggle={setFees} />
              </Col>
              <Col>
                <Slider sliderType="riskFree" onChangeToggle={setRiskFree} />
              </Col>
            </Row>
          </Col>

          <Col className="">
            <Row>
              <Col className="flex justify-center">
                {data.length > 0 && (
                  <ProfitChart
                    OptionType={OptionType}
                    OptionDirection={OptionDirection}
                    params={{
                      S: data[data.length - 1].value,
                      K: strike,
                      T: expiration,
                      r: riskFree,
                      sigma: 0.8,
                      TV0: totalValueInvestedInLP,
                    }}
                    className=""
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col className="flex justify-center">
                <PriceChart data={data} className="" />
              </Col>
              {/*<Col xs={1}>2
            </Col>*/}
            </Row>
          </Col>
        </Row>

        {/*<Row className="mt-3 mt-lg-4 px-3">

        </Row>*/}

        {/*<Row className="mt-3 px-3">

          <FormInput
            xs={12}
            lg
            as={Col}
            inpClass="py-2"
            className="p-0  mt-4 mt-lg-3"
            name="riskFreeRate"
            type="text"
            controlId=""
            text="Risk Free Rate"
            placeholder="uint256"
            size="sm"
            successMsg="done"
            onChange={(event) => setRiskFree(event.target.value)}
          />
        </Row>*/}
        {/*        <p className="mt-3 px-1 fw-bold">
          Choose the parameters of Jump Diffusion Model:
        </p>*/}
        <Row className="">
          <Col>
            <p className="mt-2 px-1 fw-bold">Choose the model:</p>
            <Creatable
              options={AvailableModels}
              isClearable
              xs={12}
              lg
              as={Col}
              inpClass="py-2"
              className="z-10"
              name="amountOfToken0"
              type="text"
              controlId=""
              placeholder="Choose_type"
              defaultValue={AvailableModels[0]}
              size="sm"
              onKeyDown={handleKeyDown}
              onChange={(value) => {
                if (value === null) return;
                setModel(value);
              }}
            />
          </Col>
          <Col className="text-center">
            <label
              for="default-toggle"
              className="mt-5 inline-flex relative items-center cursor-pointer"
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-md font-medium text-gray-900 ">
                Advanced settings
              </span>
            </label>
          </Col>
        </Row>

        {showAdvancedSettings === true &&
          chosenModel.label === "Black-Scholes" && (
            <>
              <Row className="mt-3">
                <FormInput
                  xs={12}
                  lg
                  as={Col}
                  inpClass="py-2"
                  className=""
                  name="sigma"
                  type="text"
                  controlId=""
                  text="Volatility (sigma)"
                  placeholder="float"
                  size="sm"
                  successMsg="done"
                  onChange={(event) => setBSvol(parseFloat(event.target.value))}
                />
                <Col />
              </Row>
            </>
          )}

        {showAdvancedSettings === true &&
          chosenModel.label === "Jump Diffusion" && (
            <>
              <Row className="mt-3">
                <FormInput
                  xs={12}
                  lg
                  as={Col}
                  inpClass="py-2"
                  className=""
                  name="sigma"
                  type="text"
                  controlId=""
                  text="Volatility (sigma)"
                  placeholder="float"
                  size="sm"
                  successMsg="done"
                  onChange={(event) =>
                    setJDMvol(parseFloat(event.target.value))
                  }
                />

                <FormInput
                  xs={12}
                  lg
                  as={Col}
                  inpClass="py-2"
                  className=""
                  name="intensityOfJump"
                  type="text"
                  controlId=""
                  text="Intensity Of Jump (lam)"
                  placeholder="float"
                  size="sm"
                  successMsg="done"
                  onChange={(event) =>
                    setJDMjumpIntensity(parseFloat(event.target.value))
                  }
                />
              </Row>
              <Row className="mt-3">
                <FormInput
                  xs={12}
                  lg
                  as={Col}
                  inpClass="py-2"
                  className=""
                  name="meanRateOfJump"
                  type="text"
                  controlId=""
                  text="Mean of Merton's Jump size (m)"
                  placeholder="float"
                  size="sm"
                  successMsg="done"
                  onChange={(event) =>
                    setJDMjumpSizeMean(parseFloat(event.target.value))
                  }
                />
                <FormInput
                  xs={12}
                  lg
                  as={Col}
                  inpClass="py-2"
                  className=""
                  name="stdOfJump"
                  type="text"
                  controlId=""
                  text="Standart Deviation of Jump size (v)"
                  placeholder="float"
                  size="sm"
                  successMsg="done"
                  onChange={(event) =>
                    setJDMjumpDeviation(parseFloat(event.target.value))
                  }
                />
              </Row>
            </>
          )}

        <Button
          variant="primary"
          className="mt-5 py-2 px-40"
          onClick={processForm}
        >
          Start replication
        </Button>
      </Form>
    </>
  );
};

export default ReplicationForm;
