const DAppPay = artifacts.require("DAppPay");

module.exports = function (deployer) {
  deployer.deploy(DAppPay);
};
