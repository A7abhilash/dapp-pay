pragma solidity ^0.5.0;

contract DAppPay{
	string public name;

	/* Store accounts */
	uint public accountsCount;
	mapping(uint => Account) public accounts;
	struct Account{
		address payable accountNo;
		string accountHolderName;
		string dpayId;
		uint phoneNo;
		string googleId;
		uint pin;
		bool isPrimaryAccount;
	}

	constructor() public{
		name = "DAppPay";
		accountsCount = 0;
	}

	/* Modifiers */
	// TODO: Check if account exist using account address(number)

	/* Events */
	event AccountCreated(address payable accountNo, string accountHolderName, string dpayId, uint phoneNo, string googleId, bool isPrimaryAccount);
	event AccountEdited(address payable accountNo, string accountHolderName, string dpayId, uint phoneNo, string googleId, bool isPrimaryAccount);
	event AmmountTransfered(address payable receiver, address sender, uint amount);

	function createAccount(string memory _accountHolderName, string memory _dpayId, uint _phoneNo, string memory _googleId, uint _pin) public{
		// TODO Make sure the inputs exists

		// TODO make sure account address is unique

		// Add account
		accountsCount++;
		accounts[accountsCount] = Account(msg.sender, _accountHolderName,_dpayId, _phoneNo, _googleId, _pin, false);
		emit AccountCreated(msg.sender, _accountHolderName,_dpayId, _phoneNo, _googleId, false);
	}

	function editAccount(uint _accountId, string memory _accountHolderName, string memory _dpayId, uint _phoneNo, uint _pin, bool _isPrimaryAccount) public{
		// TODO make sure account id is valid

		// TODO Make sure the inputs exists

		Account memory _account = accounts[_accountId];

		// TODO make sure account address is msg.sender only

		_account.accountHolderName = _accountHolderName;
		_account.dpayId = _dpayId;
		_account.phoneNo = _phoneNo;
		_account.pin = _pin;
		_account.isPrimaryAccount = _isPrimaryAccount;

		accounts[_accountId] = _account;
		emit AccountEdited(msg.sender, _account.accountHolderName, _account.dpayId, _account.phoneNo, _account.googleId, _account.isPrimaryAccount);
	}

	function sendAmount(address payable _receiver) public payable{
		// TODO make sure sender and receiver account address exists
		
		address(_receiver).transfer(msg.value);
		emit AmmountTransfered(_receiver, msg.sender, msg.value);
	}
}