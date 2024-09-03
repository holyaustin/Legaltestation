require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

  networks: {
    hardhat: {
      chainId: 1337
    },
   
    baseSepolia: {
      url: process.env.BASE_RPC,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },

    'op-sepolia': {
      url: process.env.OP_RPC,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },

  etherscan: {
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://sepolia.basescan.org/api", // Replace with your mode network node URL
          browserURL: "https://sepolia.basescan.org/", // Replace with your mode network browser URL
        },
      },
    ],
    apiKey: {
      baseSepolia: "",
    },
  },
};
