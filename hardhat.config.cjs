require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",

  networks: {
    arbitrumSepolia: {
      url: "https://sepolia.base.org",

      accounts: [""],
    },
  },

  etherscan: {
    customChains: [
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://sepolia.arbiscan.io/api", // Replace with your mode network node URL
          browserURL: "https://sepolia.arbiscan.io/", // Replace with your mode network browser URL
        },
      },
    ],
    apiKey: {
      arbitrumSepolia: "",
    },
  },
};
