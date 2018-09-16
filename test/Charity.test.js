const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CharityFactory.json");
const compiledCharity = require("../ethereum/build/Charity.json");

let accounts;
let factory;
let charityAddress;
let charity;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "2000000" });

  await factory.methods.createCharity("100").send({
    from: accounts[0],
    gas: "2000000"
  });

  [charityAddress] = await factory.methods.getDeployedCharities().call();

  charity = await new web3.eth.Contract(
    JSON.parse(compiledCharity.interface),
    charityAddress
  );
});

describe("Charities", () => {
  it("deploys a factory and a charity", () => {
    assert.ok(factory.options.address);
    assert.ok(charity.options.address);
  });

  it("marks caller as the charity manager", async () => {
    const manager = await charity.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to donate money and marks them as donors", async () => {
    await charity.methods.donate().send({
      value: "200",
      from: accounts[1]
    });
    const isDonor = await charity.methods.donors(accounts[1]).call();
    assert(isDonor);
  });

  it("allows only one donation per donor", async () => {
    await charity.methods.donate().send({
      value: "200",
      from: accounts[1]
    });
    const isDonor = await charity.methods.donors(accounts[1]).call();
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
    const milestone = await charity.methods.milestones(0).call();

    assert.equal("Buy batteries", milestone.description);
  });

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
