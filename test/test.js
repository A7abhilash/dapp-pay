const DAppPay = artifacts.require("./DAppPay.sol");

require("chai").use(require("chai-as-promised")).should();

contract("DAppPay", (accounts) => {
  let dAppPay;
  const [deployer, sender, receiver] = accounts;

  before(async () => {
    dAppPay = await DAppPay.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await dAppPay.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await dAppPay.name();
      assert.equal(name, "DAppPay");
    });

    it("accounts count is 0", async () => {
      const accountsCount = await dAppPay.accountsCount();
      assert.equal(accountsCount.toString(), "0");
    });
  });

  describe("accounts", async () => {
    let result, accountsCount;

    before(async () => {
      await dAppPay.createAccount(
        "Hello world",
        "hw@dpay",
        9939283290,
        "google-id-20",
        "8676",
        { from: receiver }
      );
      result = await dAppPay.createAccount(
        "Abhilash MH",
        "a7@dpay",
        9939283292,
        "google-id-10",
        "1234",
        { from: sender }
      );
      accountsCount = await dAppPay.accountsCount();
    });

    it("creates account", async () => {
      //   SUCCESS
      assert.equal(accountsCount, 2, "accounts count is correct");
      const event = result.logs[0].args;
      //   console.log(event);
      assert.equal(event.accountNo, sender, "account no. is correct");
      assert.equal(
        event.accountHolderName,
        "Abhilash MH",
        "account holder name is correct"
      );
      assert.equal(event.dpayId, "a7@dpay", "account dpay id is correct");
      assert.equal(
        event.phoneNo.toNumber(),
        9939283292,
        "account phone no. is correct"
      );
      assert.equal(
        event.googleId,
        "google-id-10",
        "account google id is correct"
      );
      assert.equal(event.isPrimaryAccount, false, "account is not primary");
    });

    it("edit account", async () => {
      //   SUCCESS
      result = await dAppPay.editAccount(
        accountsCount,
        "A7 Abhilash",
        "a7abhilash@dpay",
        9939283292,
        "5678",
        true,
        { from: sender }
      );
      const event = result.logs[0].args;
      //   console.log(event);
      assert.equal(event.accountNo, sender, "account no. is correct");
      assert.equal(
        event.accountHolderName,
        "A7 Abhilash",
        "account holder name is correct"
      );
      assert.equal(
        event.dpayId,
        "a7abhilash@dpay",
        "account dpay id is correct"
      );
      assert.equal(
        event.phoneNo.toNumber(),
        9939283292,
        "account phone no. is correct"
      );
      assert.equal(
        event.googleId,
        "google-id-10",
        "account google id is correct"
      );
      assert.equal(event.isPrimaryAccount, true, "account is primary");
    });

    // it("get all accounts", async () => {
    //   //   SUCCESS
    //   result = await dAppPay.getAllAccounts();
    //   console.log(result);
    //   assert.equal(result.length, 1, "accounts count is correct");
    //   let account = result[0];
    //   assert.equal(account.accountNo, sender, "account no. is correct");
    //   assert.equal(
    //     account.accountHolderName,
    //     "Abhilash MH",
    //     "account holder name is correct"
    //   );
    //   assert.equal(account.dpayId, "a7@dpay", "account dpay id is correct");
    //   assert.equal(
    //     event.phoneNo.toNumber(),
    //     9939283292,
    //     "account phone no. is correct"
    //   );
    //   assert.equal(
    //     account.googleId,
    //     "google-id-10",
    //     "account google id is correct"
    //   );
    //   assert.equal(account.pin.toString(), "1234", "account pin is correct");
    //   assert.equal(
    //     account.balance.toString(),
    //     web3.utils.toWei("100", "ether"),
    //     "account balance is correct"
    //   );
    // });
  });
  describe("transaction", async () => {
    let result;
    it("send amount", async () => {
      let oldReceiverBalance;
      oldReceiverBalance = await web3.eth.getBalance(receiver);
      oldReceiverBalance = new web3.utils.BN(oldReceiverBalance);

      result = await dAppPay.sendAmount(receiver, {
        from: sender,
        value: web3.utils.toWei("1.5", "ether"),
      });

      const event = result.logs[0].args;
      //   console.log(event);
      assert.equal(event.sender, sender, "sender is correct");
      assert.equal(event.receiver, receiver, "receiver is correct");
      assert.equal(
        event.amount.toString(),
        web3.utils.toWei("1.5", "ether"),
        "transferred amount is correct"
      );
      // Check receiver balance
      let newReceiverBalance;
      newReceiverBalance = await web3.eth.getBalance(receiver);
      newReceiverBalance = new web3.utils.BN(newReceiverBalance);

      let amountTransferred;
      amountTransferred = web3.utils.toWei("1.5", "Ether");
      amountTransferred = new web3.utils.BN(amountTransferred);

      const expectedBalance = oldReceiverBalance.add(amountTransferred);

      assert.equal(newReceiverBalance.toString(), expectedBalance.toString());
    });
  });
});
