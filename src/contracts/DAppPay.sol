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
		bytes32 pin;
		bool isPrimaryAccount;
	}

	/* Store request-money */
	uint public requestsCount;
	mapping(uint => Request) public requests;
	struct Request{
		address requestingTo;
		address payable requestingFrom;
		uint amount;
		uint time;
		bool isFulfilled;
		bool isRejected;
	}

	/* Store transaction history */
	uint public transactionsCount;
	mapping(uint => Transaction) public transactions;
	struct Transaction{
		address sender;
		address payable receiver;
		uint amount;
		uint time;
	}

	constructor() public{
		name = "DAppPay";
		accountsCount = 0;
	}

	/* Modifiers */
	modifier onlyExistingAccount{
		require(accountNumbers[msg.sender], 'Sender account number is invalid!');
      	_;
	}

	modifier onlyUniqiueAccount{
		require(!accountNumbers[msg.sender], 'Account number already exists!');
      	_;
	}

	/* Events */
	event AccountCreated(address payable accountNo, string accountHolderName, string dpayId, uint phoneNo, string googleId, bool isPrimaryAccount);
	event AccountEdited(address payable accountNo, string accountHolderName, string dpayId, uint phoneNo, string googleId, bool isPrimaryAccount);
	event AmmountTransfered(address sender, address payable receiver, uint amount);
	event AmmountRequested(address requestingTo, address payable requestingFrom, uint amount, bool isFulfilled, bool isRejected);
	event FulFillAmmountRequested(address requestingTo, address payable requestingFrom, uint amount, bool isFulfilled, bool isRejected);
	event RejectAmmountRequested(address requestingTo, address payable requestingFrom, uint amount, bool isFulfilled, bool isRejected);

	/* Main Functions */
	function createAccount(string memory _accountHolderName, string memory _dpayId, uint _phoneNo, string memory _googleId, string memory _pin) public onlyUniqiueAccount{
		// Make sure the inputs exists
		require(msg.sender != address(0x0), "Account no. is required");
		require(bytes(_accountHolderName).length > 0, "Account holder name is required");
		require(bytes(_dpayId).length > 0, "Account dpay id is required");
		require(_phoneNo != 0, "A valid account phone no(10 digits) is required");
		require(bytes(_googleId).length > 0, "Account google id is required");
		require(bytes(_pin).length == 4, "Valid account pin(4 digits) is required");

		// Add account
		accountsCount++;
		accounts[accountsCount] = Account(msg.sender, _accountHolderName, _dpayId, _phoneNo, _googleId, keccak256(bytes(_pin)), false);
		accountNumbers[msg.sender] = true;

		// Trigger event
		emit AccountCreated(msg.sender, _accountHolderName,_dpayId, _phoneNo, _googleId, false);
	}

	function editAccount(uint _accountId, string memory _accountHolderName, string memory _dpayId, uint _phoneNo, string memory _oldPin, string memory _newPin, bool _isPrimaryAccount) public onlyExistingAccount{
		// Make sure account id is valid
		require(_accountId > 0 && _accountId <= accountsCount, "Account is invalid");

		Account memory _account = accounts[_accountId];

		// Make sure account pin is same as the pin entered by the user(sender)
		require(_getAccountPin(msg.sender) == keccak256(bytes(_oldPin)), "Pin is wrong!");

		// Make sure the inputs exists
		require(msg.sender != address(0x0), "Account no. is required");
		require(bytes(_accountHolderName).length > 0, "Account holder name is required");
		require(bytes(_dpayId).length > 0, "Account dpay id is required");
		require(_phoneNo != 0, "A valid account phone no(10 digits) is required");
		require(bytes(_oldPin).length == 4, "Valid account pin(4 digits) is required");
		require(bytes(_newPin).length == 4, "Valid account pin(4 digits) is required");
		require(_isPrimaryAccount == false || _isPrimaryAccount == true, "Primary account status is required");

		// Make sure account address is msg.sender only
		require(_account.accountNo == msg.sender, "Only account holder can edit the account details");

		// Edit account
		_account.accountHolderName = _accountHolderName;
		_account.dpayId = _dpayId;
		_account.phoneNo = _phoneNo;
		_account.pin = keccak256(bytes(_newPin));
		_account.isPrimaryAccount = _isPrimaryAccount;

		// Store edited account
		accounts[_accountId] = _account;

		// Trigger event
		emit AccountEdited(msg.sender, _account.accountHolderName, _account.dpayId, _account.phoneNo, _account.googleId, _account.isPrimaryAccount);
	}

	function sendAmount(address payable _receiver, string memory _pin) public payable onlyExistingAccount{
		// Make sure receiver account address exists
		require(accountNumbers[_receiver], "Receiver account number is invalid!" );

		// Make sure account pin is same as the pin entered by the user(sender)
		require(_getAccountPin(msg.sender) == keccak256(bytes(_pin)), "Pin is wrong!");

		// Transfer amount to receiver
		address(_receiver).transfer(msg.value);
		transactionsCount++;
		transactions[transactionsCount] = Transaction(msg.sender, _receiver, msg.value, block.timestamp);

		// Trigger event
		emit AmmountTransfered(msg.sender, _receiver, msg.value);
	}

	function requestAmount(address _requestTo, uint _amount) public onlyExistingAccount{
		// Make sure requested account address exists
		require(accountNumbers[_requestTo], "Requested account number is invalid!" );
		// Make sure requested amount is valid
		require(_amount > 0, "Requested amount must be more than 0 ETH!" );

		// Add request
		requestsCount++;
		requests[requestsCount] = Request(_requestTo, msg.sender, _amount, block.timestamp, false, false);

		// Trigger event
		emit AmmountRequested(_requestTo, msg.sender, _amount, false, false);
	}

	function fulfillRequestedAmount(uint requestId, string memory _pin) public payable onlyExistingAccount{
		// Make sure request id is valid
		require(requestId > 0 && requestId <= requestsCount, "Invalid request id");

		Request memory _request = requests[requestId];

		// Make sure request is not rejected
		require(!_request.isRejected, "Request is already rejected");

		// Make sure requested address is changing the data
		require(_request.requestingTo == msg.sender, "Requested account no. is not yours");

		// Make transaction
		sendAmount(_request.requestingFrom, _pin);

		// Mark request as fulfilled
		_request.isFulfilled = true;
		requests[requestId] = _request;
		
		// Trigger event
		emit FulFillAmmountRequested(_request.requestingTo, _request.requestingFrom, _request.amount, _request.isFulfilled, _request.isRejected);
	}

	function rejectRequestedAmount(uint requestId) public onlyExistingAccount{
		// Make sure request id is valid
		require(requestId > 0 && requestId <= requestsCount, "Invalid request id");
		
		Request memory _request = requests[requestId];

		// Make sure request is not fulfilled
		require(!_request.isFulfilled, "Request is already fulfilled");

		// Make sure requested address is changing the data
		require(_request.requestingTo == msg.sender, "Requested account no. is not yours");


		// Mark request as rejected
		_request.isRejected = true;
		requests[requestId] = _request;
		
		// Trigger event
		emit RejectAmmountRequested(_request.requestingTo, _request.requestingFrom, _request.amount, _request.isFulfilled, _request.isRejected);
	}

	/* Helper Functions */
	function _getAccountUsingAccountNumber(address _accountNo) public view onlyExistingAccount returns(Account memory){
		for(uint i=1; i<=accountsCount; i++){
			if(accounts[i].accountNo == _accountNo){
				Account memory _account = accounts[i];
				_account.pin = "";
				return _account;
			}
		}
	}

	function _getAccountUsingDpayId(string memory _dpayid) public view onlyExistingAccount returns(Account memory){
		for(uint i=1; i<=accountsCount; i++){
			if(accounts[i].dpayid == _dpayid){
				Account memory _account = accounts[i];
				_account.pin = "";
				return _account;
			}
		}
	}

	function _getAccountUsingPhoneNumber(uint _phoneNo) public view onlyExistingAccount returns(Account memory){
		for(uint i=1; i<=accountsCount; i++){
			if(accounts[i].phoneNo == _phoneNo){
				Account memory _account = accounts[i];
				_account.pin = "";
				return _account;
			}
		}
	}

	function _getAccountPin(address _accountNo) private view onlyExistingAccount returns(bytes32){
		for(uint i=1; i<=accountsCount; i++){
			if(accounts[i].accountNo == _accountNo){
				return accounts[i].pin;
			}
		}
	}
}