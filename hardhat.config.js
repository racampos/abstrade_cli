/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "gnosisMainnet",
  networks: {
    hardhat: {
    },
    gnosisMainnet: {
      url: process.env.GNOSIS_URL,
      accounts: [process.env.OWNER_PRIVATE_KEY]
    },
  },
}