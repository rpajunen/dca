/*
 * we are using mocha, ganache-cli and web3 to test
 * install: npm install --save mocha ganache-cli web3@1.0.0-beta.26
 * we are using web3 v1.0.0 becauce it has support for promises + async/await
 * with web3 we can 1. interact with deployed contract 2. create a contract
 * to run test: npm run test
 * pacgage.json file must be updated ("scripts": {"test": "mocha")
*/

// from node.js can use assertions
const assert = require("assert");
// local test network (RPC)
const ganache = require("ganache-cli");
// Web3 is constructor = capitalize
const Web3 = require("web3");
// communication layer for some network, in this case ganache
// if use ropsten then change the provider
const web3 = new Web3(ganache.provider());

// require two compiled versions of our contract
const compiledFactory = require("../ethereum/build/CharityFactory.json");
const compiledCharity = require("../ethereum/build/Charity.json");

// variables used in this test
let accounts;
let factory;
let charityAddress;
let charity;

/**
 * beforeEach helper that will run before each test (it())
 * helps us to create factory and campaign variables
 * that can be used in 'it' blocks later when we test
 */
beforeEach(async () => {
  // save available accounts to accounts variable
  accounts = await web3.eth.getAccounts();

  /**
   * we will use Contract constructor (that is part of web3)
   * to deploy and send it to the network
   * and finally store the contract to a variable
   * 1. pass in compiledFactory ABI (interface)
   * 2. deploy it with the bytecode
   * 3. send the trasaction to the network with params account and gas
   */
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "2000000" });

  // lets use factory and call its createCampaing method
  await factory.methods.createCharity("100").send({
    from: accounts[0],
    gas: "2000000"
  });

  /**
   * call getDeployedCampaigns method
   * use ES2016: [charityAddress
   *] syntax will
   * store the first element of the returned array
   * to charityAddress
   * variable
   */
  [charityAddress] = await factory.methods.getDeployedCharities().call();

  /**
   * to access already deployed contract
   * pass in two arguments to Contract constructor
   * 1. ABI of compiledCampaign and
   * 2. campaign address
   * and store it to campaign varible
   */
  charity = await new web3.eth.Contract(
    JSON.parse(compiledCharity.interface),
    charityAddress
  );
});

describe("Charities", () => {
  it("deploys a factory and a charity", () => {
    // assert.ok asserts that something exists
    // in this case address (to assert it really was deployed)
    assert.ok(factory.options.address);
    assert.ok(charity.options.address);
  });

  it("marks caller as the charity manager", async () => {
    // call manager method and store the address of it to manager variable
    const manager = await charity.methods.manager().call();
    // assert that account at 0 is the manager
    assert.equal(accounts[0], manager);
  });

  it("allows people to donate money and marks them as donors", async () => {
    await charity.methods.donate().send({
      value: "200",
      from: accounts[1]
    });
    // approvers method with argument(address) will return a boolean
    const isDonor = await charity.methods.donors(accounts[1]).call();
    // assert will fail if we pass in faulty value
    assert(isDonor);
  });

  it("allows only one donation per donor", async () => {
    await charity.methods.donate().send({
      value: "200",
      from: accounts[1]
    });
    const isDonor = await charity.methods.donors(accounts[1]).call();
    // assert will fail if we pass in faulty value
    assert(isDonor);

    try {
      await charity.methods.donate().send({
        value: "200",
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  /**
   * this test asserts that if user contributes with less wei than
   * the min contrubition amount, an error is thrown
   * 1. 5 is too few
   * 2. if assert(false) is executed the test will fail
   * 3. if error is thrown assert that err is thruthy value
   */
  it("requires a minimum contribution", async () => {
    try {
      await charity.methods.donate().send({
        value: "5",
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows a manager to make a milestones", async () => {
    await charity.methods
      .createMilestone("Buy batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000"
      });
    // request method requires an argument so we call requests(0)
    // that will return the first element of the array
    const milestone = await charity.methods.milestones(0).call();

    assert.equal("Buy batteries", milestone.description);
  });

  /**
   * one end to end test from section 6 lecture 139
   */
  it("processes milestones", async () => {
    await charity.methods.donate().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether")
    });

    await charity.methods
      .createMilestone("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await charity.methods.approveMilestone(0).send({
      from: accounts[0],
      gas: "1000000"
    });

    await charity.methods.finalizeMilestone(0).send({
      from: accounts[0],
      gas: "1000000"
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
