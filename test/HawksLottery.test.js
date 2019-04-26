const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // constructor

//web3 instance with ganache as provider
//const provider = ganache.provider();
const web3 = new Web3(ganache.provider()); //web3 instance with gane
const {interface, bytecode} = require('../compile');

// decleare the variables for beforeEach
let accounts;
let lottery;

beforeEach(async () => {
  // get all the unlocked accounts from ganache
  accounts = await web3.eth.getAccounts();

  //deploy the contract
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0], gas: 1000000});

  //example.setProvider(provider);
});

describe ("Test Example", () => {
  it("Deploys the lottery contract", () => {
    //console.log(accounts);
    //console.log(example);
    assert.ok(lottery.options.address);
  });

  it("Owner set correctly", async () => {
    const owner = await lottery.methods.owner().call();
    assert.equal(owner, accounts[0]);
  });

  it("1st player playing", async () => {
     await lottery.methods.play().send({
       from : accounts[1],
       value : web3.utils.toWei('0.01', 'ether')
     });
     const players = await lottery.methods.showPlayers().call({
       from: accounts[0]
     });
     assert.equal(1, players.length);
     assert.equal(accounts[1], players[0]);
  });

  it("multiple players playing", async () => {
     await lottery.methods.play().send({
       from : accounts[2],
       value : web3.utils.toWei('0.01', 'ether')
     });
     await lottery.methods.play().send({
       from : accounts[3],
       value : web3.utils.toWei('0.01', 'ether')
     });
     await lottery.methods.play().send({
       from : accounts[4],
       value : web3.utils.toWei('0.01', 'ether')
     });

     const players = await lottery.methods.showPlayers().call({
       from: accounts[0]
     });

     assert.equal(3, players.length);
     assert.equal(accounts[2], players[0]);
     assert.equal(accounts[3], players[1]);
     assert.equal(accounts[4], players[2]);
  });

  it("Try to play with less ether", async () => {
    try{
      await lottery.methods.play().send({
        from : accounts[1],
        value : web3.utils.toWei('0.009', 'ether')
      });
      // should not run the false but should go to catch
      assert(false);
    }catch (err){
      assert(err);
      const players = await lottery.methods.showPlayers().call({
        from: accounts[0]
      });
      assert.equal(0, players.length);
    }
  });

  it("Others cant pick Lucky", async () => {
    try{
      await lottery.methods.pickLucky().send({
        from : accounts[1],
      });
      // should not run the false but should go to catch
      assert(false);
    }catch (err){
      assert(err);
    }
  });

  it("End to End test contract", async () => {
      // player 1 playes
      await lottery.methods.play().send({
        from : accounts[1],
        value : web3.utils.toWei('2', 'ether')
      });

      const initialBalance = await web3.eth.getBalance(accounts[1]);

      // pick winner by owner
      await lottery.methods.pickLucky().send({
        from : accounts[0],
      });

      const afterBalance = await web3.eth.getBalance(accounts[1]);

      const players = await lottery.methods.showPlayers().call({
        from: accounts[0]
      });
      const diff = afterBalance - initialBalance;
      // console.log(diff);
      // game resetted
      assert.equal(0, players.length);
      // difference gonna be slightly less than 2 eth because of the gas
      assert(diff > web3.utils.toWei('1.8', 'ether'));
      assert.equal()
  });
});

// ✓ Deploys the lottery contract
// ✓ Owner set correctly
// ✓ 1st player playing (96ms)
// ✓ multiple players playing (155ms)
// ✓ Try to play with less ether (61ms)
// ✓ Others cant pick Lucky
// ✓ End to End test contract (106ms)
//
// 7 passing (1s)
