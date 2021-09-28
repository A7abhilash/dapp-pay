pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract DAppPay{
	string public name;

	/* Store accounts */
	mapping(address => bool) public accountNumbers;
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

	/* Store transaction history */


	constructor() public{
		name = "DAppPay";
		accountsCount = 0;
	}

	/* Modifiers */
	// Check if account exist
	modifier onlyExistingAccount{
		require(accountNumbers[msg.sender], 'Sender account number is invalid!');
      	_;
	}

	// Check if account is unique
	modifier onlyUniqiueAccount{
		require(!accountNumbers[msg.sender], 'Account number already exists!');
      	_;
	}

	/* Events */
	event AccountCreated(address payable accountNo, string accountHolderName, string dpayId, uint phoneNo, string googleId, bool isPrimaryAccount);
	event AccountEdited(address payable accountNo, string accountHolderName, string dpayId, uint phoneNo, string googleId, bool isPrimaryAccount);
	event AmmountTransfered(address payable receiver, address sender, uint amount);

	function createAccount(string memory _accountHolderName, string memory _dpayId, uint _phoneNo, string memory _googleId, uint _pin) public onlyUniqiueAccount{
		// Make sure the inputs exists
		require(msg.sender != address(0x0), "Account no. is required");
		require(bytes(_accountHolderName).length > 0, "Account holder name is required");
		require(bytes(_dpayId).length > 0, "Account dpay id is required");
		require(_phoneNo != 0, "A valid account phone no(10 digits) is required");
		require(bytes(_googleId).length > 0, "Account google id is required");
		require(_pin != 0, "Valid account pin(4 digits) is required");

		// Add account
		accountsCount++;
		accounts[accountsCount] = Account(msg.sender, _accountHolderName, _dpayId, _phoneNo, _googleId, _pin, false);
		accountNumbers[msg.sender] = true;
		emit AccountCreated(msg.sender, _accountHolderName,_dpayId, _phoneNo, _googleId, false);
	}

	function editAccount(uint _accountId, string memory _accountHolderName, string memory _dpayId, uint _phoneNo, uint _pin, bool _isPrimaryAccount) public onlyExistingAccount{
		// Make sure account id is valid
		require(_accountId > 0 && _accountId <= accountsCount, "Account is invalid");

		// Make sure the inputs exists
		require(msg.sender != address(0x0), "Account no. is required");
		require(bytes(_accountHolderName).length > 0, "Account holder name is required");
		require(bytes(_dpayId).length > 0, "Account dpay id is required");
		require(_phoneNo != 0, "A valid account phone no(10 digits) is required");
		require(_pin != 0, "Valid account pin(4 digits) is required");
		require(_isPrimaryAccount == false || _isPrimaryAccount == true, "Primary account status is required");

		Account memory _account = accounts[_accountId];

		// Make sure account address is msg.sender only
		require(_account.accountNo == msg.sender, "Only account holder can edit the account details");

		_account.accountHolderName = _accountHolderName;
		_account.dpayId = _dpayId;
		_account.phoneNo = _phoneNo;
		_account.pin = _pin;
		_account.isPrimaryAccount = _isPrimaryAccount;

		accounts[_accountId] = _account;
		emit AccountEdited(msg.sender, _account.accountHolderName, _account.dpayId, _account.phoneNo, _account.googleId, _account.isPrimaryAccount);
	}

	function sendAmount(address payable _receiver) public payable onlyExistingAccount{
		// make sure receiver account address exists
		require(accountNumbers[_receiver], "Receiver account number is invalid!" );
		
		address(_receiver).transfer(msg.value);
		emit AmmountTransfered(_receiver, msg.sender, msg.value);
	}
}