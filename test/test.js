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

    it("initially, accounts count is 0", async () => {
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
      /*  SUCCESS */
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

      /* FAILURE */
      //   Account holder name is req
      await dAppPay.createAccount(
        "",
        "abc@dpay",
        9912283290,
        "google-id-30",
        "3455",
        { from: deployer }
      ).should.be.rejected;
      //  Account number must be unique
      await dAppPay.createAccount(
        "Yoyoyoy",
        "abc@dpay",
        9912283290,
        "google-id-30",
        "3455",
        { from: receiver }
      ).should.be.rejected;
    });

    it("lists accounts", async () => {
      //   SUCCESS
      let account = await dAppPay.accounts(accountsCount);
      //   console.log(account);
      assert.equal(account.accountNo, sender, "account no. is correct");
      assert.equal(
        account.accountHolderName,
        "Abhilash MH",
        "account holder name is correct"
      );
      assert.equal(account.dpayId, "a7@dpay", "account dpay id is correct");
      assert.equal(
        account.phoneNo.toNumber(),
        9939283292,
        "account phone no. is correct"
      );
      assert.equal(
        account.googleId,
        "google-id-10",
        "account google id is correct"
      );
      assert.equal(account.pin.toString(), "1234", "account pin is correct");
    });

    it("edit account", async () => {
      /*  SUCCESS */
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

      /* FAILURE */
      // invalid account id
      await dAppPay.editAccount(
        4,
        "A7 Abhilash",
        "a7abhilash@dpay",
        9939283292,
        "5678",
        true,
        { from: sender }
      ).should.be.rejected;
      // primary account status is required
      await dAppPay.editAccount(
        1,
        "A7 Abhilash",
        "a7abhilash@dpay",
        9939283292,
        "5678",
        "",
        { from: sender }
      ).should.be.rejected;
      // only account holder can edit the details
      await dAppPay.editAccount(
        4,
        "A7 Abhilash",
        "a7abhilash@dpay",
        9939283292,
        "5678",
        true,
        { from: receiver }
      ).should.be.rejected;
    });
  });

  describe("transaction", async () => {
    let result, transactionsCount;

    it("send amount", async () => {
      /* SUCCESS */
      let oldReceiverBalance;
      oldReceiverBalance = await web3.eth.getBalance(receiver);
      oldReceiverBalance = new web3.utils.BN(oldReceiverBalance);

      result = await dAppPay.sendAmount(receiver, {
        from: sender,
        value: web3.utils.toWei("1.5", "ether"),
      });
      transactionsCount = await dAppPay.transactionsCount();

      const event = result.logs[0].args;
      //   console.log(event);
      assert.equal(transactionsCount, 1, "transaction count is correct");
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

      /* FAILURE */
      //   invalid sender account no.
      await dAppPay.sendAmount(accounts[4], {
        from: sender,
        value: web3.utils.toWei("1.5", "ether"),
      }).should.be.rejected;
      //   invalid receiver account no.
      await dAppPay.sendAmount(receiver, {
        from: accounts[5],
        value: web3.utils.toWei("1.5", "ether"),
      }).should.be.rejected;
    });

    it("lists transactions", async () => {
      //   SUCCESS
      let transaction = await dAppPay.transactions(transactionsCount);
      //   console.log(transaction);
      assert.equal(transaction.sender, sender, "sender is correct");
      assert.equal(transaction.receiver, receiver, "receiver is correct");
      assert.equal(
        transaction.amount.toString(),
        web3.utils.toWei("1.5", "ether"),
        "amount transferred is correct"
      );
    });
  });
});
