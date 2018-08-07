/*
 * install: npm install --save truffle-hdwallet-provider
 * install: npm install --save mocha ganache-cli web3@1.0.0-beta.26
 * deploy: node deploy.js
 * for the purpose of the course:
 * 1. take address from console.log
 * 2. make new file in root directory and copy paste the address to that file
*/

const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CharityFactory.json");

// setup provider (HDWallet) with arguments 1. mnemonic 2. provider URL address + apikey
const provider = new HDWalletProvider(
  "pencil proud heart critic choose simple confirm weather general dolphin potato energy",
  "https://rinkeby.infura.io/vcPnK5tVPIX3jzFa86Nj"
);
// create new web3 instance with infura as provider
const web3 = new Web3(provider);

// create deploy function so we can use sync await syntax
const deploy = async () => {
  // get accounts
  const accounts = await web3.eth.getAccounts();

  // log the account that deployed the contract
  console.log("Attempting to deploy from account", accounts[0]);

  /*
  * use one of those accounts to deploy the contract
  * call Contracts constructor and pass in the compiledFactory ABI (interface)
  * assign the deployd contract to result variable
  */
  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "3000000", from: accounts[0] });

    // log the address where the contract got deployed
  console.log("Contract deployed to", result.options.address);
};
// call deploy function 
deploy();
