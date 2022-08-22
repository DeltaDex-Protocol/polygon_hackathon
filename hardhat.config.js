/** @type import('hardhat/config').HardhatUserConfig */
require("hardhat-deploy");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("hardhat-abi-exporter");
require("solidity-docgen");
require("solidity-coverage");

module.exports = {
  solidity: {
    version: "0.8.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  abiExporter: {
    path: "./data/abi",
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [":ERC20$"],
    spacing: 2,
    format: "minimal",
  },
};
